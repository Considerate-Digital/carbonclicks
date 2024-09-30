<script lang="ts">

    // TODO: loading variable may not be in use

    import Header from '$lib/components/analytics/Header.svelte';
    import Logo from '$lib/branding/Logo.svelte';
    import Menu from '$lib/components/analytics/Menu.svelte';
		import LogoAnimated from '$lib/branding/LogoAnimated.svelte';
		//import WebsiteSelector from '$lib/components/analytics/WebsiteSelector.svelte';
		import Footer from "$lib/components/analytics/Footer.svelte";
    import {onMount, tick} from 'svelte';
    import Loader from "$lib/components/common/Loader.svelte";
    import Select from 'svelte-select';
    import { setContext } from 'svelte';
    import { page } from "$app/stores";
    import { demo_data } from "$lib/demo_data";
    import { objectToBuffer, bufferToObject } from "$lib/utils/buffer";
    import { remove_http } from "$lib/utils/url";
    import type { ForceGraphDataSet, AnalyticsData, TimePeriod, CarbonUnit, CountryDataPoint, PageDataPoint, CountryGraphDataPoint, CountryGraphDataSet, Data } from "$lib/types/dashboard";

    let copy_button_text = "Copy";
    async function copy_code() {
        let code_text = document.getElementsByClassName("code")[0].innerHTML;
        try {
            code_text = code_text.replaceAll(/\&lt\;/g, "<");
            code_text = code_text.replaceAll(/\&gt\;/g, ">");
            await navigator.clipboard.writeText(code_text);
            copy_button_text = "Copied";
            setTimeout(() => {
                copy_button_text = "COPY";
            }, 4000);
        } catch (err) {
            console.log(err);
        }
    }

    import { writable } from 'svelte/store';

    // this variable is kept intact whereas sorted_data changes with the filtering 
    export let data:AnalyticsData ;

    
    /* worker scripts */
    
    let figuresWorker: Worker | undefined = undefined;
    //let siteJourneyWorker: Worker | undefined = undefined;
    //let pageJourneyWorker: Worker | undefined = undefined;
    let demoDataWorker: Worker | undefined = undefined;


		let bespoke = import.meta.env.VITE_BESPOKE == 'false' ? false : true;

		let playingLogo = false;
		let logoOptions = {
			autoplay: playingLogo,
			loop: true,
			controls: false
		};

    let dataAvailable = false;
    let loading = true;
    let loader_text = "";
		let title = "";
		let demo = false;
    let new_demo_data;
		let menuOptionsAvailable = true;
		let accountOptionsAvailable = true;
		let logoAvailable = true;
		let paidAccount= false;
		let websiteSelectionAvailable = true;

    let websiteName: string = "CarbonClicks";

    let timePeriod = "year";
    let totalCarbonCount = 0;
    /*gradient*/
    let PC = 50;
    /*figures*/
    let figuresUserNum = 0;
    let figuresVisitsNum = 0;
    let figuresCo2NumUnit = "g";
    let figuresRealTimeUsersNum = 0;
    let figuresRealTimeCarbonNum = 0;
    let figuresAverageSessionLength = 0;
    /*tops*/
    let countriesFound: string[] = [];
    let pagesFound: string[] = [];
    let countryArr: CountryDataPoint[] = [];
    let pageArr: PageDataPoint[] = [];
    let country_graph_dataset: CountryGraphDataSet | undefined;
    let force_dataset: ForceGraphDataSet | undefined;
    let mode_journey: any; 

    let id: string = ""; // account id

    
    let sorted_data: Data = {
        data,
        timePeriod,
        totalCarbonCount,
        PC,
        figuresUserNum,
        figuresVisitsNum,
        figuresCo2NumUnit,
        figuresRealTimeUsersNum,
        figuresRealTimeCarbonNum,
        figuresAverageSessionLength,
        countriesFound,
        countryArr,
        pageArr,
        id,
        websiteName,
        country_graph_dataset,
        force_dataset,
        mode_journey
    }
    $: sorted_data;

    let data_store: SvelteStore<Data>  = writable(sorted_data);
    setContext('data', data_store);


		//buttons
    let button0Class = "";
    let button1Class = "";
    let button2Class = "";
    let button3Class = "time-period-button-selected";
    
    // TODO html event
		function selectTimeOptionsChange(e: any) {
        sorted_data.timePeriod = e.detail.value;
        selectTimeValue = e.detail.label;
        adjustTimePeriod();
    };
    /*
    ** experimental
        site and page journey data -- generally used for graphs
    function sortSiteJourneyData() {
        if( siteJourneyWorker ) {
        let buffer = objectToBuffer(data.views);
       siteJourneyWorker.postMessage(buffer, [buffer]);

       siteJourneyWorker.onmessage = (e) => {
            let returned_data = bufferToObject(e.data);
            sorted_data.country_graph_dataset = returned_data.country_graph_dataset;
            //sorted_data.mode_journey = bufferToObject(returned_data..mode_journey);
        }
        }
    }
    */
    /*
    Not in use

    function sortPageJourneyData() {
        pageJourneyWorker.postMessage({
            events: data.events,
            selectedPageUrl: data.views[0].url,
        });
        pageJourneyWorker.onmessage = (e) => {
            pageJourney = e.data;
        };
    }
    */

    
    //need to work out carbon emissions here with data and country for each visit
    function sortDataForFigures () {
    if (figuresWorker) {
        /* send to figures worker using data sorted by time period */
        let buffer = objectToBuffer(sorted_data.data);
        figuresWorker.postMessage(buffer, [buffer]);

        figuresWorker.onmessage = (e) => {
            // data from worker
            let data = bufferToObject(e.data);
            sorted_data.PC= data.PC;
            sorted_data.totalCarbonCount = data.totalCarbonCount;
            sorted_data.figuresUserNum= data.figuresUserNum;
            sorted_data.figuresVisitsNum= data.figuresVisitsNum;
            sorted_data.figuresCo2NumUnit= data.figuresCo2NumUnit;
            sorted_data.figuresRealTimeUsersNum= data.figuresRealTimeUsersNum;
            sorted_data.figuresRealTimeCarbonNum= data.figuresRealTimeCarbonNum;
            sorted_data.figuresAverageSessionLength= data.figuresAverageSessionLength;
            sorted_data.countryArr= data.countryArr;
            sorted_data.pageArr= data.pageArr;
            // check this
            
            if (sorted_data.pageArr.length > 0 && sorted_data.pageArr[0].path.startsWith("https") ) { 
                sorted_data.websiteName = sorted_data.data.views[0].url.split("https://")[1].split(".")[0].split("/")[0] 
            } else if (sorted_data.data.views.length > 0 ){
                sorted_data.websiteName = sorted_data.data.views[0].url.split(".")[0];
            };
            return finishSetup(); 
        };
        }
    }

    function filterDataByTimePeriod (timestamp: number) {
    if (figuresWorker) {

        let buffer = objectToBuffer({
            fullData: data,
            date_stamp: timestamp
        });

        loader_text = "Calculating the emissions.";
        figuresWorker.postMessage(buffer, [buffer]);

        figuresWorker.onmessage = (e) => {
            // data from worker
            let data = bufferToObject(e.data);
            sorted_data.data = data.data;
            sorted_data.PC= data.PC;
            sorted_data.totalCarbonCount = data.totalCarbonCount;
            sorted_data.figuresUserNum= data.figuresUserNum;
            sorted_data.figuresVisitsNum= data.figuresVisitsNum;
            sorted_data.figuresCo2NumUnit= data.figuresCo2NumUnit;
            sorted_data.figuresRealTimeUsersNum= data.figuresRealTimeUsersNum;
            sorted_data.figuresRealTimeCarbonNum= data.figuresRealTimeCarbonNum;
            sorted_data.figuresAverageSessionLength= data.figuresAverageSessionLength;
            sorted_data.countryArr= data.countryArr;
            sorted_data.pageArr= data.pageArr;
            // check this
            if (sorted_data.pageArr.length > 0 && sorted_data.pageArr[0].path.startsWith("https") ) { 
                sorted_data.websiteName = sorted_data.data.views[0].url.split("https://")[1].split(".")[0].split("/")[0] 
            } else if (sorted_data.data.views.length > 0) {
                sorted_data.websiteName = sorted_data.data.views[0].url.split(".")[0];
            };

            //sortSiteJourneyData();
            return finishSetup(); 
        };
        }
}



    /*time options for select */
    let selectTimeOptions = [
        {
            label: "7 Days",
            value: "week"
        },
        {
            label: "Month",
            value: "month"
        },
        {
            label: "6 Months",
            value: "sixMonth"
        },
        {
            label: "12 Months",
            value: "year"
        }
    ];
    let selectTimeValue = "7 Days";



				async function adjustTimePeriod() {
        /* this is the first function that runs when the user changes anything */
        dataAvailable = false;
        dataAvailable = dataAvailable;
        loading = true;
        if (!data?.views || !data?.views.length) {return};
        
        console.log("adjusting time period");
        let timeAgo = new Date(new Date().toISOString());
        switch (sorted_data.timePeriod) {
            case "week":
                timeAgo.setDate(timeAgo.getDate() - 7);
                filterDataByTimePeriod(timeAgo.valueOf());
                break;
            case "month":
                timeAgo.setMonth(timeAgo.getMonth() - 1);
                filterDataByTimePeriod(timeAgo.valueOf());
                break;
            case "sixMonth":
                timeAgo.setMonth(timeAgo.getMonth() - 6);
                filterDataByTimePeriod(timeAgo.valueOf());
                break;
            case "year":
                timeAgo.setFullYear(timeAgo.getFullYear() - 1);
                filterDataByTimePeriod(timeAgo.valueOf());
                break;
            default:
                break;
        }
        
    }

    async function runSetup() {
        console.log("running setup");
        //set up 
        loading = true;
        loader_text = "Fetching the data.";
        await tick();
        timePeriod = "week";
        timePeriod = timePeriod;
        await adjustTimePeriod();
    }

    async function finishSetup() {
        console.log("finish setup running");
        //these are here for testing
        dataAvailable = true;   
        dataAvailable = dataAvailable;
        loading = false;
        await tick();
    }

    let reportTimeOptions;
    if (data?.account ) {
        sorted_data.id = data.account.id;
    }


    onMount(async () => {
        // reset the loader
        dataAvailable = false;
        dataAvailable = dataAvailable;
        
        /* import workers */
        figuresWorker = new Worker(new URL('$lib/workers/figures.worker.ts', import.meta.url), {
          type: 'module',
        });
        /*
        ** Experimental
        pageJourneyWorker = new Worker(new URL('$lib/workers/pageJourney.worker.ts', import.meta.url), {
          type: 'module',
        });
        */
        /*
        // experimental
        siteJourneyWorker = new Worker(new URL('$lib/workers/siteJourney.worker.ts', import.meta.url), {
          type: 'module',
        });
        */


        if ($page && dataAvailable == false) {
            new_demo_data = $page.url.searchParams.get("demo") ?? undefined;
            if (new_demo_data) {
                demoDataWorker = new Worker(new URL('$lib/workers/demoData.worker.ts', import.meta.url), {
                    type: 'module',
                });

                demo = true;
                loading = true;
                loader_text = "Creating some demo data."
                await tick();
                await tick();
                function get_demo_data() {
                    if (demoDataWorker) {
                    demoDataWorker.postMessage("data please");
                    demoDataWorker.onmessage =async (e) => {
                        
                        let data_obj = bufferToObject(e.data);
                        data.views = data_obj.data;
                        runSetup();
                    };
                    }
                }
                //data.views = JSON.parse(JSON.stringify(await demo_data())); 
                get_demo_data();
            } else if (!data?.views || data?.views?.length === 0) {
                // this bypasses the need to run the data through the workers
                finishSetup();
            } else {
                runSetup();
            }
        }


    });

    async function changeButtonSelected(ind: number) {
        button0Class = '';
        button1Class = '';
        button2Class = '';
        button3Class = '';
        if (ind == 0) {
            button0Class = "time-period-button-selected";
        } else if ( ind == 1 ) {
            button1Class = "time-period-button-selected";
        } else if ( ind == 2 ) {
            button2Class = "time-period-button-selected";
        } else if ( ind == 3 ) {
            button3Class = "time-period-button-selected";
        }
        await tick();
    }

</script>

<svelte:head>
    <title>CarbonClicks</title>
    <meta property="og:url" content="https://considerate.digital">
    
    <meta property="og:title" content="CarbonClicks: you can't see carbon but it shouldn't remain invisible">
    <meta property="og:description" content="CarbonClicks combines data on users, servers, device and networks to produce a detailed picture of every web page's carbon output. Open source and free." />
    <meta name="twitter:image:alt" content="CarbonClicks">
</svelte:head>


<section class="dashboard-layout-container">
    <header class="header">
    <a href="/" target="_blank">
			<div class="logo-box" >
            <div class="logo-container">
								<Logo />
						</div><!--logo-container-->
				</div><!--logo-box-->
    </a>
				<div class="header-content">
				<div class="website-selection-container">
					<!--website-selector-was-here-->
            <div class="name-container">
                <h2 class="website-name">{remove_http(sorted_data.websiteName)}
                </h2>
                {#if demo}
                    <span class="title-demo">demo</span>
                {/if}
            </div><!--name-container-->


          {#if !$page.url.pathname.includes("login") && dataAvailable }
              
        <section class="time-options-container">
            <button class={"time-period-button " + button0Class} on:click={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    sorted_data.timePeriod = "week";
                    changeButtonSelected(0);
                    adjustTimePeriod();
                    }}>
                7 Days
            </button>
            <button class={"time-period-button " + button1Class} on:click={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    sorted_data.timePeriod = "month";
                    changeButtonSelected(1);
                    adjustTimePeriod();
                    }}>

                Month 
            </button>
            <button class={"time-period-button " + button2Class} on:click={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    sorted_data.timePeriod = "sixMonth";
                    changeButtonSelected(2);
                    adjustTimePeriod();
                    }}>

               6 Months
            </button>
            <button class={"time-period-button " + button3Class} on:click={(e) => {
                    e.preventDefault();
                    sorted_data.timePeriod = "year";
                    changeButtonSelected(3);
                    adjustTimePeriod();
                    }}>

                12 Months
            </button>
            <div class="select-time-period-container">
                <Select value={selectTimeValue} items={selectTimeOptions} on:select={selectTimeOptionsChange} />
            </div>
        </section><!--time-options-container-->
        {/if}

				</div>
        <div class="header-component-container">
            <Header />
        </div><!--header-component-container-->
				</div><!--header-content-->
		</header><!--header-->
		<aside class="dashboard-aside">
			<Menu />
		</aside><!--aside-->
		<section class="dashboard-center">
        {#if !$page.url.pathname.includes("login") && !dataAvailable }
            <Loader text={loader_text} />
        {:else if !$page.url.pathname.includes("login") && dataAvailable && data.views.length > 0 && sorted_data?.data?.views?.length === 0}
            <slot></slot>
        {:else if !$page.url.pathname.includes("login") && dataAvailable && sorted_data?.pageArr?.length == 0}
            {#key sorted_data.id}
            <section class="consent-container">
                <div class="consent-connect-wrapper">
                <div class="consent-connect-container">
                    <div class="top-text-container">
                    <h2 class="consent-connect-title">
                        Connect your website
                    </h2>
                    <p class="consent-connect-top-text">
                        Copy the following code into your website's html template just underneath the &lt;body&gt; tag.
                    </p>
                      <p class="consent-connect-top-text">
                        For more guides on how to install CarbonClicks on different website platforms, please take a look at our <a href="/guide/how-to-install-carbon-clicks" target="_blank">installation guide</a>.
                    </p>
                    <p class="consent-connect-top-text">
                        As soon as your we start receiving your carbon emissions data, this message will disppear and you can explore your dashboard. In the meantime, please try our <a href="/dashboard?demo=true" target="_blank" data-sveltekit-reload>demo</a>.
                    </p>
                    <pre class="code">&lt;script 
            async src="{import.meta.env.VITE_DOMAIN_ADDRESS}/scripts/counter.min.js"  
            data-carbon-clicks-id="{sorted_data.id}"
            data-carbon-clicks-endpoint="{import.meta.env.VITE_DOMAIN_ADDRESS}/public/api/analytics"&gt;
&lt;/script&gt;</pre>
                        <p class="consent-connect-bottom-text">
                        Considerate Digital is committed to protecting user's rights and using data responsibly. Read our privacy policy to learn more about our privacy promise.
                    </p>
                </div><!--top-text-container-->
                <button class="" on:click={copy_code}>
                        {copy_button_text}
                    </button>
                </div><!--consent-connect-container-->
            </div><!--consert-connect-wrapper-->
        </section><!--consent-container-->
        {/key}
        {:else}
        <slot></slot>
        {/if}
		</section><!--dashboard-center-container-->
		<section class="footer-container">
			<Footer />
		</section><!--footer-container-->
</section><!--dashboard-layout-container-->


<style>
    .consent-container {
        display: grid;
        grid-template-columns: repeat(3, minmax(33.33%, 1fr)); 
        grid-template-rows: auto;
        height: 100%;
    }
    .consent-connect-wrapper {
        grid-column: 1/2;
        height: 100%;
    }
    .consent-connect-container {
        height: 100%;
        padding: calc(var(--dash-base-measure) * 2);
        padding-left: calc(var(--dash-base-measure) * 2);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .consent-connect-title {
        font-family: bodyFont;
        font-size: var(--dash-title-one-sans-font-size);
        line-height: var(--dash-title-one-sans-line-height);
        text-align: left;
    }
    .consent-connect-top-text {
        font-size: var(--dash-body-font-size);
        text-align: left;
        max-width: 31rem;
    }
    .code {
        margin: calc(var(--base-measure) * 3) 0rem 0rem 0rem;
        white-space: pre-wrap;
    }
    .consent-connect-bottom-text {
        font-size: var(--dash-body-two-font-size);
    }
    .consent-connect-button, .consent-access-privacy-policy-button {
        display: block;
        width: 100%;
        text-align: center;
        margin: calc(var(--dash-base-measure) * 2) 0rem;
        padding: calc(var(--dash-base-measure) * 1);
    }

    :global(.logo-container svg) {
        max-width: 2.7rem;
        height: auto;
        fill: var(--background-color-one);
        border: 1px solid var(--background-color-one);
    }

       .name-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
    }
   .website-name {
        font-family: headerFont, serif;
        font-size: var(--pub-mobile-title-sans-font-size);
        line-height: var(--pub-mobile-title-sans-line-height);
        text-transform: capitalize;
        margin: calc(var(--base-measure) * 1) calc(var(--base-measure) * 4) calc(var(--base-measure) * 0) calc(var(--base-measure) * 2);
        margin-right: calc(var(--base-measure) * 2);
        width: max-content;
    }
    .time-options-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        padding-bottom: 0rem;
    }
    .choose-time-title {
        font-family: bodyFont;
        font-size: var(--dash-body-one-font-size);
        width: calc(var(--base-measure) * 29);
    }
    .select-time-period-container {
        min-width: 8rem;
        margin: calc(var(--dash-base-measure) * 2) 0rem;
    }
    .time-period-button {
        background-color: transparent;
        margin: calc(var(--dash-base-measure) * 1) 0rem;
        margin-right: calc(var(--base-measure) * 2);
        margin-left: calc(var(--base-measure) * 2);;
        border-radius: 0rem;
        width: 100%;
        max-width: 12rem;
        padding: 0.4rem 0.6rem 0.3rem 0.6rem;
        border-color: var(--background-color-two);
    }
    .time-period-button:hover {
        background-color: var(--background-color-two);
        color: var(--background-color-one);
    }
    .time-period-button-selected {
        color: var(--background-color-one);
        background-color: var(--background-color-two);
    }
	.title-demo {
    width: max-content;
    color: var(--font-color-one);
		margin-left: calc(var(--dash-base-measure) *1);
	}
	.dashboard-layout-container {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: 100%;
		min-height: 100vh;
		height: 100%;
		width: 100vw;
    background-color: var(--background-color-one);
	}
	.logo-box {
			height: 100%;
      background-color: var(--background-color-two);
			display: flex;
			justify-content: center;
      padding-top: calc(var(--base-measure) * 6);
			align-items: start;
			width: calc(var(--base-measure) * 18);
			flex-shrink: 0;
		}
	.title {
		font-size: var(--dash-title-one-sans-font-size);
	}
	/*set the dropdown styling for the svelte-select*/
	:global(.selectContainer .listContainer .listItem .item.active) {
		background: var(--font-color-one) !important;
		
	}
	:global(.selectContainer.focused) {
		border-color: var(--background-color-one) !important;
	}
	:global(.selectContainer .listContainer .listItem .item.hover) {
		background: var(--background-color-one);
	}
  .website-selection-container {
        display: flex;
        align-items: flex-start;
        justify-content: start;
        flex-direction: column;
		}
  .dashboard-layout-container {
      grid-template-columns: calc(var(--base-measure) * 18) 1fr;
		}
 	.title-container, .header-component-container {
			display: flex;
			justify-content: start;
			align-items: center;
		}
  .header-component-container {
      padding-top: calc(var(--base-measure) * 4);
      align-items: start;
  }
		
  /*
     @media only screen and (min-width: 80rem) {
    temporarily until we have designs for all screen sizes
    */
	@media only screen and (min-width: 8rem) {
		.header {
			grid-row-start: 1;
			grid-row-end: 2;
			grid-column-start: 1;
      grid-column-end: 3;
			display:flex;
		}
		.header-content {
			display: grid;
			width: 100%;
			height: 100%;
			grid-template-columns: auto auto;
			grid-template-rows: auto;
			padding: 0em 1em;
		}
	
    
		.header-component-container {
			justify-content: flex-end;
		}
		.title-container {
			margin-left: 1.4em;
		}
		
	.dashboard-aside {
		display: block;
			grid-row-start: 2;
			grid-row-end: 4;
			grid-column-start: 1;
			grid-column-end: 2;
			background-color: var(--background-color-two);
		}
		.dashboard-center {
			grid-row-start:2;
			grid-row-end: 3;
			grid-column-start: 2;
			grid-column-end: 3;
			min-height: calc(100vh - calc(var(--base-measure) * 70));
		}
    .select-time-period-container {
        display: none;
    }

	}
  @media only screen and (min-width: 32rem) {
    .dashboard-layout-container {
			grid-template-rows: calc(var(--base-measure) * 41) auto;
			grid-template-columns: calc(var(--base-measure) * 18) auto;
		}
    .consent-connect-title {
        font-family: bodyFont;
        font-size: var(--dash-title-one-sans-font-size);
        line-height: var(--dash-title-one-sans-line-height);
        text-align: left;
    }
   .name-container {
       flex-direction: row;
        align-items: flex-end;
   }
    .website-name {
        font-family: headerFont, serif;
        font-size: var(--pub-title-serif-font-size);
        text-transform: capitalize;
        margin: calc(var(--base-measure) * 1) calc(var(--base-measure) * 4) calc(var(--base-measure) * 0) calc(var(--base-measure) * 2);
        margin-right: 1rem;
        width: max-content;
    }
    .time-options-container {
        padding: 0rem calc(var(--dash-base-measure) *2);
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        padding: 0rem calc(var(--dash-base-measure) *2);
        padding-bottom: 0rem;
    }
    .website-selection-container {
        display: flex;
        align-items: flex-start;
        justify-content: space-evenly;
        flex-direction: column;
		}
    .header-component-container {
        align-items: center;
        padding-top: 0rem;
    }


  }
</style>
