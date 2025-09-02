<script lang="ts">
	import { onMount, tick } from 'svelte';
	export let pageJourney: any = undefined;
	export let viewJourney: any = undefined;
	
	let dataAvailable = false;
		onMount( async () => {
			if (pageJourney && viewJourney) {
				dataAvailable = true;
			}
	});

</script>

<section class="journey-container hide">
	{#if dataAvailable}
		<h4>Average user website journey</h4>
		{#each viewJourney as page, i}
			
			<p>{i + 1}. {page}</p>
		{/each}
		<h4>Average home page journey</h4>
		{#each pageJourney as event, i}
			<h6>{i +1}. Type: {event.type}</h6>
			<p>Target html: {event.targetTag}</p>
			<p>Target class: {event.targetClass}</p>
			<p>Target text: {event.targetText}</p>
		{/each}
	{/if}
</section>
