<script lang="ts">
	import Graphic from '$lib/components/analytics/Graphic.svelte';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	
	export let PC;


</script>

<section class="gradient-container">
	<header class="gradient-header">
		<h3 class="title">
			Efficency rating
		</h3>
		<details class="info-container">
			<summary>
				<h4 class="hide">
					Information icon
				</h4>
				<Information size={24} />
			</summary>
			<p class="info-text">
				This scale reflects the website's current carbon status in comparison to its potential efficiency.
			</p>

		</details>
	</header>
	<Graphic {PC} />
</section><!--gradient-container-->


<style>
	.gradient-container {
		height: 9rem;
		padding: calc(var(--dash-base-measure) *1) calc(var(--base-measure) * 8);
	}
	.gradient-header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: calc(var(--dash-base-measure) * 9);
		margin-bottom: calc(var(--dash-base-measure) *2);
	}
	.title {
		font-size: var(--dash-title-one-sans-font-size);
		font-family: bodyFont;
		text-align: center;
		margin-bottom: calc(var(--dash-base-measure) * 1);
	}
	.info-container {
		display: none;
		position: relative;
		text-align: right;
		padding-bottom: 4rem;
	}
	.info-container summary {
		position: absolute;
		width: 2rem;
		height: 2rem;
		padding-top: 0.4rem;
		right: calc(var(--dash-base-measure) *2)
	}
	.info-container[open] {
		padding-top: 3.1rem;
	}
	.info-text {
		padding-right: 3rem;
		font-size: var(--dash-label-one-font-size);
		max-width: 20rem;
	}
	@media only screen and (min-width: 32rem) {
	
	.title {
		font-size: var(--dash-title-one-sans-font-size);
		font-family: bodyFont;
		margin-bottom: 0rem;
	}
	.info-container {
		position: relative;
		text-align: right;
		display: flex;
		padding-bottom: 4rem;
	}
	.info-container summary {
		position: absolute;
		width: 2rem;
		height: 2rem;
		padding-top: 0.4rem;
		right: calc(var(--dash-base-measure) *2)
	}
	.info-container[open] {
		padding-top: 3.1rem;
	}
	.info-text {
		padding-right: 3rem;
		font-size: var(--dash-label-one-font-size);
		max-width: 20rem;
	}
	}
</style>
