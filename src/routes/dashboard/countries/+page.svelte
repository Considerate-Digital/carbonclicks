<script lang="ts">
	import CountryList from "$lib/components/analytics/CountryList.svelte";
	//import CountryPieChart from "$lib/components/analytics/CountryPieChart.svelte";
  import Loader from "$lib/components/common/Loader.svelte";
  import { objectToBuffer, bufferToObject } from "$lib/utils/buffer";
	import { getContext } from "svelte";
  import type { Data, CountryDataPoint } from "$lib/types/dashboard";

  let sorted_data: SvelteStore<Data> = getContext("data");

 import { onMount, tick, onDestroy} from 'svelte';
  import type { ChartType, DefaultDataPoint, Chart, ChartItem } from 'chart.js';
  import { Chart as ChartJS } from 'chart.js';
  import type { ChartBaseProps } from 'svelte-chartjs';
  import { useForwardEvents } from 'svelte-chartjs';
	import { ChoroplethChart } from 'chartjs-chart-geo';
	import * as topojson from "topojson-client"; 
  //import type { Feature, Point, GeoJsonProperties } from "@types/topojson-specification";
  import countries from "i18n-iso-countries";
  import enLang from "i18n-iso-countries/langs/en.json"
  import chroma from "chroma-js";
  import countries110 from "world-atlas/countries-110m.json";

  import { Colors } from "$lib/colors";

  type ChartBody = {
    before: string[];
    lines: string[];
    after: string[];
  }


  let graphWorker: Worker | undefined = undefined;
  countries.registerLocale(enLang);

  let chart: Chart | null;
  let color_set = Colors();

  let scale = chroma.scale([color_set.green, color_set.black]);
  let mounted = false;
  let labelsG: any[] = [];
  let dataG: any[] = [];

  let dataAvailable = false;


  // TODO Feature<Point, GeoJsonProperties>[] = topojson.feature(countries110, countries110.objects.countries).features;
  //@ts-ignore
  const countries_topo: any[] = topojson.feature(countries110, countries110.objects.countries).features;

/*
  function data_update() {
    if ($sorted_data.country_graph_dataset && mounted) {
      console.log("running data update");
      // this destroys and re-creates the canvas
    }
  }
  */
  
  // TODO fix types here
  function adjustGraph(labels: any[] = labelsG, data: any[] = dataG) {
    //TODO type checking not working for canvas
    let canvasRef: HTMLCanvasElement | null | any = document.getElementById("canvas-ref");
    if (canvasRef) {
      console.log("adjusting graph");
      let chartItem: CanvasRenderingContext2D | null = canvasRef.getContext('2d');

        if (chartItem) {
      chart = new ChoroplethChart(chartItem, {
        data: {
          labels: labels,
          datasets: [{
            label: "Country",
            data: data,
          }]
        },
        options: {
          showOutline: false,
          showGraticule: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: false,
              external: function(context) {
                // Tooltip Element
                let tooltipEl = document.getElementById('chartjs-tooltip');

                // Create element on first render
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.innerHTML = '<table></table>';
                    document.body.appendChild(tooltipEl);
                }

                // Hide if no tooltip
                const tooltipModel = context.tooltip;
                if (tooltipModel.opacity === 0) {
                    tooltipEl.style.opacity = "0";
                    return;
                }

                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltipModel.yAlign) {
                    tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }

                function getBody(bodyItem: ChartBody) {
                    return bodyItem.lines;
                }

                // Set Text
                if (tooltipModel.body) {
                    const titleLines = tooltipModel.title || [];
                    const bodyLines = tooltipModel.body.map(getBody);

                    let innerHtml = '<thead>';

                    titleLines.forEach(function(title) {
                        innerHtml += '<tr><th>' + title + '</th></tr>';
                    });
                    innerHtml += '</thead><tbody>';

                    bodyLines.forEach(function(body, i) {
                      body[0] = body[0].split(":")[0];
                        const colors = tooltipModel.labelColors[i];
                        /*
                        let style = 'background:' + colors.backgroundColor;
                        style += '; border-color:' + colors.borderColor;
                        style += '; border-width: 2px';
                        */
                        let style = "";
                        const span = '<span style="' + style + '">' + body + '</span>' //+ $sorted_data.countryArr[0].carbon_unit + "Co2e" + '</span>';
                        innerHtml += '<tr><td>' + span + '</td></tr>';
                    });
                    innerHtml += '</tbody>';

                    let tableRoot: HTMLElement | null = tooltipEl.querySelector('table');
                    if (tableRoot) {
                      tableRoot.innerHTML = innerHtml;
                    }
                }

                const position = context.chart.canvas.getBoundingClientRect();

                // Display, position, and set styles for font
                tooltipEl.style.opacity = "1";
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                tooltipEl.style.padding = "0.6rem 2rem";
                tooltipEl.style.backgroundColor = "var(--primary-color-two-light)";
                tooltipEl.style.color = "var(--font-color-one)";
                tooltipEl.style.borderRadius = "0rem";
                tooltipEl.style.pointerEvents = 'none';

                }
            }
          },
          scales: {
            projection: {
              axis: 'x',
              //projection: 'equirectangular'
              projection: 'equalEarth',
            },
            color: {
                interpolate: (v) => {
                  if (v < 0.05) {
                    return scale(0.05).hex();
                  } else if (v < 0.1) {
                    return scale(0.05).hex();
                  } else if (v < 0.15) {
                    return scale(0.1).hex();
                  } else if (v < 0.2) {
                    return scale(0.15).hex();
                  } else if (v < 0.25) {
                    return scale(0.2).hex();
                  } else if (v < 0.3) {
                    return scale(0.25).hex();
                  } else if (v < 0.35) {
                    return scale(0.3).hex();
                  } else if (v < 0.4) {
                    return scale(0.35).hex();
                  } else if (v < 0.45) {
                    return scale(0.4).hex();
                  } else if (v < 0.5) {
                    return scale(0.45).hex();
                  } else if (v < 0.55) {
                    return scale(0.5).hex();
                  } else if (v < 0.6) {
                    return scale(0.55).hex();
                  } else if (v < 0.65) {
                    return scale(0.60).hex();
                  } else if (v < 0.7) {
                    return scale(0.65).hex();
                  } else if (v < 0.75) {
                    return scale(0.70).hex();
                  } else if (v < 0.8) {
                    return scale(0.75).hex();
                  } else if (v < 0.85) {
                    return scale(0.80).hex();
                  } else if (v < 0.9) {
                    return scale(0.85).hex();
                  } else if (v < 0.95) {
                    return scale(0.9).hex();
                  } else {
                    return scale(1).hex();
                  }
                },
                quantize: 50,
              axis: 'x',
            },
          }
        }
      });
    }
    }
  }
  
  // TODO topo types
  function sort_data_in_worker( countries_topo: any, countryArr: CountryDataPoint[]) {
        dataAvailable = false;

        let buffer = objectToBuffer({ countries_topo, countryArr});
        if (graphWorker ) {
          graphWorker.postMessage(buffer, [buffer]);

          graphWorker.onmessage = async (e) => {
              let {data, labels} = bufferToObject(e.data);
              dataAvailable = true;
              dataG = data;
              labelsG = labels;
              await tick();
              adjustGraph(labels, data); 
          };
        }

    }
    

    onMount(async () => {
        graphWorker = new Worker(new URL('$lib/workers/country_graph.worker.ts', import.meta.url), {
          type: 'module',
        });
       //sort out the graph options
        await sort_data_in_worker(countries_topo, $sorted_data.countryArr);
    });

  onMount(() => {
    mounted = true;
    //data_update();
  });

  onDestroy(() => {
    if (chart) chart.destroy();
    chart = null;
  });


</script>
<section class="graph-section-container">
    <header class="graph-header">
        <div class="graph-text-container">
            <h3 class="graph-title">
                Countries
            </h3>
            <p class="graph-text">
              Depending on their location, your website's visitors will generate different emissions whilst using your website.
            </p>
        </div><!--graph-text-container-->
            </header><!--graph-header-container-->
    <div class="graph-container">
      {#if dataAvailable && mounted}
        <canvas id="canvas-ref" />
      {:else}
        <Loader text={"Sketching the globe."}/>
      {/if}
    </div><!--graph-container-->
</section><!--graph-section-container-->

  <CountryList countryArr={$sorted_data.countryArr} />
<style>
    canvas {
      height: 100%;
      width: 100%;
    }
    .graph-section-container {
        padding: calc(var(--dash-base-measure) * 4) calc(var(--dash-base-measure) * 2);
        padding-bottom: 0rem;
    }
    .graph-container {
        width: 100%;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .graph-header {
        display: grid;
        grid-template-columns: 100%;
    }
    .graph-text-container {
        margin-bottom: calc(var(--dash-base-measure) * 1);
    }
    .graph-title {
        font-family: bodyFont;
        font-size: var(--dash-title-one-sans-font-size);
        text-align: center;
    }
    .graph-text {
        max-width: 30rem;
        text-align: center;
    }

    @media only screen and (min-width: 32rem) {
      .graph-section-container {
        padding: calc(var(--dash-base-measure) * 4) calc(var(--dash-base-measure) * 6);
      }
      .graph-container {

        /*
        min-height: 36rem;
        */
      }
    .graph-header {
        display: grid;
    }
    .graph-title {
        font-family: bodyFont;
        font-size: var(--dash-title-one-sans-font-size);
        text-align: left;
    }
    .graph-text {
        text-align: left;
    }
    }

</style>
