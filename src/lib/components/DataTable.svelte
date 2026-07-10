<script>
  import { appStore } from '$lib/stores/app.svelte.js';
  import { crud } from '$lib/db/database.js';
  import { formatDate, filterByDate } from '$lib/utils/date.js';
  import { exportCSV, importCSV } from '$lib/utils/csv.js';
  import { sendWA } from '$lib/utils/whatsapp.js';
  import FormModal from './FormModal.svelte';
  import FilterBar from './FilterBar.svelte';
  import { createVirtualizer } from '@tanstack/svelte-virtual';
  import { Pencil, Trash2, Upload, Download, Plus } from 'lucide-svelte';
  import { tableConfigs } from '$lib/config/tables.js';

  let { configKey } = $props();

  const currentConfig = $derived(tableConfigs[configKey]);
  let containerRef = $state(null);
  let items = $state([]);
  let loading = $state(true);

  async function load() {
    loading = true;
    await appStore.loadData(configKey);
    items = appStore.data[configKey] || [];
    loading = false;
  }
  load();

  const filteredItems = $derived(() => {
    let data = items;
    if (!data) return [];

    const q = appStore.searchQuery.toLowerCase().trim();
    if (q) {
      data = data.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(q)
        )
      );
    }

    data = filterByDate(data, appStore.dateFilter);
    return data;
  });

  const virtualizer = createVirtualizer({
    get count() { return filteredItems().length; },
    get scrollElement() { return containerRef; },
    estimateSize: () => 44,
    overscan: 5,
  });

  function openModal(mode, data = null) {
    appStore.setModalConfig(currentConfig);
    appStore.setModalMode(mode);
    appStore.setModalData(data || {});
    appStore.setModalOpen(true);
  }

  async function handleSave(event) {
    await appStore.saveData(configKey, event.detail);
    await load();
  }

  async function deleteItem(id) {
    if (confirm('Yakin hapus?')) {
      await crud.remove(configKey, id);
      await load();
    }
  }

  function handleExport() {
    exportCSV(filteredItems(), currentConfig.columns, currentConfig.name);
  }

  async function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const data = await importCSV(file, currentConfig.columns);
      if (data.length === 0) return alert('Tidak ada data valid');
      await crud.bulkAdd(configKey, data);
      await load();
      alert(`Berhasil import ${data.length} data!`);
    } catch (err) {
      alert('Gagal import: ' + err);
    }
    event.target.value = '';
  }

  const kasSummary = $derived(() => {
    if (configKey !== 'kas') return null;
    const totalMasuk = items.filter(i => i.jenis === 'Masuk').reduce((a, b) => a + (b.nominal || 0), 0);
    const totalKeluar = items.filter(i => i.jenis === 'Keluar').reduce((a, b) => a + (b.nominal || 0), 0);
    return { masuk: totalMasuk, keluar: totalKeluar, saldo: totalMasuk - totalKeluar };
  });

  function onRowDblClick(row) {
    if (currentConfig.isPenjualan) {
      const pesan = `Halo, saya dari toko. Total belanja anda: Rp${row.total?.toLocaleString() || 0}. Terima kasih!`;
      sendWA('6285963172893', pesan);
    }
  }
</script>

<FilterBar />

{#if loading}
  <div class="flex justify-center py-8"><span class="text-blue-500">Loading...</span></div>
{:else}
  {#if kasSummary}
    <div class="grid grid-cols-3 gap-3 mt-4 mb-4">
      <div class="bg-gradient-to-br from-green-50 to-green-100/60 p-3 rounded-xl border border-green-200/50">
        <p class="text-xs text-green-600 font-medium">Saldo Akhir</p>
        <p class="text-lg font-bold text-green-700">Rp {kasSummary.saldo.toLocaleString()}</p>
      </div>
      <div class="bg-gradient-to-br from-blue-50 to-blue-100/60 p-3 rounded-xl border border-blue-200/50">
        <p class="text-xs text-blue-600 font-medium">Total Masuk</p>
        <p class="text-lg font-bold text-blue-700">Rp {kasSummary.masuk.toLocaleString()}</p>
      </div>
      <div class="bg-gradient-to-br from-red-50 to-red-100/60 p-3 rounded-xl border border-red-200/50">
        <p class="text-xs text-red-600 font-medium">Total Keluar</p>
        <p class="text-lg font-bold text-red-700">Rp {kasSummary.keluar.toLocaleString()}</p>
      </div>
    </div>
  {/if}

  <div class="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden mt-3">
    <div class="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-gray-100 bg-gray-50/50">
      <span class="text-sm font-semibold text-gray-600">{currentConfig.name}</span>
      <div class="flex gap-1.5">
        <button onclick={handleExport} class="p-1.5 rounded-lg hover:bg-gray-200/70 text-gray-500 transition" title="Export CSV"><Download class="w-4 h-4" /></button>
        <label class="p-1.5 rounded-lg hover:bg-gray-200/70 text-gray-500 transition cursor-pointer" title="Import CSV">
          <Upload class="w-4 h-4" />
          <input type="file" accept=".csv" onchange={handleImport} class="hidden" />
        </label>
        <button onclick={() => openModal('add')} class="p-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm"><Plus class="w-4 h-4" /></button>
      </div>
    </div>

    <div bind:this={containerRef} class="h-[460px] overflow-auto relative">
      <table class="w-full text-sm">
        <thead class="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 border-b border-gray-200">
          <tr>
            {#each currentConfig.columns as col}
              <th class="text-left py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">{col.label}</th>
            {/each}
            <th class="text-left py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider w-20">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each virtualizer.getVirtualItems() as virtualRow (virtualRow.key)}
            {@const row = filteredItems()[virtualRow.index]}
            <tr 
              class="border-b border-gray-50 hover:bg-blue-50/30 transition-colors {currentConfig.isPenjualan ? 'cursor-pointer' : ''}"
              style="height: {virtualRow.size}px; transform: translateY({virtualRow.start}px);"
              ondblclick={() => onRowDblClick(row)}
            >
              {#each currentConfig.columns as col}
                <td class="py-2 px-4 text-gray-700 truncate max-w-[150px]">
                  {#if col.type === 'date'}
                    {formatDate(row[col.key])}
                  {:else if col.type === 'number'}
                    {row[col.key]?.toLocaleString()}
                  {:else}
                    {row[col.key] ?? '-'}
                  {/if}
                </td>
              {/each}
              <td class="py-2 px-4">
                <div class="flex gap-1">
                  <button onclick={() => openModal('edit', row)} class="p-1 rounded hover:bg-blue-100 text-blue-500 transition"><Pencil class="w-3.5 h-3.5" /></button>
                  <button onclick={() => deleteItem(row.id)} class="p-1 rounded hover:bg-red-100 text-red-400 transition"><Trash2 class="w-3.5 h-3.5" /></button>
                </div>
              </td>
            </tr>
          {:else}
            <tr><td colspan={currentConfig.columns.length + 1} class="text-center py-12 text-gray-400 text-sm">Tidak ada data ditemukan</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}

<FormModal on:save={handleSave} />
