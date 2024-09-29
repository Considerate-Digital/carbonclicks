<script lang="ts">

    import Chart from 'chart.js/auto';
    import { Doughnut } from 'svelte-chartjs'
    import {onMount,tick} from 'svelte';
    import { url_shortener } from "$lib/utils/url";
    import chroma from "chroma-js";
    import type { Data, TimePeriod } from "$lib/types/dashboard";
    import { Colors } from "$lib/colors";

    let color_set = Colors();
    // not a store
    export let sorted_data: Data;

    export let timePeriod: TimePeriod = "week";


    let graphData;

    let views;
    let white = color_set.white;
    let purple = color_set.green; 
    let green = color_set.swamp; 
    let pink = color_set.black; 


    let max_slices = 5;
      let pink_scale = chroma.scale([pink, white]).domain([0, max_slices]);
      let green_scale = chroma.scale([green, white]).domain([0, max_slices]);
      let purple_scale = chroma.scale([purple, white]).domain([0, max_slices]);
      let scaleArr = [];
      while (scaleArr.length < max_slices) {
        scaleArr.push(pink_scale(scaleArr.length).hex());
        scaleArr.push(green_scale(scaleArr.length - 1).hex());
        scaleArr.push(purple_scale(scaleArr.length - 2).hex());
    }

    let options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
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

                    function getBody(bodyItem: any) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        const titleLines = tooltipModel.title || [];
                        const bodyLines = tooltipModel.body.map(getBody);

                        let innerHtml = '<thead>';

                        titleLines.forEach(function(title: string) {
                            innerHtml += '<tr><th>' + title + '</th></tr>';
                        });
                        innerHtml += '</thead><tbody>';

                        bodyLines.forEach(function(body: any, i: any) {
                          body[0] = body[0].replace(":", "");
                            const colors = tooltipModel.labelColors[i];
                            let style = "";
                            const span = '<span style="' + style + '">' + Number(body).toFixed(2) + sorted_data.pageArr[0].carbon_unit + "Co2e" + '</span>';
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
            labels: sorted_data.pageArr.map( row => row.path ? url_shortener(row.path, 80) : "Unknown" ), 
            backgroundColor: "rgba(225, 225, 225, 1)",
            datasets: [
                {
                yAxisID: "A",
                label: " ",
                fill: true,
                lineTension: 0.3,
                backgroundColor: scaleArr, //[purple, green, pink, purple, green, pink, purple, green, pink],//rgba(230, 230, 230, 0.3)",
                hoverBackgroundColor: "rgba(195, 197, 192, 1)",
                /*
                pointRadius: 20,
                pointBackgroundColor: "rgba(42, 04, 244, 0)",
                pointBorderColor: "rgba(0, 0, 0, 0)",
                borderColor: "rgba(61, 214, 11, 1)",
                */
                data: sorted_data.pageArr.slice(0, 14).map( row => row.carbon )
                },
            ],
        }

    let xAxisUnits = [];
    let xAxisKey = "none";
    let dataByTimePeriod;

    let yAxisUnit = "visits";

    let dbit = {
        timeUnit: "",
        count: 0, //int
        carbon: 0 //grams
        }

    onMount(async () => {
       
       //sort out the graph options
            if (timePeriod) {
                //await sortData();
            }
            });

    let graphDisplayUsers = true;
    let graphDisplayVisits = false;
    let graphDisplayCarbon = false;

</script>

{#if visits}
<section class="graph-section-container">
    <header class="graph-header">
        <div class="graph-text-container">
            <h3 class="graph-title">
                Pages
            </h3>
            <p class="graph-text">
              Every website contains a mixture of webpages and endpoints. Discover the emissions profile of your webpages.
            </p>
        </div><!--graph-text-container-->
            </header><!--graph-header-container-->
    <div class="graph-container">
        <Doughnut data={visits} {options} />
    </div><!--graph-container-->
</section><!--graph-section-container-->
{/if}

<style>
    .graph-section-container {
        padding: calc(var(--dash-base-measure) * 4) calc(var(--dash-base-measure) * 2);
    }
    .graph-container {
        height: 27rem;
        width: auto;
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

    @media only screen and (min-width: 32rem) {
    .graph-section-container {
        display: block;
        padding: calc(var(--dash-base-measure) * 4);
    }
    .graph-header {
        display: grid;
        grid-template-columns: 50% 50%;
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
    }
</style>
