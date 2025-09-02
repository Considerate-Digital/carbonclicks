<script lang="ts">
    /* This layout is primarily used to set up a default loading icon (Loader.svelte) */
		import { navigating } from '$app/stores';
    import Header from "$lib/components/common/Header.svelte";
    import Footer from "$lib/components/common/Footer.svelte";
    import Loader from '$lib/components/common/Loader.svelte';
		import { onMount } from "svelte";

		onMount(() => {
			//window.location.href = import.meta.env.VITE_DOMAIN_ADDRESS + "/dashboard/login";			
		});


</script>
<svelte:head>
	<script src="{import.meta.env.VITE_DOMAIN_ADDRESS}/scripts/counter.js" data-carbon-clicks-id="demo" data-carbon-clicks-endpoint="{import.meta.env.VITE_DOMAIN_ADDRESS}/public/api/analytics"></script>
    <title>CarbonClicks</title>
    <!--  Essential META Tags -->
		<meta property="og:title" content="Considerate Digital: We are digital fabricators working with code." />
		<!--meta property="og:image" content="https://considerate.digital/images/ogSmall.png"-->
    <meta property="og:url" content="https://considerate.digital">
    <!--meta name="twitter:card" content="https://considerate.digital/images/ogLarge.png"-->

    <!--  Non-Essential, But Recommended -->
	<meta
			property="og:description"
			content="As creative technologists, we discuss technology using friendly and accessible language with a focus on responsible and ethical methods. Our process explores technology by designing tools, building interactive interfaces and delivering custom prototypes. We are a multi-disciplinary studio."
 
		/>

    <meta name="twitter:image:alt" content="Considerate Digital logo">

</svelte:head>

<Header />
<section class="main-frame">
    <slot></slot>
</section>
<Footer />

{#if $navigating}
	<section class="menu-loader-container">
		<Loader />
	</section><!--menu-loader-container-->
{/if}
<style>
	.menu-loader-container {
		position: fixed;
		z-index: 99;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		background: rgba(255,255,255,0.4);
		display: flex;
		justify-content: center;
		align-items: center;
	}

</style>
