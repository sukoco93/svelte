import { crud } from '$lib/db/database';

// State reaktif
let dataCache = $state({});
let activeTab = $state('penjualan');
let searchQuery = $state('');
let dateFilter = $state({ type: 'semua', start: null, end: null });

// Modal state
let modalOpen = $state(false);
let modalMode = $state('add'); // 'add' | 'edit'
let modalData = $state({});
let modalConfig = $state(null);

export const appStore = {
  // Data
  get data() { return dataCache; },
  setData(key, val) { dataCache = { ...dataCache, [key]: val }; },

  // Tab
  get activeTab() { return activeTab; },
  setActiveTab(val) { activeTab = val; },

  // Search & Filter
  get searchQuery() { return searchQuery; },
  setSearchQuery(val) { searchQuery = val; },
  get dateFilter() { return dateFilter; },
  setDateFilter(val) { dateFilter = val; },

  // Modal
  get modalOpen() { return modalOpen; },
  setModalOpen(val) { modalOpen = val; },
  get modalMode() { return modalMode; },
  setModalMode(val) { modalMode = val; },
  get modalData() { return modalData; },
  setModalData(val) { modalData = val; },
  get modalConfig() { return modalConfig; },
  setModalConfig(val) { modalConfig = val; },

  // Actions
  async loadData(key) {
    const items = await crud.getAll(key);
    this.setData(key, items);
    return items;
  },

  async saveData(table, payload) {
    if (modalMode === 'add') {
      await crud.add(table, payload);
    } else {
      await crud.update(table, modalData.id, payload);
    }
    await this.loadData(table);
    this.setModalOpen(false);
  },

  async deleteItem(table, id) {
    if (confirm('Yakin hapus data ini?')) {
      await crud.remove(table, id);
      await this.loadData(table);
    }
  },

  resetFilter() {
    searchQuery = '';
    dateFilter = { type: 'semua', start: null, end: null };
  }
};