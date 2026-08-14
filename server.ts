import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to extract or resolve Steam ID64
function extractSteamIdentifier(input: string): { type: 'steamid' | 'vanity'; value: string } {
  const cleanInput = input.trim();

  // Match full profile URL
  const profileUrlMatch = cleanInput.match(/steamcommunity\.com\/profiles\/(\d{17})/i);
  if (profileUrlMatch) {
    return { type: 'steamid', value: profileUrlMatch[1] };
  }

  // Match vanity URL
  const vanityUrlMatch = cleanInput.match(/steamcommunity\.com\/id\/([a-zA-Z0-9_-]+)/i);
  if (vanityUrlMatch) {
    return { type: 'vanity', value: vanityUrlMatch[1] };
  }

  // Match standalone 17-digit SteamID64
  if (/^\d{17}$/.test(cleanInput)) {
    return { type: 'steamid', value: cleanInput };
  }

  // Otherwise assume vanity username
  return { type: 'vanity', value: cleanInput.replace(/[^a-zA-Z0-9_-]/g, '') };
}

// XML parser helper for Steam Community XML
function parseSteamXmlGames(xmlText: string) {
  const games: Array<{
    appId: number;
    name: string;
    logoUrl?: string;
    headerUrl?: string;
    hoursOnRecord?: number;
  }> = [];

  // Check for error/private profile
  if (xmlText.includes('<error>') && xmlText.includes('private')) {
    return { error: 'private', games: [] };
  }

  // Extract steamID / displayName
  const steamIdMatch = xmlText.match(/<steamID64>(\d+)<\/steamID64>/);
  const displayNameMatch = xmlText.match(/<steamID><!\[CDATA\[(.*?)\]\]><\/steamID>/) || xmlText.match(/<steamID>(.*?)<\/steamID>/);

  const steamId = steamIdMatch ? steamIdMatch[1] : undefined;
  const displayName = displayNameMatch ? displayNameMatch[1] : undefined;

  // Extract individual <game> blocks
  const gameBlocks = xmlText.match(/<game>([\s\S]*?)<\/game>/g) || [];

  for (const block of gameBlocks) {
    const appMatch = block.match(/<appID>(\d+)<\/appID>/);
    const nameMatch = block.match(/<name><!\[CDATA\[(.*?)\]\]><\/name>/) || block.match(/<name>(.*?)<\/name>/);
    const logoMatch = block.match(/<logo><!\[CDATA\[(.*?)\]\]><\/logo>/) || block.match(/<logo>(.*?)<\/logo>/);
    const hoursMatch = block.match(/<hoursOnRecord>([0-9.,]+)<\/hoursOnRecord>/);

    if (appMatch && nameMatch) {
      const appId = parseInt(appMatch[1], 10);
      const name = nameMatch[1].trim();
      const logoUrl = logoMatch ? logoMatch[1].trim() : undefined;
      const hoursOnRecord = hoursMatch ? parseFloat(hoursMatch[1].replace(',', '')) : 0;
      const headerUrl = `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;

      if (name) {
        games.push({
          appId,
          name,
          logoUrl,
          headerUrl,
          hoursOnRecord
        });
      }
    }
  }

  return { steamId, displayName, games };
}

// Steam API Handler
app.get('/api/steam/games', async (req: Request, res: Response): Promise<void> => {
  const query = (req.query.id as string || req.query.query as string || '').trim();
  if (!query) {
    res.status(400).json({ error: 'Harap masukkan Steam ID, URL profil, atau username Steam.' });
    return;
  }

  const apiKey = process.env.STEAM_API_KEY;
  const target = extractSteamIdentifier(query);

  try {
    let steamId64 = target.type === 'steamid' ? target.value : '';

    // Step 1: If it's a vanity name and we have API key, try resolving via Web API
    if (target.type === 'vanity' && apiKey) {
      try {
        const resolveRes = await fetch(
          `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${encodeURIComponent(target.value)}`
        );
        if (resolveRes.ok) {
          const resolveData = await resolveRes.json();
          if (resolveData.response && resolveData.response.success === 1) {
            steamId64 = resolveData.response.steamid;
          }
        }
      } catch (err) {
        console.warn('ResolveVanityURL API failed, trying community XML fallback', err);
      }
    }

    // Step 2: If we have SteamID64 and API key, call GetOwnedGames
    if (steamId64 && apiKey) {
      try {
        const [gamesRes, summaryRes] = await Promise.all([
          fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId64}&include_appinfo=1&include_played_free_games=1&format=json`),
          fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId64}`)
        ]);

        if (gamesRes.ok) {
          const gamesData = await gamesRes.json();
          let playerSummary: any = null;
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            playerSummary = summaryData?.response?.players?.[0];
          }

          if (gamesData.response && Array.isArray(gamesData.response.games)) {
            const games = gamesData.response.games.map((g: any) => ({
              appId: g.appid,
              name: g.name,
              playtimeForever: g.playtime_forever,
              hoursOnRecord: Math.round(((g.playtime_forever || 0) / 60) * 10) / 10,
              iconUrl: g.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg` : undefined,
              headerUrl: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${g.appid}/header.jpg`
            })).sort((a: any, b: any) => b.hoursOnRecord - a.hoursOnRecord);

            res.json({
              success: true,
              steamId: steamId64,
              displayName: playerSummary?.personaname || target.value,
              avatarUrl: playerSummary?.avatarfull || playerSummary?.avatar,
              profileUrl: playerSummary?.profileurl || `https://steamcommunity.com/profiles/${steamId64}`,
              gameCount: games.length,
              games
            });
            return;
          }
        }
      } catch (apiErr) {
        console.warn('Steam Web API call failed, attempting XML community fallback:', apiErr);
      }
    }

    // Step 3: Community XML Fallback (works for public profiles without requiring API key)
    const xmlUrl = target.type === 'steamid'
      ? `https://steamcommunity.com/profiles/${target.value}/games?xml=1`
      : `https://steamcommunity.com/id/${encodeURIComponent(target.value)}/games?xml=1`;

    const xmlFetch = await fetch(xmlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/xml,text/xml'
      }
    });

    if (!xmlFetch.ok) {
      res.status(404).json({
        error: `Profil Steam "${query}" tidak ditemukan atau server Steam tidak merespons.`
      });
      return;
    }

    const xmlContent = await xmlFetch.text();
    const parsed = parseSteamXmlGames(xmlContent);

    if (parsed.error === 'private') {
      res.status(403).json({
        error: 'Profil Steam ini disetel ke mode PRIVAT. Harap ubah setelan privasi profil & Game Details di Steam menjadi PUBLIK terlebih dahulu untuk mengimpor library.',
        isPrivate: true
      });
      return;
    }

    if (!parsed.games || parsed.games.length === 0) {
      res.status(404).json({
        error: 'Tidak ditemukan daftar game pada profil Steam ini. Pastikan profil Steam dan detail game disetel ke PUBLIK di pengaturan privasi Steam.',
        isPrivate: true
      });
      return;
    }

    // Sort by hours on record descending
    parsed.games.sort((a, b) => (b.hoursOnRecord || 0) - (a.hoursOnRecord || 0));

    res.json({
      success: true,
      steamId: parsed.steamId || (target.type === 'steamid' ? target.value : ''),
      displayName: parsed.displayName || target.value,
      avatarUrl: undefined,
      profileUrl: target.type === 'steamid'
        ? `https://steamcommunity.com/profiles/${target.value}`
        : `https://steamcommunity.com/id/${target.value}`,
      gameCount: parsed.games.length,
      games: parsed.games
    });
  } catch (err: any) {
    console.error('Steam fetching error:', err);
    res.status(500).json({
      error: 'Terjadi kegagalan saat mengambil data dari Steam: ' + (err.message || 'Error internal server')
    });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
