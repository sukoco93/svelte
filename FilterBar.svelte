<script>
  import { appStore } from '$lib/stores/app.svelte.js';
  import { Calendar, CalendarDays, X } from 'lucide-svelte';

  let filter = $state(appStore.dateFilter);
  let search = $state(appStore.searchQuery);

  function updateSearch() {
    appStore.setSearchQuery(search);
  }

  function setFilter(type) {
    filter.type = type;
    if (type !== 'rentang') {
      filter.start = null;
      filter.end = null;
    }
    appStore.setDateFilter(filter);
  }

  function reset() {
    search = '';
    filter = { type: 'semua', start: null, end: null };
    appStore.setSearchQuery('');
    appStore.setDateFilter(filter);
  }
</script>

<div class="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-gray-100/80 space-y-3">
  <!-- Search Box -->
  <div class="relative">
    <input
      type="text"
      placeholder="Cari data..."
      bind:value={search}
      oninput={updateSearch}
      class="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
    />
    <svg class="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    {#if search}
      <button onclick={() => { search = ''; appStore.setSearchQuery(''); }} class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
        <X class="w-4 h-4" />
      </button>
    {/if}
  </div>

  <!-- Filter Tanggal -->
  <div class="flex flex-wrap items-center gap-1.5">
    <span class="text-xs font-medium text-gray-400 mr-1">Filter:</span>
    <button onclick={() => setFilter('semua')} class="px-3 py-1 text-xs rounded-full border transition {filter.type === 'semua' ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}">Semua</button>
    <button onclick={() => setFilter('hari_ini')} class="px-3 py-1 text-xs rounded-full border transition {filter.type === 'hari_ini' ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}">Hari Ini</button>
    <button onclick={() => setFilter('kemarin')} class="px-3 py-1 text-xs rounded-full border transition {filter.type === 'kemarin' ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}">Kemarin</button>
    <button onclick={() => setFilter('rentang')} class="px-3 py-1 text-xs rounded-full border transition {filter.type === 'rentang' ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}">
      <CalendarDays class="inline w-3 h-3 mr-0.5" /> Rentang
    </button>
    
    {#if filter.type === 'rentang'}
      <div class="flex items-center gap-1 ml-1">
        <input type="date" bind:value={filter.start} onchange={() => appStore.setDateFilter(filter)} class="px-2 py-1 text-xs border border-gray-300 rounded-lg w-32" />
        <span class="text-xs text-gray-400">-</span>
        <input type="date" bind:value={filter.end} onchange={() => appStore.setDateFilter(filter)} class="px-2 py-1 text-xs border border-gray-300 rounded-lg w-32" />
      </div>
    {/if}
    
    <button onclick={reset} class="ml-auto text-xs text-gray-400 hover:text-red-500 transition px-2 py-1">Reset</button>
  </div>
</div>