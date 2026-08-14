export const notifyDataChanged = () => {
  window.dispatchEvent(new Event('app_data_changed'));
};
