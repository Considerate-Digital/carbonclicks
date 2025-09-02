<script lang="ts">
	import {onMount} from 'svelte';
	import { tweened } from 'svelte/motion';
	import { sineOut } from 'svelte/easing';
	let graphicWebsiteTitleWidth;
	const markerPosition = tweened(0, {
		duration: 4000,
		easing: sineOut
		});
	
	export let PC: number;
	let graphicWidth: number;
	let componentMounted: boolean = false;
	$: PC, setGradient();

	function setGradient() {
			if (componentMounted === false) {return}

			graphicWidth = document.getElementsByClassName('efficiency-gradient')[0]?.clientWidth;
			if (!graphicWidth) { return };

			if (PC <= 2) {
				//emissionsPC = 0
				markerPosition.update(() => ((graphicWidth / 100) * ((2 / 100) * 100))); //120 to allow for 20% over 'best practices' level of optimisation
			} else if (PC >= 98) {
				//emissionsPC = 100;
				
				markerPosition.update(() => ((graphicWidth / 100) * ((98 / 100) * 100))); //120 to allow for 20% over 'best practices' level of optimisation
			} else {
				markerPosition.update(() => ((graphicWidth / 100) * ((PC / 100) * 100))); //120 to allow for 20% over 'best practices' level of optimisation
			};
			
			let carbonMarker = document.getElementsByClassName('actual-efficiency-marker')[0];
	}
	onMount(() => {
		componentMounted = true;
		markerPosition.update(() => 0); //120 to allow for 20% over 'best practices' level of optimisation
		setGradient();
		
	});

</script>
				<div class="efficiency-gradient">
					<div class="high-level level">
						<p class="carbon-text">inefficient</p>
					</div>
					<div class="low-level level">
						<p class="carbon-text">efficient</p>
					</div>

					<div class="actual-efficiency-marker" style="left:{$markerPosition}px">

					</div>
				</div>
<style>
.efficiency-gradient {
		position: relative;
		height: auto;
		width: calc(100% - 2.2rem);
		margin: auto;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(to right, var(--primary-color-two) 0%, var(--primary-color-two) 33.3%, var(--primary-color-two) 66.6%, var(--primary-color-three) 66.6%, var(--primary-color-three) );
		/*
		border: 1px solid var(--primary-color-two-strong);
		*/

	}
	.actual-efficiency-marker {
		position: absolute;
		height: 3.4rem;
		width: 0.2rem;
		background-color: var(--background-color-one);
		bottom: -0.04rem;
		/* border-top-left-radius: 0.4em;
		border-top-right-radius: 0.4em; */
		border-radius: 0.4em;
	}
	.carbon-text {
		color: inherit;
		font-weight: 400;
		margin: 0em 0.2em;
		padding: 0.9em 0.2em;
		font-size: var(--dash-label-one-font-size);
		text-transform: uppercase;
	}
	.level {
		width: max-content;
		border-radius: 1.8em;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		padding: 0em 1em;
	}
	.high-level > p {
		color: var(--font-color-one);
	}
	.low-level > p {
		color: var(--font-color-one);
	}
</style>
