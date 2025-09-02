<script lang="ts">
	
	import {onMount} from 'svelte';
	import { url_shortener } from "$lib/utils/url";
	import countries from "i18n-iso-countries";
  import enLang from "i18n-iso-countries/langs/en.json"
	import { averageIntensity } from "@tgwf/co2";
	import type { CountryDataPoint, PageDataPoint} from "$lib/types/dashboard";

  countries.registerLocale(enLang);

	let grid_data = averageIntensity.data;

	export let countryArr: CountryDataPoint[] = [];
	export let pageArr: PageDataPoint[] = [];


	let dataAvailable = false;
	onMount(() => {
		dataAvailable = true;
	});

</script>
	
{#if dataAvailable && countryArr.length > 0}
<section class="tops-container">
	<h4 class="tops-title">
		Engagement
	</h4>
	<div class="top-country-container">
		<header>
			<h4 class="title">
				User Locations
			</h4>
			<p class="total">
				{countryArr.length} total
			</p>
		</header>
		<div class="table">
			<header>
				<h5 class="table-title">
					<span class="country-title">Country</span>
					<span class="data-title">{countryArr[0].carbon_unit}C0<sub>2</sub>e</span>
					<span class="data-title hide-tablet hide-mobile">Users</span>
				</h5>
				<div class="table-data">
				{#each countryArr as country} 
					<div class="country-container">
						<p class="country-name">
							{countries.getName(country.name, "en")}
						</p>
						<p class="country-data">
							{(country.carbon).toFixed(2)}						
						</p>
						<p class="country-data hide-tablet hide-mobile">
							{country.users}
						</p>
					</div>
					
				{/each}
				</div><!--table-data-->
		</div>
	</div>
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
					<span class="data-title">{pageArr[0].carbon_unit}C0<sub>2</sub>e</span>
					<span class="data-title hide-tablet hide-mobile">Visits</span>
				</h5>
				<div class="table-data">
				{#each pageArr as page} 
					<div class="country-container">
						<p class="country-name">
							{url_shortener(page.path, 80) == "" ?  "/" : url_shortener(page.path,80)}
						</p>
						<p class="country-data">
							{(page.carbon).toFixed(2)}						
						</p>

						<p class="country-data hide-mobile hide-tablet">
							{page.count}
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
		padding: calc(var(--base-measure) * 2) calc(var(--dash-base-measure) * 4);
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
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid var(--grey-ultra-light);
		padding-bottom: 0.4rem;
	}
	.table-title > span {
		font-weight: 500;

	}
	.data-title, .country-data {
		text-align: center;
	}
	.country-container {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid var(--grey-ultra-light);
	}
	.country-data, .country-name {
		font-size: var(--dash-body-one-font-size);
		margin: 0rem;
		margin-top: 0.4rem;
	}
	@media only screen and (min-width: 32rem) {
	.tops-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: calc(var(--dash-base-measure) * 8);
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
	.table-title {
		display: grid;
		grid-template-columns: 1fr 5rem;
		border-bottom: 1px solid var(--grey-ultra-light);
		padding-bottom: 0.4rem;
	}
	.table-title > span {
		font-weight: 500;

	}
	.country-container {
		display: grid;
		grid-template-columns: 1fr 5rem;
		border-bottom: 1px solid var(--grey-ultra-light);
	}
	.country-data {
		font-size: var(--dash-body-one-font-size);
	}
	}
	@media only screen and (min-width: 80rem) {
		.table-title, .country-container {
			grid-template-columns: 1fr 5rem 3rem;
		}

	}
</style>
