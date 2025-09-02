<script lang="ts">
    // @ts-ignore
    import Figures from "$lib/components/analytics/Figures.svelte";
    import Gradient from "$lib/components/analytics/Gradient.svelte";
    import Score from "$lib/components/analytics/Score.svelte";
    import Graph from "$lib/components/analytics/Graph.svelte";
    import Tops from "$lib/components/analytics/Tops.svelte";
    import JourneyTest from "$lib/components/analytics/JourneyTest.svelte";
    import NoData from "$lib/components/analytics/NoData.svelte";
    import Loader from "$lib/components/common/Loader.svelte";
    import type { Data } from "$lib/types/dashboard";

    import {onMount } from 'svelte';
    import { page } from "$app/stores";
    import { getContext } from "svelte";

    let websiteName: string = "yourwebsite.com";

    /*page & site journys */
    let viewJourney = [];
    let pageJourney = [];

  //let mediaDesktopMatched = true;
  let sorted_data: SvelteStore<Data> = getContext("data");

  onMount(() => {
  /*
    let desktopScreen = window.matchMedia("(min-width:79rem)").matches;
    if (!desktopScreen) {
      console.log("Not desktop screen");
      window.location.href = "/feedback?title=Desktop Only&sub=Our dashboard is for desktop use only.";
    }
      console.log("dashboard page has loaded");
      let loadDashboard = true;
      */
  });



</script>

{#if $sorted_data?.pageArr?.length >= 0}
    {#key $sorted_data}
    <Graph data={$sorted_data.data} timePeriodG={$sorted_data.timePeriod} />
    <!--Score PC={$sorted_data.PC} /-->
    <Figures
        figuresUserNum={$sorted_data.figuresUserNum}
        figuresVisitsNum={$sorted_data.figuresVisitsNum}
        figuresCo2Num = {$sorted_data.totalCarbonCount}
        figuresCo2NumUnit={$sorted_data.figuresCo2NumUnit}
        figuresRealTimeUsersNum={$sorted_data.figuresRealTimeUsersNum}
        figuresRealTimeCarbonNum={$sorted_data.figuresRealTimeCarbonNum}
        figuresAverageSessionLength={$sorted_data.figuresAverageSessionLength}
        />
    <Tops countryArr={$sorted_data.countryArr} pageArr={$sorted_data.pageArr} />
    {/key}
    <!--JourneyTest pageJourney={pageJourney} viewJourney={$sorted_data.viewJourney} /-->
{:else}
    <Loader  text={"Preparing the dashboard."}/>
{/if}


<style>
    @media only screen and (min-width: 32rem) {

    }
    @media only screen and (min-width: 80rem) {
    }

</style>
