<script lang="ts">
   import ForceGraph3D from "$lib/graphs/3d-force-graph";
    import SpriteText from 'three-spritetext';
    import { onMount } from 'svelte';
    import { Colors } from "$lib/colors";

    export let nodes;
    export let links;
    let canvasDom: HTMLDivElement | null;

    onMount(() => {
      let colors = Colors(5);
      let width = document.getElementsByClassName("dashboard-center")[0].clientWidth ?? 1000;
      let height = document.getElementsByClassName("dashboard-center")[0].clientHeight ?? 900;
        /* 3D graph stuff*/

  const gData = {
      nodes,
      links
  };
  function get_random_color() {
    return colors.scaleArr[Math.floor(Math.random() * colors.scaleArr.length -1)];
  }
  const Graph = ForceGraph3D()(canvasDom).graphData(
    gData
  )
  .width(width)
  .height(height)
  .backgroundColor("black")
  .nodeLabel('id')
     //  .nodeAutoColorBy('group')
     .nodeColor(get_random_color)
     //.linkDirectionalArrowLength(3.5)
      //.linkDirectionalArrowRelPos(0.5)
      //.linkCurvature(0.25)
      .onNodeClick((node: any) => {
          // Aim at node from outside it
          const distance = 40;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

          const newPos = node.x || node.y || node.z
            ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
            : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

          Graph.cameraPosition(
            newPos, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
          );
        })
        .onNodeDragEnd((node: any) => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        })
      .linkDirectionalParticleColor(() => colors.green)
      .linkDirectionalParticleWidth(1)
      .linkDirectionalParticles("value")
      .linkDirectionalParticleSpeed((d: any) => d.value * 0.0006); 

      
      /*
       .nodeThreeObject(node => {
          const sprite = new SpriteText(node.id);
          sprite.material.depthWrite = false; // make sprite background transparent
          sprite.color = node.color;
          sprite.textHeight = 8;
          return sprite;
        });
        */

    // Spread nodes a little wider
    Graph.d3Force('charge').strength(-20);
    // fit to canvas when engine stops
    Graph.onEngineStop(() => Graph.zoomToFit(1000));

    });
</script>

<div id="3d-graph" bind:this={canvasDom}/>

<style>
  :global(.scene-container) {
    width: 100%;
    height: auto;
  }
  :global(.scene-nav-info) {
    color: var(--white);
    min-width: 20rem;
  }
</style>
