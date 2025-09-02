<script lang="ts">
  import Logo from '$lib/branding/Logo.svelte';
</script>

<footer class="analytics-footer">
	<nav class="analytics-footer-menu">
		<div class="analytics-footer-left">
			<a href="https://considerate.digital" target="_blank" class="analytics-link">
				<Logo />
				Considerate Digital
			</a>
			
		</div><!--analytics-left-->
		<div class="analytics-footer-right">
			<div class="link-button" >
				<a href="https://github.com/Considerate-Digital/carbonclicks" target="_blank">
					Code
				</a>
			</div><!--link-button-->
			<div class="link-button" >
				<a href="https://considerate.digital" target="_blank">
					Support
				</a>
			</div><!--link-button-->

		</div><!--analytics-footer-right-->
	</nav><!--analytics-footer-menu-->
</footer><!--analytics-footer-->

<style>
	.analytics-footer {
		background-color: var(--background-color-one);
		padding: calc(var(--dash-base-measure) *4) calc(var(--dash-base-measure) *6);
		min-height: calc(var(--base-measure) * 4);
	}
	.analytics-footer-menu {
		display: grid;
		grid-template-columns: 1fr;

	}
	.analytics-footer-left, .analytics-footer-right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.analytics-footer-left {
		margin-bottom: calc(var(--dash-base-measure) * 3);
	}
	.analytics-footer-right {
		justify-content: flex-end;
	}
	.analytics-link {
		display: flex;
		align-items: center;
	}
	.link-button {
		width: max-content;
		margin-bottom: calc(var(--dash-base-measure) * 1);
		margin-left: calc(var(--base-measure) * 2);
	}
	:global(.analytics-link svg) {
		max-height: 0.9rem;
		width: auto;
		margin-right: 1rem;
	}
	@media only screen and (min-width: 32rem) {
	.analytics-footer {
		padding: calc(var(--dash-base-measure) *4) calc(var(--dash-base-measure) *6);
	}
	.analytics-footer-menu {
		display: grid;
		grid-template-columns: 1fr 1fr;

	}
	.analytics-footer-left, .analytics-footer-right {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	.analytics-footer-left {
		margin-bottom:0rem; 
	}
	.analytics-footer-right {
		justify-content: flex-end;
	}
	.analytics-link {
		display: flex;
		align-items: center;
	}
	.link-button {
		width: max-content;
		margin-bottom: 0rem; 
	}
	:global(.analytics-link svg) {
		max-height: 0.9rem;
		width: auto;
		margin-right: 1rem;
	}

	}
</style>


