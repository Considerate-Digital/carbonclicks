<script lang="ts">
	//icons
	import Launch from 'carbon-icons-svelte/lib/Launch.svelte';
	import ChartAverage from 'carbon-icons-svelte/lib/ChartAverage.svelte'; 
	import Earth from 'carbon-icons-svelte/lib/Earth.svelte'; 
	import Play from 'carbon-icons-svelte/lib/Play.svelte';
	import Pdf from 'carbon-icons-svelte/lib/Pdf.svelte';
	import Result from 'carbon-icons-svelte/lib/Result.svelte';
	import Table from 'carbon-icons-svelte/lib/Table.svelte';
	import Catalog from 'carbon-icons-svelte/lib/Catalog.svelte';
	import QueryQueue from 'carbon-icons-svelte/lib/QueryQueue.svelte';
	import OverflowMenuVertical from 'carbon-icons-svelte/lib/OverflowMenuVertical.svelte';
	import Certificate from 'carbon-icons-svelte/lib/Certificate.svelte';
	import ChartLineData from 'carbon-icons-svelte/lib/ChartLineData.svelte';
	import EarthAmericas from 'carbon-icons-svelte/lib/EarthAmericas.svelte';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	
	//icons end
	import Loader from '$lib/components/common/Loader.svelte';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import { onMount } from 'svelte';
	//for pdf generation
	import { jsPDF} from 'jspdf';
	import html2canvas from 'html2canvas';
	let loading = false;
	//console.log('menu component session var ' + session);
	let runIconColor = 'green-icon';
	let reportIconColor = 'green-icon';
let exportsAvailable = false;
let demo_text = "";

	if ($page) {
          const demo = $page.url.searchParams.get("demo") ?? undefined;
          if (demo) {
						demo_text = "?demo=true";
					} else {
						demo_text = ""
						}
	}


export	async function generatePdf () {
		try{
		let canvas = await html2canvas(document.body);
		// @ts-ignore
		let width = document.body.clientWidth.toString();
		// @ts-ignore
		let height = document.body.clientHeight.toString();
		let canvasData = canvas.toDataURL("image/jpeg", 1.0);
		// @ts-ignore
		let pdf = new jsPDF('l', "px", [width, height] );
		let pdfWidth = pdf.internal.pageSize.getWidth();
		let pdfHeight = pdf.internal.pageSize.getHeight();
		pdf.addImage(canvasData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
		pdf.save("Website_Carbon_Emissions_Report.pdf");

} catch (e) {
console.log(e);
	}
}
export async function generatePng () {
	try {
		let downloadLink = document.createElement('a');
		downloadLink.setAttribute('download', 'Website_Carbon_Emissions_Report.png');

		let canvas = await html2canvas(document.body);
		// @ts-ignore
		canvas.toBlob(blob => {
		// @ts-ignore
			let url = URL.createObjectURL(blob);
			downloadLink.setAttribute('href', url);
			downloadLink.click();
			});
		} catch (err) {
			console.log(err);
	}
} 

</script>
	<section class="menu-container">
		<nav>
			<ul class="menu-items">
				<!--div class="menu-item" on:click={runNewTest}>
					<Play size={24} />
				</div-->
				<a href="/dashboard{demo_text}" class="menu-item" >
					<li>
						<ChartLineData size={32} />
						<Tooltip 
							tip={"Overview"}
							right={true}
						/>
					</li>
				</a>
				<a href="/dashboard/pages{demo_text}" class="menu-item" >
					<li>
						<Table size={32} />
						<Tooltip 
							tip={"Pages"}
							right={true}
						/>

					</li>
				</a>
				<a href="/dashboard/countries{demo_text}" class="menu-item" >
					<li>
						<EarthAmericas size={32} />
						<Tooltip 
							tip={"Countries"}
							right={true}
						/>

					</li>
				</a>

				<a href="/dashboard/pages{demo_text}" class="menu-item hide" >
					<li>
						<QueryQueue size={32} />
						<Tooltip 
							tip={"3D"}
							right={true}
						/>

					</li>
				</a>
					<!--div class="menu-item" on:click={redirectToDocs}>
					<Catalog size={24} />
					<Tooltip tip="Knowledge Guide" right={true}/>
				</div>
				<div class="menu-item" on:click={redirectToCertification}>
					<Certificate size={24} />
					<Tooltip tip="Certification" right={true}/>
				</div-->

				<li class="menu-item hide" >
					<OverflowMenuVertical size={24} />
					<div class="sub-menu" >
						<div class="sub-menu-item" on:click={generatePdf} on:keydown={generatePdf} tabindex="-4" role="button">
							<span class="sub-menu-text">Export as PDF</span><span><Launch size={16} /></span>
						</div><!--sub-menu-item-->
						<div class="sub-menu-item" on:click={generatePng} on:keydown={generatePng} tabindex="-4"role="button">
							<span class="sub-menu-text">Export as PNG</span><span><Launch size={16} /></span>
						</div><!--sub-menu-item-->
					</div><!--sub-menu-->
				</li>
			</ul>
		</nav>
		<div
		class="logout-container-wrapper"
	>
		<a href="/dashboard/login?logout=true">
	<div class="menu-item">
		<Logout size={32} />
		<Tooltip 
			tip={"Logout"}
			right={true}
		/>
	</div>
	</a>
<div class="version-text">
		0.2.0
	</div>
		</div>
	</section>
<style>
	.menu-container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-top: calc(var(--base-measure) * 10);
	}

	.menu-items {
		padding: 0rem;
		list-style: none;
		margin: 0rem;
	}
	.menu-item {
		height: calc(var(--base-measure) * 19);
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--font-color-one);
	}
	.menu-item:hover {
		text-decoration: none;
		color: var(--primary-color-one);
	}
	.menu-item li {
		display: flex;
		padding: 0rem calc(var(--base-measure) * 2);
		align-items: center;
		justify-content: start;
		font-size: 1.2rem;
	}
	.menu-item:hover > .sub-menu {
		display: block;

	}
	.sub-menu {
		display:none;
		position:absolute;
		left: calc(var(--dash-standard-measure) );
		height: calc(var(--dash-standard-measure) + 2px);
		background-color: var(--grey-ultra-light);
		z-index: 2;	
	}
	.sub-menu-item {
		width: calc(var(--dash-standard-measure) * 2);
		display: flex;
		padding: 0.4em 0.6em;

	}
	.sub-menu-item:hover {
		background-color: var(--purple);
	}
	.sub-menu-text {
		font-size: 1em;
		width: 100%;
	}	

	:global(.menu-item  svg ) {
		fill: var(--background-color-one);
	}
	:global(.menu-item:hover  svg) {
		fill: var(--primary-color-one-light);
	}
	:global(.menu-item:active  svg) {
		fill: var(--primary-color-one);
	}
	.logout-container-wrapper {
		padding-bottom: calc(var(--base-measure) * 1);
	}
	.logout-container-wrapper .menu-item {
		height: calc(var(--base-measure) * 15);
	}

	.version-text {
		font-size: 0.625rem;
		color: var(--background-color-one);
		padding: 0em 0.4em 0.4em 0.4em;
		text-align: center;
		}
</style>
