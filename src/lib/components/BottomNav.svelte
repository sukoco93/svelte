<script>
  import { appStore } from '$lib/stores/app.svelte.js';
  import { ShoppingBag, Wallet, Package, Users, Plus } from 'lucide-svelte';
  import { keys, tableConfigs } from '$lib/config/tables.js';

  function setTab(tab) {
    appStore.setActiveTab(tab);
    appStore.resetFilter();
  }

  function openFAB() {
    const event = new CustomEvent('fab-click', { detail: { tab: appStore.activeTab } });
    window.dispatchEvent(event);
  }
</script>

<div class="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t border-gray-200/70 pb-safe">
  <div class="flex items-center justify-around h-16 max-w-lg mx-auto relative px-2">
    {#each keys as key}
      {@const cfg = tableConfigs[key]}
      <button 
        onclick={() => setTab(key)} 
        class="flex flex-col items-center justify-center relative group transition-all duration-200 {appStore.activeTab === key ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}"
      >
        {#if key === 'penjualan'} <ShoppingBag class="w-5 h-5" />
        {:else if key === 'kas'} <Wallet class="w-5 h-5" />
        {:else if key === 'produksi'} <Package class="w-5 h-5" />
        {:else if key === 'pelanggan'} <Users class="w-5 h-5" />
        {/if}
        <span class="text-[10px] font-medium mt-0.5">{cfg.name}</span>
        {#if appStore.activeTab === key}
          <span class="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full"></span>
        {/if}
      </button>
    {/each}

    <!-- FAB -->
    <button 
      onclick={openFAB} 
      class="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95"
    >
      <Plus class="w-6 h-6" />
    </button>
  </div>
</div>
