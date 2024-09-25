<script lang="ts">

	export let websiteName = "mywebsite.com"

</script>

<section class="header-container">
	<h1 class="report-title">Website Report</h1>
	<h2 class="website-name">{websiteName}</h2>
</section><!--header-container-->

<style>

	.header-container {
		width:100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto;
		padding: 0rem 0rem;
		background-color: var(--grey-ultra-light);
	}
	.report-title {
		grid-column: 1/2;
		grid-row: 2/3;
		font-size: var(--dash-body-font-size);
		font-family: bodyFont;
		text-align: center;
		padding: calc(var(--dash-base-measure) *2) calc(var(--dash-base-measure) *2);
		border-bottom: 1px solid var(--black);
	}
	.website-name {
		grid-column: 1/2;
		grid-row: 1/2;
		text-align: center;
		font-family: bodyFont;
		padding: calc(var(--dash-base-measure) * 2) calc(var(--dash-base-measure) *2);
		margin-top: calc(var(--dash-base-measure) * 4);
		font-size: var(--dash-title-one-sans-font-size);
		border-bottom: 1px solid var(--black);
	}

	@media only screen and (min-width: 32rem) {
		.header-container {
			width:100%;
			display: grid;
			grid-template-columns: calc(var(--dash-base-measure) * 29) 1fr;
			grid-template-rows: calc(var(--dash-base-measure) * 15);
			padding: 0rem 0rem;
			background-color: var(--grey-ultra-light);
		}
		.report-title {
			grid-column: 1/2;
			grid-row: 1/2;
			font-size: var(--dash-body-font-size);
			font-family: bodyFont;
			text-align: left;
			padding: calc(var(--dash-base-measure) *6) calc(var(--dash-base-measure) *4);
			border-right: 1px solid var(--black);
			border-bottom: 1px solid var(--grey-ultra-light);
		}
		.website-name {
			grid-column: 2/3;
			grid-row: 1/2;
			text-align: right;
			font-family: bodyFont;
			padding: calc(var(--dash-base-measure) * 5) calc(var(--dash-base-measure) *4);
			font-size: var(--dash-title-one-sans-font-size);
			border-bottom: 1px solid var(--black);
			margin-bottom: -1px;
			margin-top: 0rem;
		}
	}

</style>


