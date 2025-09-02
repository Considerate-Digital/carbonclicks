<script lang="ts">
	import PageList from "$lib/components/analytics/PageList.svelte";
	import PagesPieChart from "$lib/components/analytics/PagesPieChart.svelte";
	import { onMount } from 'svelte';
	import { getContext } from "svelte";
	import { writable } from "svelte/store";
	import type { Data } from "$lib/types/dashboard";

	let sorted_data: SvelteStore<Data> = getContext("data");
	
</script>
	<PagesPieChart sorted_data={$sorted_data} timePeriod={$sorted_data.timePeriod} /> 
  <PageList pageArr={$sorted_data.pageArr} />
<style>
</style>
