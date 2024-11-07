<script lang="ts">
    import Header from "$lib/components/common/Header.svelte";
    import OpenPanelLeft from 'carbon-icons-svelte/lib/OpenPanelLeft.svelte';
    import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
    import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
    import Menu from "$lib/components/guide/Menu.svelte";
    import Footer from "$lib/components/common/Footer.svelte";
    import {onMount} from 'svelte';
    import {page} from '$app/stores';
    import {goto} from '$app/navigation';
    import * as animateScroll from 'svelte-scrollto';
    $: currentUrlPath = '';
    let urlPaths = [];
    let menu, breadcrumbs;
    function extractUrlPaths (url) {
        let urlPathString = url//.split('/')[1];
        if (urlPathString.length > 0 ) { 
            let urlPathArray = urlPathString.split('/');
                
            let link = `${import.meta.env.VITE_DOMAIN_ADDRESS}`; 
            urlPaths = [];
            for (let i = 1; i < urlPathArray.length; i++) {
               let path = urlPathArray[i];
               link = `${link}/${path}`; 
               console.log(path);
               let urlPath = {
                    path: path,
                    link: link
                };
                urlPaths.push(urlPath);
                urlPaths = urlPaths;
            }

        }
    }
        
    function colorCurrentMenuItem() {
        let allLists = document.querySelectorAll('.docs-menu-section a');
        for (let i = 0; i < allLists.length; i++) {
            let list = allLists[i];
            list.style.color = "var(--black)";
        }
        let menuListItem = document.querySelector(`.docs-menu-section a[href="${currentUrlPath}"]`);
        console.log(menuListItem);
        menuListItem.style.color = 'var(--purple)';
    }


    //content nav

    let contentNavItems = [];
    let headerCollection;
    function decolorInternalHeaders() {
        let allLists = document.querySelectorAll('.docs-article-nav-container li');
        for (let i = 0; i < allLists.length; i++) {
            let item = allLists[i];
            item.style.color = "var(--font-color-one)";
        }

    }
    function scrollToInternalHeader(e) {
        decolorInternalHeaders();
        let target = e.target;
        let text = target.innerHTML;
        for( let i=0; i < headerCollection.length; i++) {
            let header = headerCollection[i];
            if (header.innerHTML === text) {
               animateScroll.scrollTo({element: header, offset: -60}); 
            }
        }
        target.style.color = "var(--primary-color-four)";
    }

    function sortContentHeaders () {
        setTimeout(() => {
            //content nav stuff
            contentNavItems = [];
            contentNavItems = contentNavItems;
            headerCollection = document.querySelectorAll('.docs-content-container h3');
            for (let i = 0; i < headerCollection.length; i++) {
                let header = headerCollection[i].innerHTML;
                contentNavItems.push(header);
            }
            //set items on dom
            contentNavItems = contentNavItems;
        }, 1000);
    }

    function pageChange() {
       console.log("page change called");
       currentUrlPath = $page.url.pathname;
       console.log(currentUrlPath);
       extractUrlPaths(currentUrlPath);
        if (currentUrlPath != $page.url.pathname) {
            extractUrlPaths($page.url.pathname);
            currentUrlPath = $page.url.pathname;
            }

        sortContentHeaders();
        colorCurrentMenuItem();
        decolorInternalHeaders();
    }
     
    onMount(() => {
       //currentUrlPath = $page.url.pathname;
       //extractUrlPaths(currentUrlPath);
        menu = document.getElementsByClassName('docs-menu-container')[0];
        breadcrumbs = document.getElementsByClassName('docs-breadcrumbs-container')[0];
        window.addEventListener("scroll", checkScroll);
        window.addEventListener("scroll", () => { 
            if (currentUrlPath != $page.url.pathname) {
            extractUrlPaths($page.url.pathname);
            currentUrlPath = $page.url.pathname;
            }
        });
        window.addEventListener("click", () => { 
            if (currentUrlPath != $page.url.pathname) {
            extractUrlPaths($page.url.pathname);
            currentUrlPath = $page.url.pathname;
            }
        
        });
        let listItems = document.getElementsByTagName('li');
        for (let i=0; i < listItems.length; i++) {
            listItems[i].addEventListener("click", () => {
                setTimeout(() => {
                    pageChange();
                }, 300);
            });
        }

        sortContentHeaders();
        });
    let menuOpen = false;
    function toggleMenu() {
       let widthOk = window.matchMedia("(min-width:80rem)").matches;
       if (widthOk) {return};
       console.log("menu Action");
       if (menuOpen) {
        //close menu
        menu.style.display = "none";
        menuOpen = false;
        bodyScrollToggle();
       } else {

        //open menu
        menu.style.display = "block";
        menuOpen = true;
        bodyScrollToggle();
        }
    }
    let bodyScrollable = true;
    function bodyScrollToggle () {
        let body = document.getElementsByTagName('body')[0];
        let html = document.getElementsByTagName('html')[0];

        if (bodyScrollable) {
            body.style.overflow = "hidden";
            html.style.overflow = "hidden";
            bodyScrollable = false;
        } else if (!bodyScrollable){
            body.style.overflow = "scroll";
            html.style.overflow = "scroll";
            bodyScrollable = true;
        }        
    }
    let breadcrumbsOpen = false;
    let checking_scroll = false;
    //TODO turned off
    function checkScroll() {
        return;
        if (checking_scroll) { return }
        checking_scroll = true;
        setTimeout(() => {
            let widthOk = window.matchMedia("(min-width:80rem)").matches;
            if (!widthOk) {
                breadcrumbsOpen = true;
                return;
            };
           let windowTop = window.pageYOffset; 
           let allowHeight = document.getElementsByTagName("body")[0].offsetHeight - 1200;
           //console.log(windowTop);
           if ((windowTop > (7 * 7) || windowTop < allowHeight) && widthOk && !breadcrumbsOpen) {
            breadcrumbs.style.display = "flex";
            breadcrumbsOpen = true;
           } else if ( (windowTop < (7*7) || windowTop > allowHeight) && widthOk && breadcrumbsOpen){
            breadcrumbs.style.display = "none";
            breadcrumbsOpen = false;
           }
           checking_scroll = false;
        }, 400);

    } 
    function cleanPath (path) {
        let splitPath = path.split("-");
        let joinPath = splitPath.join(" ");
        
        return joinPath;
        
    }
    function gotoHome () {
        goto("/");
    }
</script>

<svelte:head>
    <script src="{import.meta.env.VITE_DOMAIN_ADDRESS}/scripts/counter.js" data-carbon-clicks-id="demo" data-carbon-clicks-endpoint="{import.meta.env.VITE_DOMAIN_ADDRESS}/public/api/analytics"></script>

    <title>CarbonClicks Guides</title>
    <meta property="og:title" content="CarbonClicks Guides">
     <meta property="og:image" content="https://considerate.digital/images/public/guide/ogSmall.png">
    <meta property="og:url" content="https://considerate.digital/public/guide">
    <meta property="og:description" content="CarbonClicks Guides offer practical advice on how to cut down your website carbon emissions" />
    <meta name="twitter:card" content="https://considerate.digital/images/public/guide/ogLarge.png">
    <meta name="twitter:image:alt" content="Considerate Digital Knowledge Guide">
</svelte:head>


<section class="docs-container" >
    <Header />
    <section class="docs-breadcrumbs-container">
        <div class="docs-breadcrumbs-icon-container" on:click={toggleMenu}>
            <OpenPanelLeft size={24} />
        </div><!--docs-breadcrumbs-icon-container-->
                <div class="docs-breadcrumbs-items-wrapper">
        {#if urlPaths.length > 0}
            {#if urlPaths.length -1}
                    <div class="docs-breadcrumbs-title-container">
                        <h4 class="docs-breadcrumbs-title">
                            {cleanPath(urlPaths[urlPaths.length -1].path)}
                        </h4>
                    </div><!--docs-breadcrumbs-title-container-->
                {/if}


            <div class="docs-breadcrumbs-items">
                {#each urlPaths as path, i}
                    {#if i > 0}
                        <ArrowRight size={16} />
                    {/if}
                        <a href="{path.link}" class="docs-breadcrumbs-item-link">
                        {cleanPath(path.path)}
                    </a>

                {/each}
            </div><!--docs-breadcrumbs-items-->
        {/if}
        </div><!--docs-breadcrumbs-items-wrapper-->
    </section><!--docs-breadcrumbs-container-->
    <aside class="docs-menu-container">
        <Menu /> 
    </aside><!--docs-menu-container-->
    <section class="docs-content-container">
        <slot>
        </slot>
    </section>
    <aside class="docs-article-nav-container">
        {#if contentNavItems.length > 0}
        <div class="docs-article-nav-items-container">
            <h5 class="docs-article-nav-items-title">
                In this article
            </h5>
            <ul>
            {#each contentNavItems as item}
                <li class="article-content-nav-item" on:click={scrollToInternalHeader}>{item}</li> 
            {/each}
            </ul>
        </div><!--docs-article-nav-items-container-->
        {/if}
    </aside><!--docs-article-nav-cantainer-->
</section><!--docs-container-->

<Footer />

<style>
    .docs-container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: calc(var(--dash-base-measure) *5) calc(var(--dash-base-measure) * 7) auto;
        height: auto;
        min-height: 100vh;
    }
    .docs-header-container {
        grid-row: 1/2;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0rem calc(var(--dash-base-measure) *2);
        background-color: var(--black);

    }

    .docs-header-left-container {
        display: flex;
        justify-content:flex-start;
        align-items:center;
    }
    .docs-header-logo-container {
        margin-right: calc(var(--dash-base-measure) *1.4);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .docs-title {
        font-size: 1.3rem;
        color: var(--white);
        font-family: bodyFont;
    }
    .docs-header-beta-text {
        color: var(--purple);
        font-size: var(--dash-label-one-font-size);

    }
    .docs-breadcrumbs-container, .docs-breadcrumbs-icon-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .docs-breadcrumbs-container {
        padding: calc(var(--dash-base-measure) *1) calc(var(--dash-base-measure) *2);
        padding-top: 4rem;
    }
    .docs-breadcrumbs-icon-container {
        margin-left: -0.06rem;
    }
    .docs-breadcrumbs-title-container {
        display: none;
        
    }
    .docs-breadcrumbs-items {
        margin-left: var(--dash-base-measure);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        display: none;
    }
    .docs-breadcrumbs-items a {
        margin: 0rem calc(var(--dash-base-measure)* 1);
    }
    
    .docs-breadcrumbs-item-link {
        text-transform: capitalize;
    }
    .docs-menu-container {
        padding: var(--dash-component-padding);
        background-color: var(--primary-color-three-light);
        display: none;
        min-height: 100vh;
        position: fixed;
        top: calc(var(--dash-base-measure) * 14);
        width: 100%;
        z-index: 9;
    }
       .docs-content-container {
        padding: var(--dash-base-measure);
        padding-bottom: calc(var(--dash-base-measure) * 20);
        grid-row: 3/4;
        max-width: 58rem;

    }


    /*article nav */
    .docs-article-nav-container {
        /*temporarily do not display*/
        display: none;
        min-height: calc(var(--dash-base-measure) *14);
    }


    /*Footer */

    .docs-footer-container {
        grid-row: 4/5;
    }
    @media only screen and (min-width: 80rem) {
    .docs-container {
        grid-template-columns: 17rem 1fr 17rem; 
        grid-template-rows: calc(var(--dash-base-measure) *5) auto;
        min-height: 100vh;
    }
    :global(.docs-container .home-header-container) {
        position: static !important;
        grid-column: 2/4;
    }
    .docs-breadcrumbs-container {
        display: none;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        width: calc(100% - (17rem));
        height: calc(var(--dash-base-measure) *7);
        background-color: var(--white);
        border-bottom: 1px solid var(--grey-ultra-light);
        right: 0;
        top: 2.4rem;
        z-index:2;
        color: var(--black);
        padding-right: calc(var(--dash-base-measure) * 4);
        padding-left: calc(var(--dash-base-measure) * 4);
        padding-top: calc(var(--base-measure) *1);
    }
    .docs-breadcrumbs-items-wrapper {
        width: 100%;
    }
    .docs-breadcrumbs-items {
        grid-column: 2/3;
        grid-row: 1/2;
        width: 100%;
    }
    .docs-breadcrumbs-title-container {
        display: block;
        grid-column: 1/2;
        grid-row: 1/2;
        width: max-content;
    }
    .docs-breadcrumbs-items-wrapper {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto;
    }
    
    .docs-menu-container {
        display: block;
        position: static;
        grid-column: 1/2;
        grid-row: 1/4;
        min-height: auto;
        height: 100%;
    } 
    :global(.docs-menu-container nav) {
        position: sticky;
        top: 1rem;
    }
    .docs-content-container {
        grid-column: 2/3;
        grid-row: 2/4;
        padding-right: calc(var(--dash-base-measure) * 4);
        padding-left: calc(var(--dash-base-measure) * 4);
        max-width: 50rem;
    }
    .docs-article-nav-container {
        grid-column: 3/4;
        grid-row: 2/4;
        height: max-content;
        width: 17rem;
        display: block; 
        position: sticky;
        top: 1rem;
        right:0;
        padding: calc(var(--dash-base-measure) * 6) calc(var(--dash-base-measure) *4);
        
    }
    .docs-article-nav-container ul {
        padding: 0rem;
        margin: 0rem;
    }
    .docs-article-nav-items-title {
        font-family: bodyFont;
        text-transform: uppercase;
        font-size: var(--pub-caption-font-size);
        margin-bottom: calc(var(--dash-base-measure) * 4);
    }
    .article-content-nav-item {
        cursor: pointer;
        list-style: none;
        padding: 0rem;
        margin: calc(var(--dash-base-measure) * 2) 0rem;
        font-size: var(--dash-body-one-font-size);
    }
    .docs-footer-container {

        grid-column: 1/4;
        grid-row: 4/5;
    }
    .docs-breadcrumbs-items {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .docs-breadcrumbs-items > a {
        width: max-content;
        flex-shrink: 0;
    }
    .docs-breadcrumbs-title {
        text-transform: capitalize;
    }
    .docs-breadcrumbs-icon-container {
        display: none;
    }
}

</style>

