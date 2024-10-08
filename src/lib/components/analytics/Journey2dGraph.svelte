<script lang="ts">
	import { getContext } from "svelte";
  import type { Data } from "$lib/types/dashboard";
	let sorted_data: SvelteStore<Data> = getContext("data");
    $: $sorted_data, data_update();
    
      import { url_shortener } from "$lib/utils/url";
    import { onMount } from 'svelte';
  import Journey3dGraph from "$lib/components/analytics/Journey3dGraph.svelte";

    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { zoom, zoomIdentity } from 'd3-zoom';
    import { schemeCategory10 } from 'd3-scale-chromatic';
    import { select, selectAll, pointer } from 'd3-selection';
    import { drag } from 'd3-drag';
    import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';

    let d3 = { zoom, zoomIdentity, scaleLinear, scaleOrdinal, schemeCategory10, select, selectAll, pointer, drag,  forceSimulation, forceLink, forceManyBody, forceCenter }

    let graph;

    let svg;
    let canvas: HTMLCanvasElement | null | any;
    let idCanvas: HTMLCanvasElement | null | any;
    let width: number = 1400;
    let height: number = 900;
    

     let links: any = [];
     let nodes: any = [];
     $: links;
     $: nodes;


    let transform = d3.zoomIdentity;
  let simulation: any, context: any, idContext: any;
    function data_update() {
        if ($sorted_data.force_dataset ) {
            console.log($sorted_data.force_dataset);
            console.log("data updated");
            links = $sorted_data?.force_dataset?.links; 
            nodes = $sorted_data?.force_dataset?.nodes; 
            // all from onmount
        context = canvas.getContext('2d');
        idContext = idCanvas.getContext('2d');
        resize()
        
        simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id((d:any) => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
           .on("tick", simulationUpdate);

        // title

            d3.select(context.canvas).on("mousemove", tooltip);
       

        d3.select(canvas)
        .call(d3.drag()
            .container(canvas)
            .subject(dragsubject)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .call(d3.zoom()
          .scaleExtent([1 / 20, 8])
            .on('zoom', zoomed));

        /*
        These are read only properties
        transform.x = -2000;
        transform.y = -1500;
        transform.k = 4;
        */

        }
                }
     function tooltip (pointerEvent: any) {
         console.log("finding tooltip");
            const d = getNodeFromMouseEvent(pointerEvent);
            if (d)
                context.canvas.title = d.id;
            else
                context.canvas.title = '';
        };
    const groupColour = d3.scaleOrdinal(d3.schemeCategory10);
    onMount(() => {
    });

    function simulationUpdate() {
        nodes = [...nodes]
        links = [...links]
        context.save();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);

        idContext.save();
        idContext.clearRect(0, 0, idContext.canvas.width, idContext.canvas.height);
        idContext.translate(transform.x, transform.y);
        idContext.scale(transform.k, transform.k);
        

        links.forEach((d: any )=> {
            context.beginPath();
            context.moveTo(d.source.x, d.source.y);
            context.lineTo(d.target.x, d.target.y);
            context.globalAlpha = 0.6;
            context.strokeStyle = "#999";
            context.lineWidth = Math.sqrt(d.value);
            context.stroke();
            context.globalAlpha = 1;
        });
        
        nodes.forEach((d: any, i: number) => {
            context.beginPath();
            context.arc(d.x, d.y, 5, 0, 2*Math.PI);
            context.strokeStyle = "#fff";
            context.lineWidth = 2;
            context.stroke();
            context.fillStyle = groupColour(d.group);
            context.font = "3px sans-serif";
            context.fillText(url_shortener(d.id, 80), d.x + 6, d.y);

            context.fill();
            
            idContext.beginPath();
            idContext.arc(d.x, d.y, 6, 0, 2*Math.PI);
            idContext.fillStyle = indexToColor(i);
            idContext.fill();
        });
        context.restore();
        idContext.restore();
    }
 
    function zoomed(currentEvent: any) {
        transform = currentEvent.transform;
        simulationUpdate();
    }

function dragsubject(pointerEvent: any) {
        const node = getNodeFromMouseEvent(pointerEvent);
        if (node) {
            node.x = transform.applyX(node.x);
            node.y = transform.applyY(node.y);
        }
        return node;
    }

    // This method of hit detection is poor on small devices because fat fingers
    // can't hit small targets. Alternatives:
    //  - add a hit radius to this (larger for small touch screens)
    //  - use simulation.find() with a hit radius (larger for small touch screens)
    function getNodeFromMouseEvent(pointerEvent: any) {
        let pointer = d3.pointer(pointerEvent);
        const color = idContext.getImageData(pointer[0], pointer[1], 1, 1).data;
        const index = colorToIndex(color);
        const node = nodes[index];
        return node;
    };

    function dragstarted(currentEvent: any) {
        if (!currentEvent.active) simulation.alphaTarget(0.3).restart();
        currentEvent.subject.fx = transform.invertX(currentEvent.subject.x);
        currentEvent.subject.fy = transform.invertY(currentEvent.subject.y);
    }

    function dragged(currentEvent: any) {
        currentEvent.subject.fx = transform.invertX(currentEvent.x);
        currentEvent.subject.fy = transform.invertY(currentEvent.y);
    }

    function dragended(currentEvent: any) {
        if (!currentEvent.active) simulation.alphaTarget(0);
        currentEvent.subject.fx = null;
        currentEvent.subject.fy = null;
    }

    function indexToColor(index: number) {
        const color = "#" + (index + 1).toString(16).padStart(6, "0");
        return color;
    }

  function colorToIndex(color: any) {
        const index = ((color[0] << 16) + (color[1] << 8) + color[2]) - 1;
        return index;
    }

    function resize() {
        ({ width, height } = canvas);
    }




</script>

<svelte:window on:resize='{resize}'/>

<div class='container'>
    <canvas bind:this={canvas} width='{width}' height='{height}'/>
    <canvas bind:this={idCanvas} width='{width}' height='{height}' hidden='{true}'/>
</div>
{#key $sorted_data.force_dataset}
{#if $sorted_data.force_dataset}
    <Journey3dGraph {nodes} {links} />
{/if}
{/key}

<style>
	canvas {
      float:left;
	}
</style>
