import Dexie from 'dexie';

const db = new Dexie('AppDB');
db.version(1).stores({
  pelanggan: '++id, nama, hp',
  penjualan: '++id, tanggal, pelanggan, total, keterangan',
  produksi: '++id, tanggal, qtyBahan, qtyProduk',
  kas: '++id, tanggal, keterangan, nominal, jenis',
});

export default db;

export const crud = {
  async getAll(table) {
    return await db[table].toArray();
  },
  async add(table, data) {
    return await db[table].add({ ...data, createdAt: new Date().toISOString() });
  },
  async update(table, id, data) {
    return await db[table].update(id, data);
  },
  async remove(table, id) {
    return await db[table].delete(id);
  },
  async bulkAdd(table, data) {
    return await db[table].bulkAdd(data);
  },
  async clear(table) {
    return await db[table].clear();
  },
  async exportAll() {
    const all = {};
    for (const key of ['pelanggan', 'penjualan', 'produksi', 'kas']) {
      all[key] = await db[key].toArray();
    }
    return all;
  },
  async importAll(data) {
    for (const key of ['pelanggan', 'penjualan', 'produksi', 'kas']) {
      if (data[key]) {
        await db[key].bulkPut(data[key]);
      }
    }
  },
};