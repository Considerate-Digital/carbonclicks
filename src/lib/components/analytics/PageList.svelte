<script lang="ts">
	
	import {onMount} from 'svelte';
	import { url_shortener } from "$lib/utils/url";
	import type { PageDataPoint } from "$lib/types/dashboard";
	export let pageArr: PageDataPoint[] = [];

    function get_rating(grams: number) {
        // these are the figures from website-carbon
        if (grams < 0.095) {
            return "A+";
        } else if (grams < 0.186) {
            return "A";
        } else if (grams < 0.341) {
            return "B"
        } else if (grams < 0.493) { 
            return "C";
        } else if (grams < 0.656) { 
            return "D";
        } else if (grams < 0.846) { 
            return "E";
        } else {
            return "F"
        }
    }

	let dataAvailable = false;
	onMount(() => {
		if (pageArr.length > 0) {
			dataAvailable = true;
		}
	});

</script>
	
{#if dataAvailable}
<section class="tops-container">
	<h4 class="tops-title">
	</h4>
	<div class="top-page-conatiner">
			<header>
			<h4 class="title">
				Top Pages	
			</h4>
			<p class="total">
				{pageArr.length} total
			</p>
		</header>
		<div class="table">
			<header>
				<h5 class="table-title">
					<span class="page-title">Page</span>
					<span class="data-title hide-mobile">Visits</span>
					<span class="data-title hide-mobile hide-tablet">Rating</span>
					<span class="data-title">{pageArr[0].carbon_unit}Co<sub>2</sub>e</span>
				</h5>
				<div class="table-data">
				{#each pageArr as page} 
					<div class="country-container">
						<p class="page-name">
							{url_shortener(page.path, 80) == "" ? "/" : url_shortener(page.path, 80)}
						</p>
						<p class="page-data hide-mobile">
							{page.count}
						</p>
						<p class="page-data hide-mobile hide-tablet">
							{get_rating(page.carbon_per_load)}
						</p>
						<p class="page-data">
							{(page.carbon).toFixed(2)}
						</p>
					</div>
					
				{/each}
				</div><!--table-data-->
		</div>

	</div>

</section>
{/if}


<style>
	.tops-container {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: calc(var(--dash-base-measure) * 4);
		padding: 1rem calc(var(--dash-base-measure) * 6);
		}
	.tops-title {
		font-size: var(--dash-title-one-sans-font-size);
		font-family: bodyFont;
		margin-bottom: 0rem;
		text-align: center;
	}

	.title {
		display: none;
		font-size: var(--dash-body-one-font-size);
		font-family: bodyFont;
		margin-bottom: 0.6rem;
	}
	.total {
		font-size: var(--dash-title-one-sans-font-size);
		color: var(--purple);
		line-height: 1;
		margin: 0.3rem 0rem;
		display: none;
	}
	.table-data {
	max-height: 40rem;
		overflow-y: scroll;

	}
	.table-title {
		display: grid;
		grid-template-columns: 1fr 7rem;
		margin-bottom: 0.4rem;
		border-bottom: 1px solid var(--grey-ultra-light);
		padding-bottom: 0.4rem;
	}
	.table-title > span {
		font-weight: 500;
	}
	.country-container {
		display: grid;
		grid-template-columns: 1fr 7rem;
		margin-top: 0.4rem;
		border-bottom: 1px solid var(--grey-ultra-light);
	}
	.page-data, .page-name {
		font-size: var(--dash-body-one-font-size);
		margin: 0rem;
	}
	.page-data, .data-title {
		text-align:center;
	}
	@media only screen and (min-width: 32rem) {
	.tops-container {
		display: grid;
		grid-column-gap: calc(var(--dash-base-measure) * 8);
		padding: 1rem calc(var(--dash-base-measure) * 6);
	}
	.tops-title {
		text-align: left;
		grid-column: 1/3;
	}
	.title {
		display: none;
		font-size: var(--dash-body-one-font-size);
		font-family: bodyFont;
		margin-bottom: 0.6rem;
	}
	.total {
		font-size: var(--dash-title-one-sans-font-size);
		color: var(--purple);
		line-height: 1;
		margin: 0.3rem 0rem;
		display: none;
	}
	.table-title, .country-container {
		grid-template-columns: 1fr 7rem 7rem;
	}
	.table-title {
		margin-bottom: 0.4rem;
		border-bottom: 1px solid var(--grey-ultra-light);
		padding-bottom: 0.4rem;
	}
	.table-title > span {
		font-weight: 500;

	}
	.country-container {
		margin-top: 0.4rem;
		border-bottom: 1px solid var(--grey-ultra-light);
	}
	}
	@media only screen and (min-width: 80rem) {

	.table-title, .country-container  {
		grid-template-columns: 1fr 7rem 7rem 7rem;
	}

	}
</style>
