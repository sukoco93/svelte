// Definisi tunggal untuk semua modul. Tambah / hapus field di sini saja.
export const tableConfigs = {
  pelanggan: {
    name: 'Pelanggan',
    dbName: 'pelanggan',
    icon: 'Users',
    columns: [
      { key: 'nama', label: 'Nama', type: 'text' },
      { key: 'hp', label: 'No. HP', type: 'text' },
    ],
    formFields: ['nama', 'hp'],
    defaultSort: 'nama',
  },
  penjualan: {
    name: 'Penjualan',
    dbName: 'penjualan',
    icon: 'ShoppingBag',
    columns: [
      { key: 'tanggal', label: 'Tanggal', type: 'date' },
      { key: 'pelanggan', label: 'Pelanggan', type: 'text' },
      { key: 'total', label: 'Total (Rp)', type: 'number' },
      { key: 'keterangan', label: 'Keterangan', type: 'text' },
    ],
    formFields: ['tanggal', 'pelanggan', 'total', 'keterangan'],
    defaultSort: 'tanggal',
    isPenjualan: true, // untuk trigger WA
  },
  produksi: {
    name: 'Produksi',
    dbName: 'produksi',
    icon: 'Package',
    columns: [
      { key: 'tanggal', label: 'Tanggal', type: 'date' },
      { key: 'qtyBahan', label: 'Qty Bahan', type: 'number' },
      { key: 'qtyProduk', label: 'Qty Produk', type: 'number' },
    ],
    formFields: ['tanggal', 'qtyBahan', 'qtyProduk'],
    defaultSort: 'tanggal',
  },
  kas: {
    name: 'Kas',
    dbName: 'kas',
    icon: 'Wallet',
    columns: [
      { key: 'tanggal', label: 'Tanggal', type: 'date' },
      { key: 'keterangan', label: 'Keterangan', type: 'text' },
      { key: 'nominal', label: 'Nominal (Rp)', type: 'number' },
      { key: 'jenis', label: 'Jenis', type: 'select', options: ['Masuk', 'Keluar'] },
    ],
    formFields: ['tanggal', 'keterangan', 'nominal', 'jenis'],
    defaultSort: 'tanggal',
    isKas: true,
  },
};

export const getConfig = (key) => tableConfigs[key];
export const keys = Object.keys(tableConfigs);