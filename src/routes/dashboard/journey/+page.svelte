<script lang="ts">
  import { getContext } from "svelte";
  import type { Data } from "$lib/types/dashboard";
  let sorted_data: SvelteStore<Data> = getContext("data");
  $: $sorted_data, data_update();

  import { url_shortener } from "$lib/utils/url";
  import { onMount } from 'svelte';
  import Journey3dGraph from "$lib/components/analytics/Journey3dGraph.svelte";

  let  links: any[] = [];
  let  nodes: any[] = [];

  function data_update() {
    if ($sorted_data.force_dataset ) {
      links = $sorted_data?.force_dataset?.links; 
      nodes = $sorted_data?.force_dataset?.nodes; 
    }
  }

</script>

{#if $sorted_data.force_dataset}
  <Journey3dGraph {nodes} {links} />
{/if}

<style>
</style>
