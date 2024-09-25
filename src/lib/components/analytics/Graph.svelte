<script lang="ts">

    import { objectToBuffer, bufferToObject } from "$lib/utils/buffer";
    import Chart from 'chart.js/auto';
    import { Line, Bar } from 'svelte-chartjs';
    import Loader from "$lib/components/common/Loader.svelte";
    import {onMount,tick} from 'svelte';
    import { Colors } from "$lib/colors";
    import hexRgb from "hex-rgb";
    
    import type { TimePeriod } from "$lib/types/dashboard";

    export let data;
    export let timePeriodG: TimePeriod = "week";


    let graphDisplayUsers = true;
    let graphDisplayVisits = false;
    let graphDisplayCarbon = false;

    let graphWorker: Worker | undefined = undefined;

    let button0Class = "graph-button-selected";
    let button1Class = "";
    let button2Class = "";
    let color_set = Colors(20);
    let views;

    function assemble_color(color_hex, alpha = 0.3) {
        let c = hexRgb(color_hex);
        return `rgba(${c.red}, ${c.green}, ${c.blue}, ${alpha})`;
    }

    let green_dark = color_set.green; 
    let green = assemble_color(color_set.green_scale[2]);
    let purple_dark = color_set.black; 
    let purple = assemble_color(color_set.grey_scale[2]);
    let blue_dark = color_set.swamp; 
    let blue = assemble_color(color_set.swamp_scale[4]);

    // @ts-ignore
    let options: any = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                A: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        align: 'center',
                        text: 'Users',
                        },
                    grid: {
                        display: false,
                        },
                    border: {
                        display: false,
                        dash: [2,6],
                        color: "rgba(230, 230, 230, 1)",
                        },
                    scaleLabel: {
                        display: true,
                        labelString: "Users"
                        },
                    ticks: {
                        beginAtZero: true,
                    },
                    },
                B: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        align: 'center',
                        text: 'gCO2e',
                        },

                    grid: {
                        display: false,
                    },
                    border: {
                        display: false,
                        dash: [2,6],
                        color: "rgba(230, 230, 230, 1)",
                    },
                    ticks: {
                        beginAtZero: true,
                    },

                   },
                  C: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        align: 'center',
                        text: 'gCO2e',
                        },

                    grid: {
                        display: false,
                    },
                    border: {
                        display: false,
                        dash: [2,6],
                        color: "rgba(230, 230, 230, 1)",
                    },
                    ticks: {
                        beginAtZero: true,
                    },

                   },

                x: {
                    grid: {
                        display: false,
                        ticks: {
                            display: false,
                        },
                    },
                    gridLines: {
                        offsetGridLines: true,
                    },
                    /*
                    stacked: true,
                    offset: true,
                    */
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                moveBars: false,
                decimation: {
                    enabled: true,
                    algorithm: "lttb",
                },
                            tooltip: {
              enabled: false,
              external: function(context: any) {
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
                
            // TODO this type exists in another graph
              function getBody(bodyItem: any) {
                  return bodyItem.lines;
              }

              // Set Text
              if (tooltipModel.body) {
                  const titleLines = tooltipModel.title || [];
                  const bodyLines = tooltipModel.body.map(getBody);

                  let innerHtml = '<thead>';
                    /* This confuses the graph
                  titleLines.forEach(function(title) {
                    innerHtml += '<tr><th>' + title + '</th></tr>';
                 });
                    */
                  innerHtml += '</thead><tbody>';

                  bodyLines.forEach(function(body: any, i: any) {
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

                  let tableRoot = tooltipEl.querySelector('table');
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
          }
        }

    let visits = {
            labels:  [], //graphData.map( row => row.timeUnit ), 
            backgroundColor: "rgba(225, 225, 225, 1)",
            datasets: [
                {
                yAxisID: "A",
                label: "Visits",
                fill: true,
                lineTension: 0.3,
                backgroundColor: green, 
                hoverBackgroundColor: "rgba(195, 197, 192, 1)",
                pointRadius: 20,
                pointBackgroundColor: "rgba(42, 04, 244, 0)",
                pointBorderColor: "rgba(0, 0, 0, 0)",
                borderColor: green_dark,
                data: [], //graphData.map( row => row.count)
                /*
                stack: 1,
                categoryPercentage: 0.5,
                barPercentage: 0.5
                */

                },
                {
                yAxisID: "B",
                label: "gCO2e",
                fill: true,
                lineTension: 0.3,
                backgroundColor: purple, 
                hoverBackgroundColor: "rgba(195, 197, 192, 1)",
                pointRadius: 20,
                pointBackgroundColor: "rgba(42, 04, 244, 0)",
                pointBorderColor: "rgba(0, 0, 0, 0)",
                borderColor: purple_dark,
                data: [], //graphData.map( row => row.carbon )
                /*
                stack: 1,
                categoryPercentage: 0.5 ,
                barPercentage: 0.5
                */
                },
                {
                yAxisID: "C",
                label: "Users",
                fill: true,
                lineTension: 0.3,
                backgroundColor: blue, 
                hoverBackgroundColor: "rgba(195, 197, 192, 1)",
                pointRadius: 20,
                pointBackgroundColor: "rgba(42, 04, 244, 0)",
                pointBorderColor: "rgba(0, 0, 0, 0)",
                borderColor: blue_dark,
                data: [], //graphData.map( row => row.count)
                /*
                stack: 1,
                categoryPercentage: 0.5,
                barPercentage: 0.5 
                */
                },

            ],
        }

    let xAxisUnits = [];
    let xAxisKey = "none";
    let dataByTimePeriod;
    let graphData;
    let dataAvailable = false;
    let carbonArrG: any = [];
    let userArrG: any = [];
    let visitArrG: any = [];
    let labelsG: any = [];

    let yAxisUnit = "visits";

    let dbit = {
        timeUnit: "",
        count: 0, //int
        carbon: 0 //grams
        }
    let viewsG: any;
    $: timePeriodG, sort_data_in_worker;

    function sort_data_in_worker(timePeriod = timePeriodG, views = viewsG) {

        let buffer = objectToBuffer({timePeriod, views});
        if (graphWorker) {
        graphWorker.postMessage(buffer, [buffer]);

        graphWorker.onmessage = (e) => {
            let {carbonArr, userArr, visitArr, labels} = bufferToObject(e.data);
            dataAvailable = true;
            carbonArrG = carbonArr;
            userArrG = userArr;
            visitArrG = visitArr;
            labelsG = labels;
            adjustGraph(carbonArr, visitArr, userArr, labels); 
        };
}
    }
    

    onMount(async () => {
        graphWorker = new Worker(new URL('$lib/workers/main_line_graph.worker.ts', import.meta.url), {
          type: 'module',
        });
  
       //sort out the graph options
        if (timePeriodG) {
            await sort_data_in_worker(timePeriodG, data.views);
        }
    });

        async function changeButtonSelected(ind: number) {
        if (ind == 0) {
            if (button0Class === "") {
                button0Class = "graph-button-selected";
            } else {
                button0Class = "";
            }
        } else if ( ind == 1 ) {
            if (button1Class === "") {
                button1Class = "graph-button-selected";
            } else {
                button1Class = "";
            }
        } else if ( ind == 2 ) {
            if (button2Class === "") {
                button2Class = "graph-button-selected";
            } else {
                button2Class = "";
            } 
        }
        await tick();
    }

    function adjustGraph (carbonArr = carbonArrG, visitArr = visitArrG, userArr = userArrG, labels = labelsG) {
        // @ts-ignore
        visits.labels = labels;
        if (graphDisplayUsers && graphDisplayVisits && graphDisplayCarbon) {
            //display the complex graph
           visits.datasets[0].label = "Visits";
           options.scales.A.title.text = "Users & Visits";
    // @ts-ignore
           options.scales.A.display = true;
    // @ts-ignore
           visits.datasets[0].data = visitArr;
           visits.datasets[0].yAxisID = "A";
           //visits
    // @ts-ignore
           visits.datasets[2].data = userArr;
           visits.datasets[2].yAxisID = "A";
           options.scales.C.display = false;
           
           visits.datasets[1].label = "gCO2e";
    // @ts-ignore
           visits.datasets[1].display = true;
    // @ts-ignore
           visits.datasets[1].data = carbonArr;
           options.scales.B.display = true; 
           options.scales.B.positon = "left"; 

       } else if (graphDisplayUsers && graphDisplayCarbon) {
            //display the complex graph
            //users
           visits.datasets[2].label = "Users";
           options.scales.C.title.text = "Users";
    // @ts-ignore
           visits.datasets[2].data = userArr;
    // @ts-ignore
           options.scales.C.display = true; 
           visits.datasets[2].yAxisID = "C";

            //carbon
           visits.datasets[1].label = "gCO2e";
    // @ts-ignore
           visits.datasets[1].display = true;
    // @ts-ignore
           visits.datasets[1].data = carbonArr;
           options.scales.B.display = true; 
           options.scales.B.position = "left"; 

           //visits is off
           options.scales.A.display = false;
    // @ts-ignore
           visits.datasets[0].display = false;
    // @ts-ignore
           visits.datasets[0].data = []; 


       } else if (graphDisplayVisits && graphDisplayCarbon) {
            //display the complex graph
            //visits
           visits.datasets[0].label = "Visits";
    // @ts-ignore
           visits.datasets[0].data = visitArr;
           visits.datasets[0].yAxisID = "A";
           options.scales.A.display = true; 
           options.scales.A.title.text = "Visits";

            //carbon
           visits.datasets[1].label = "gCO2e";
    // @ts-ignore
           visits.datasets[1].display = true;
    // @ts-ignore
           visits.datasets[1].data = carbonArr;
           options.scales.B.display = true; 
           options.scales.B.position = "left"; 

           //users is off
           options.scales.C.display = false;
    // @ts-ignore
           visits.datasets[2].display = false;
    // @ts-ignore
           visits.datasets[2].data = []; 




        } else if (graphDisplayUsers && graphDisplayVisits) {
            //display the user graph
           visits.datasets[0].label = "Visits";
    // @ts-ignore
           visits.datasets[0].data = visitArr;
           options.scales.A.title.text = "Users & Visits";
           options.scales.A.display = true;
           visits.datasets[2].label = "Users";
    // @ts-ignore
           visits.datasets[2].data = userArr;
           visits.datasets[2].yAxisID = "A";
           //turn co2 off[
    // @ts-ignore
           visits.datasets[1].display = false;
    // @ts-ignore
           visits.datasets[1].data = []; 
           options.scales.B.display = false; 
           options.scales.C.display = false;

        } else if (graphDisplayUsers) {
            //display the user graph
           visits.datasets[2].label = "Users";
           options.scales.C.display = true;
           options.scales.C.title.text = "Users";
           options.scales.C.position = "right"; 
    // @ts-ignore
           visits.datasets[2].data = userArr;
           visits.datasets[2].yAxisID = "C";

           //hide visits and carbon
    // @ts-ignore
           visits.datasets[1].display = false;
    // @ts-ignore
           visits.datasets[1].data = []; 
           options.scales.B.display = false; 
    // @ts-ignore
           visits.datasets[0].display = false;
    // @ts-ignore
           visits.datasets[0].data = []; 
           options.scales.A.display = false; 

        } else if (graphDisplayCarbon) {
            //display the co2 graph
           visits.datasets[1].label = "gCO2e";
    // @ts-ignore
           visits.datasets[1].data = carbonArr;
           options.scales.B.title.text = "gCO2e";
           options.scales.B.display = true; 
           options.scales.B.position = "right"; 
            //turn users and visits off
    // @ts-ignore
           visits.datasets[0].display = false;
    // @ts-ignore
           visits.datasets[0].data = []; 
    // @ts-ignore
           visits.datasets[2].display = false;
    // @ts-ignore
           visits.datasets[2].data = []; 
           options.scales.A.display = false; 
           options.scales.C.display = false; 


        } else if (graphDisplayVisits) {
           visits.datasets[0].label = "Visits";
    // @ts-ignore
           visits.datasets[0].data = visitArr;
           options.scales.A.display = true; 
           options.scales.A.position = "right"; 
           options.scales.A.title.text = "Visits";
           
           //turn users and co2 off
    // @ts-ignore
           visits.datasets[2].display = false;
    // @ts-ignore
           visits.datasets[2].data = []; 
    // @ts-ignore
           visits.datasets[1].display = false;
    // @ts-ignore
           visits.datasets[1].data = []; 
           options.scales.C.display = false; 
           options.scales.B.display = false; 
        } else {
           visits.datasets[0].label = "No Data";
    // @ts-ignore
           visits.datasets[0].data = []; 
           options.scales.A.display = true;
           
    // @ts-ignore
           visits.datasets[1].display = false;
    // @ts-ignore
           visits.datasets[1].data = []; 
    // @ts-ignore
           visits.datasets[2].data = []; 

           options.scales.A.title.text = "No Data";
           options.scales.B.display = false; 
           options.scales.C.display = false; 
        }
        visits = visits;
    }
</script>

<section class="graph-section-container">
{#if visits && dataAvailable}
    <header class="graph-header">
        <div class="graph-text-container">
            <h3 class="graph-title">
               Overview 
            </h3>
            <p class="graph-text">
                CarbonClicks respects user privacy whilst providing high quality data on website carbon emissions. <a href="/guide" target="_blank">Read our Guides</a> to find out more about how to improve your emissions.
            </p>
        </div><!--graph-text-container-->
        <div class="graph-button-container">
            <button class={"graph-button " + button0Class} on:click={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (graphDisplayUsers) {
                        graphDisplayUsers = false;
                    } else {
                        graphDisplayUsers = true;
                    }
                    changeButtonSelected(0);
                    adjustGraph();
                    }}>
                Users 
            </button>
            <button class={"graph-button " + button1Class} on:click={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (graphDisplayVisits) {
                        graphDisplayVisits = false;
                    } else {
                        graphDisplayVisits = true;
                    }
                    changeButtonSelected(1);
                    adjustGraph();
                    }}>

                    Visits
            </button>
             <button class={"graph-button " + button2Class} on:click={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (graphDisplayCarbon) {
                        graphDisplayCarbon = false;
                    } else {
                        graphDisplayCarbon = true;
                    }
                    changeButtonSelected(2);
                    adjustGraph();
                    }}>

                    CO<sub>2</sub>e 
            </button>

        </div><!--graph-button-container-->
    </header><!--graph-header-container-->
    <div class="graph-container">
        <Line data={visits} {options} />

    </div><!--graph-container-->
{:else}
    <Loader text={"Creating the graph."} />
{/if}

</section><!--graph-section-container-->

<style>
    .graph-section-container {
        padding: calc(var(--dash-base-measure) * 0) calc(var(--dash-base-measure) * 0);
        height: auto;
        margin: calc(var(--base-measure) * 4) 0rem;
    }
    .graph-container {
        width: calc(100% - 2rem);
    }
    .graph-header {
        display: grid;
        grid-template-columns: 100%;
    }
    .graph-text-container {
        margin-bottom: calc(var(--dash-base-measure) * 2);
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
    .graph-button-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .graph-button {
        border-radius: 0rem;
        background-color: var(--background-color-one);
        margin:0rem 0.2rem;
        width: auto;
        padding: 0.4rem 0.6rem 0.3rem 0.6rem;
        border-color: var(--font-color-one);
    }
    .graph-button:hover {
        background-color: var(--background-color-two);
        color: var(--background-color-one);
    }
    .graph-button-selected {
        background-color: var(--background-color-two);
        color: var(--background-color-one);
    }
    @media only screen and (min-width: 32rem) {
        .graph-section-container {
            padding: 0rem calc(var(--dash-base-measure) * 4);
            min-height: 28rem;
            margin: calc(var(--base-measure) * 6) 0rem;
        }
        .graph-container {
            height: 21rem;
            width: 100%;
        }
        .graph-title {
            font-family: bodyFont;
            font-size: var(--dash-title-one-sans-font-size);
            text-align: left;
        }
        .graph-text {
            max-width: 30rem;
            text-align: left;
        }
        .graph-button-container {
            padding-top: 4rem;
            text-align: right;
            padding-right: 4rem;
            justify-content: flex-end;
        }
        .graph-button {
            width: 100%;
            max-width: 12rem;
            margin:0rem 2rem;
        }
    }
    @media only screen and (min-width: 80rem) {
        .graph-header {
            display: grid;
            grid-template-columns: 50% 50%;
        }

    }
</style>
