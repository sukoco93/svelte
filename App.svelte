<script>
  import { appStore } from '$lib/stores/app.svelte.js';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import DataTable from '$lib/components/DataTable.svelte';
  import { keys, tableConfigs } from '$lib/config/tables.js';
  import { crud } from '$lib/db/database.js';
  import { appStore as store } from '$lib/stores/app.svelte.js';
  
  // Backup & Restore
  async function backup() {
    const data = await crud.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  async function restore(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        await crud.importAll(data);
        alert('Restore berhasil!');
        // Reload semua data
        for (const key of keys) {
          await store.loadData(key);
        }
      } catch (err) {
        alert('Gagal restore: ' + err);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  // Listen FAB from BottomNav
  function handleFAB(e) {
    const tab = e.detail.tab;
    const cfg = tableConfigs[tab];
    appStore.setModalConfig(cfg);
    appStore.setModalMode('add');
    appStore.setModalData({});
    appStore.setModalOpen(true);
  }
  window.addEventListener('fab-click', handleFAB);
</script>

<div class="max-w-lg mx-auto px-4 pb-24 pt-4 h-screen overflow-y-auto scroll-smooth">
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Aplikasi Saya</h1>
    <div class="flex gap-2">
      <button onclick={backup} class="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-600 font-medium transition">Backup</button>
      <label class="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-600 font-medium transition cursor-pointer">
        Restore
        <input type="file" accept=".json" onchange={restore} class="hidden" />
      </label>
    </div>
  </div>

  <!-- Render DataTable berdasarkan tab aktif -->
  {#each keys as key}
    {#if appStore.activeTab === key}
      <DataTable configKey={key} />
    {/if}
  {/each}
</div>

<BottomNav />

<!-- Import modal untuk dikelola oleh DataTable, tapi kita perlu store modal di appStore -->
<!-- Tidak perlu render di sini karena DataTable sudah render FormModal masing-masing -->
<!-- Tapi agar tidak duplicate, kita render sekali di App saja -->
<script>
  import FormModal from '$lib/components/FormModal.svelte';
  import { tableConfigs as cfgMap } from '$lib/config/tables.js';
  
  async function handleGlobalSave(e) {
    const tab = appStore.activeTab;
    await appStore.saveData(tab, e.detail);
    await appStore.loadData(tab);
  }
</script>

<FormModal on:save={handleGlobalSave} />

<style>
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
</style>