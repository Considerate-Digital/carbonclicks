<script lang="ts">
    import Logo from '$lib/branding/Logo.svelte';
    import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
    import Menu from 'carbon-icons-svelte/lib/Menu.svelte';

    import OverflowMenuVertical from 'carbon-icons-svelte/lib/OverflowMenuVertical.svelte';
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    // @ts-ignore
    import {scrollto} from 'svelte-scrollto';


    let mainNavOpen = false;
       let overflowMenuOpen = false;
    function toggleOverflowMenu() {
        let overflowMenu: any = document.getElementsByClassName('header-overflow-menu-container')[0];
       if (!overflowMenu) {return};

        if (overflowMenuOpen) {
            overflowMenu.style.display = 'none';
            overflowMenuOpen = false;
        } else if (!overflowMenuOpen){
            overflowMenu.style.display = 'block';
            overflowMenuOpen = true;
            setTimeout(() => {
                if (overflowMenuOpen) {
                    toggleOverflowMenu();
                }
            }, 80000);
        }


    }
    
</script>
<div class="header-overflow-menu-container">
    </div><!--header-overflow-menu-container-->


<header class="home-header-container ">
    <div class="hide">Test text</div>
        <div class="header-top-container" >
        <div class="header-logo" >
            <a href="/">
                <Logo />
            </a>
        </div><!--header-logo-container-->
        <div class="header-navigation-main-menu-container">
                <a href="/dashboard/login">
                    Dashboard
                </a>
                <div class="header-navigation-main-menu-icon-container">
                </div><!--header-navigation-main-menu-icon-conatiner-->
        </div><!--header-navigation-main-menu-container-->

        </div><!--header-top-container-->
</header>
<style>
    .home-header-container {
        width: 100%;
        position: fixed;
        flex-direction: column;
        align-items: center;
        background: var(--grey-gradient);
        border-bottom: 1px solid var(--background-color-one);
        z-index: 100;
    }
    
    .header-overflow-menu-container {
        display:none; 
        background: var(--background-color-one);
        position: fixed;
        top: 2.45rem;
        right: 2.2rem;
        color: var(--font-color-one);
        cursor: pointer;
        z-index: 100;
    }
    :global( .header-overflow-container li:hover svg) {
        fill: var(--primary-color-one);
    }
    .header-top-container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: calc(var(--dash-base-measure) * 1) calc(var(--dash-base-measure) * 2);
    }
    .header-logo a {
        width: max-content;
        display: flex;
        align-items: center;
    }
    .header-logo a {
        justify-content: flex-start;
    }

    :global(.header-logo svg) {
        max-width: 2rem;
        height: auto;
    }
    :global(.home-header-container .header-logo svg path, .home-header-container .header-considerate-digital svg path, .home-header-container .header-overflow-menu svg, .home-header-container .header-overflow-menu svg path, .home-header-container .header-navigation-main-menu-icon-container svg path ) {
        fill: var(--font-color-one);
    }
    :global(.home-header-container ul, .home-header-container li, .header-overflow-menu-container ul, .header-overflow-menu-container li) {
        padding: 0rem;
        margin: 0rem;
        width: 100%;
    }
    :global(.home-header-container li) {
        list-style: none;
        
    }
    .header-navigation-main-menu-container {
        width: 100%;
        display: none;
        justify-content: flex-start;
        align-items: center;
        margin-left: calc(var(--dash-base-measure) *3);
        color: var(--font-color-one);
        text-transform: uppercase;
        letter-spacing: var(--pub-uppercase-letter-spacing); 
        font-weight: var(--pub-uppercase-font-weight);
        font-size: var(--pub-caption-font-size);
        cursor: pointer;
    }
    .header-navigation-main-menu-icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 0.1rem;
        margin-left: calc(var(--dash-base-measure) *2);
        opacity: 0.5;
    }
    

        :global(.header-overflow-menu > svg) {
            display: block;

        }
        
    /*tablet layout*/
    @media only screen and (min-width:32rem) {
        .header-navigation-main-menu-container {
            display: flex;
        }
        
    }
    /*laptop layout*/
    @media only screen and (min-width: 80rem) {
       
    }
</style>

