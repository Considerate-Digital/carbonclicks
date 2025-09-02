<script lang="ts">
	import Chart from 'chart.js/auto';
	import { Line, Bar } from 'svelte-chartjs'
	import { onMount } from 'svelte';
	import { getCarbonUnit, convertCarbonGrams } from "$lib/utils/carbonUnits";

	export let figuresUserNum = 0;
	export let figuresVisitsNum = 0;
	export let figuresCo2Num = 0;
	export let figuresCo2NumUnit = 'g';
	export let figuresRealTimeUsersNum = 0;
	export let figuresRealTimeCarbonNum = 0;
	export let figuresAverageSessionLength = 0;
	
	let dataAvailable = false;

	onMount(async () => {
		dataAvailable = true;
	});

	function convertAvSessionlength(sessionLength: number) {
		let dateObj = new Date(0);
		dateObj.setMilliseconds(dateObj.getMilliseconds() + sessionLength);
		return dateObj.getMinutes() + `<span class="unit">m</span>` + dateObj.getSeconds() + `<span class="unit">s</span>`; 
	};
	
	function adjust_users(visits: number) {
		if (visits > 100000) {
			return ((visits / 100000).toFixed(2) + `<span class="unit">m</span>`);
		} else if (visits > 1000) {
			return ((visits / 1000).toFixed(2) + `<span class="unit">k</span>`);
		} else {
			return visits;
		}
	}


</script>
{#if dataAvailable}
<section class="figures-container">
	<div class="metrics-container">
			<div class="number-container visits">
				<h5 class="number-title">
					Visits
				</h5>
				<p class="number">
					{@html adjust_users(Number(figuresVisitsNum.toFixed(0)))}
				</p>
				<p class="number-detail">
					Total website visits.
				</p>
			</div><!--number-container-->
			<div class="number-container user">
				<h5 class="number-title">
					Users
				</h5>
				<p class="number">
					{@html adjust_users(Number(figuresUserNum.toFixed(0)))}
				</p>
				<p class="number-detail">
					Individual website users.
				</p>
			</div><!--number-container-->
			<div class="number-container carbon">
				<h5 class="number-title">
					CO<sub>2</sub>e
				</h5>
				<p class="number">
					{convertCarbonGrams(figuresCo2Num.toFixed(0))}<span class="unit">{getCarbonUnit(figuresCo2Num.toFixed(0))}</span>
				</p>
				<p class="number-detail">
					Total website emissions.
				</p>
			</div><!--number-container-->

			<div class="number-container real-time-users">
				<h5 class="number-title">
					Real Time Users	
				</h5>
				<p class="number">
					{@html adjust_users(figuresRealTimeUsersNum)}
				</p>
				<p class="number-detail">
					Live individual users.	
				</p>
			</div><!--number-container-->
			<div class="number-container real-time-carbon">
				<h5 class="number-title">
					Real Time CO<sub>2</sub>e	
				</h5>
				<p class="number">
					{figuresRealTimeCarbonNum.toFixed(0)}<span class="unit">g</span>
				</p>
				<p class="number-detail">
					Live website emissions.
				</p>
			</div><!--number-container-->
		 	<div class="number-container session-length">
				<h5 class="number-title">
					Time
				</h5>
				<p class="number">
					{@html convertAvSessionlength(figuresAverageSessionLength)}
				</p>
				<p class="number-detail">
					Av. time spent on your webpages.
				</p>
			</div><!--number-container-->
</section><!--figures-container-->
{/if}

<style>
	.figures-container {
		margin: calc(var(--base-measure) * 12) 0rem;
	}
	.metrics-container {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(6, 1fr);
	}
	.number-container {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: start;
		width: 100%;
		height: auto;
		background-color: var(--primary-color-one-light);
		padding: calc(var(--base-measure) * 33) calc(var(--base-measure) * 29);
		padding-left: calc(var(--base-measure) * 17);
	}
	.visits {
		background-color: var(--primary-color-one-light);
	}
	.user {
		background-color: var(--primary-color-three-light);
	}
	.carbon {
		background-color: var(--primary-color-four-light);
		color: var(--background-color-one);
	}
	.carbon .number-title {
		color: var(--background-color-one);
	}
	.real-time-users {
		background-color: var(--primary-color-three-light);
		color: var(--font-color-one);
	}
	.real-time-carbon {
		background-color: var(--primary-color-two-light);
	}
	.session-length {
		background-color: var(--primary-color-one-light);
	}
	.number-title {
		font-size: var(--dash-body-one-font-size);
		font-family: bodyFont;
		color: var(--font-color-one);
		height: 1.2rem;
		margin-right: 1rem;
		margin-bottom: calc(var(--dash-base-measure) * 1);
	}
	.number {
		font-size: 4.1rem;
		line-height: 1;
		margin: 0;
	}
	:global(.figures-container .unit) {
		font-size: 1.6rem;
	}
	.number-detail {
		font-size: var(--pub-label-font-size);
		line-height: 1.25;
	}
	
	@media only screen and (min-width: 32rem) {
	.metrics-container {
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(3, 1fr);
		}
		.real-time-users, .real-time-users .number-title {
			color: var(--font-color-one);
			background-color: var(--primary-color-two-light);
		}


			}
		@media only screen and (min-width: 80rem) {
			.metrics-container {
				grid-template-columns: repeat(3, 1fr);
				grid-template-rows: repeat(2, 1fr);
			}
	.real-time-users, .real-time-users .number-title {
			color: var(--background-color-one);
			background-color: var(--font-color-one);
		}

			.number {
				font-size: 5.4rem;
			}
		}

	</style>
