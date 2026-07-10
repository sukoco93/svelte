export const sendWA = (nomor, pesan = '') => {
  const url = `https://wa.me/6285963172893?text=${encodeURIComponent(pesan)}`;
  window.open(url, '_blank');
};