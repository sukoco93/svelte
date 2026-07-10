<script>
  import { appStore } from '$lib/stores/app.svelte.js';
  import { createEventDispatcher } from 'svelte';
  import { X } from 'lucide-svelte';

  const dispatch = createEventDispatcher();
  let form = $state({});
  let config = $state(null);

  $effect(() => {
    if (appStore.modalOpen) {
      config = appStore.modalConfig;
      if (appStore.modalMode === 'edit') {
        form = { ...appStore.modalData };
      } else {
        form = {};
        config?.formFields?.forEach(f => {
          const col = config.columns.find(c => c.key === f);
          form[f] = col?.type === 'select' ? (col.options?.[0] || '') : '';
        });
      }
    }
  });

  function submit() {
    dispatch('save', form);
  }

  function close() {
    appStore.setModalOpen(false);
  }
</script>

{#if appStore.modalOpen && config}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4 transform animate-in slide-in-from-bottom-10 duration-300">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-gray-800">
          {appStore.modalMode === 'add' ? 'Tambah' : 'Edit'} {config.name}
        </h2>
        <button onclick={close} class="p-1 rounded-full hover:bg-gray-100">
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onsubmit|preventDefault={submit} class="space-y-4">
        {#each config.formFields as key}
          {@const col = config.columns.find(c => c.key === key)}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{col.label}</label>
            
            {#if col.type === 'select'}
              <select bind:value={form[key]} class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                {#each col.options as opt}
                  <option value={opt}>{opt}</option>
                {/each}
              </select>
            {:else if col.type === 'date'}
              <input type="date" bind:value={form[key]} class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            {:else if col.type === 'number'}
              <input type="number" bind:value={form[key]} class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            {:else}
              <input type="text" bind:value={form[key]} class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            {/if}
          </div>
        {/each}

        <div class="flex gap-3 pt-2">
          <button type="button" onclick={close} class="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition">Batal</button>
          <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm">Simpan</button>
        </div>
      </form>
    </div>
  </div>
{/if}
