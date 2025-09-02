<script lang="ts">
	import countries from "i18n-iso-countries";
  import enLang from "i18n-iso-countries/langs/en.json"
	import { averageIntensity } from "@tgwf/co2";
	import type { CountryDataPoint } from "$lib/types/dashboard";

  countries.registerLocale(enLang);
	import {onMount} from 'svelte';
	export let countryArr: CountryDataPoint[] = [];
	
	// TODO find the type : https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/tgwf__co2/index.d.mts
	let grid_data: any = averageIntensity.data;

	let dataAvailable = false;
	onMount(() => {
		dataAvailable = true;
	});

</script>
	
{#if dataAvailable && countryArr.length > 0}
<section class="tops-container">
	<h4 class="tops-title">
	</h4>
	<div class="top-page-conatiner">
			<header>
			<h4 class="title">
				Top Pages	
			</h4>
			<p class="total">
				{countryArr.length} total
			</p>
		</header>
		<div class="table">
			<header>
				<h5 class="table-title">
					<span class="page-title">Country</span>
					<span class="data-title hide-mobile ">Users</span>
					<span class="data-title">{countryArr[0].carbon_unit}Co<sub>2</sub>e</span>
					<span class="data-title hide-mobile hide-tablet">Av. Grid Intensity <span class="small-unit">gCO<sub>2</sub>/kWh</span></span>
				</h5>
				<div class="table-data">
				{#each countryArr as page} 
					<div class="country-container">
						<p class="page-name">
							{countries.getName(page.name, "en")}
						</p>
						<p class="page-data hide-mobile">
							{page.users}
						</p>
						<p class="page-data">
							{(page.carbon).toFixed(2)}
						</p>
						<p class="page-data hide-mobile hide-tablet">
							{grid_data[page.name] ?? "--"}
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
	
	.small-unit {
		font-size: 0.6rem;
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
		.table-title, .country-container {
			grid-template-columns: 1fr 7rem 7rem 12rem;
		}
	}
</style>
