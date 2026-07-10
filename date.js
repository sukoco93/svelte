import dayjs from 'dayjs';

export const formatDate = (date) => dayjs(date).format('DD/MM/YYYY');

export const filterByDate = (items, filter) => {
  if (!filter || filter.type === 'semua' || !items) return items;
  
  const today = dayjs().startOf('day');
  
  if (filter.type === 'hari_ini') {
    return items.filter(item => dayjs(item.tanggal).isSame(today, 'day'));
  }
  if (filter.type === 'kemarin') {
    return items.filter(item => dayjs(item.tanggal).isSame(today.subtract(1, 'day'), 'day'));
  }
  if (filter.type === 'rentang' && filter.start && filter.end) {
    const start = dayjs(filter.start).startOf('day');
    const end = dayjs(filter.end).endOf('day');
    return items.filter(item => dayjs(item.tanggal).isBetween(start, end, null, '[]'));
  }
  return items;
};