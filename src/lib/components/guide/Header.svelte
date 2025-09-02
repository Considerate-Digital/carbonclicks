
<script lang="ts">
    import Logo from '$lib/branding/Logo.svelte';
    import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
    import Menu from 'carbon-icons-svelte/lib/Menu.svelte';

    import OverflowMenuVertical from 'carbon-icons-svelte/lib/OverflowMenuVertical.svelte';
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import {scrollto} from 'svelte-scrollto';


    let mainNavOpen = false;
       let overflowMenuOpen = false;
    function toggleOverflowMenu() {
        let overflowMenu = document.getElementsByClassName('header-overflow-menu-container')[0];
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
<div class="header-overflow-menu-container ">
    <nav on:click={toggleOverflowMenu}>
        <ul>
            <a href="/" class="hide">
                <li>
                    Certification
                    <span class="header-overflow-menu-item-icon">
                        <ArrowRight size={20} />
                    </span>
                </li>
            </a>

            <a href="/blog">
                <li>
                    Blog 
                    <span class="header-overflow-menu-item-icon">
                        <ArrowRight size={20} />
                    </span>
                </li>
            </a>
            <a href="/consultation">
                <li>
                    Bespoke Services
                    <span class="header-overflow-menu-item-icon">
                        <ArrowRight size={20} />
                    </span>
                </li>
            </a>
            <a href="/guide">
                <li>
                    Knowledge Guide
                    <span class="header-overflow-menu-item-icon">
                        <ArrowRight size={20} />
                    </span>
                </li>
            </a>

        </ul>
    </nav>
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
                <a href="/">
                        Certify Your Website
                </a>
                <div class="header-navigation-main-menu-icon-container">
                    <ArrowRight /> 
                </div><!--header-navigation-main-menu-icon-conatiner-->
        </div><!--header-navigation-main-menu-container-->

        <div class="header-considerate-digital show-tablet">
        </div><!--header-considerate-digital-->
        <div class="header-overflow-menu" on:click={toggleOverflowMenu}>
            <Menu size={24}/>
        </div><!--header-export-menu-->

    </div><!--header-top-container-->
</header>
<style>
    .home-header-container {
        width: 100%;
        position: fixed;
        flex-direction: column;
        align-items: center;
        background: var(--black); 
        border-bottom: 1px solid var(--grey-light);
        z-index: 100;
    }
    
    .header-overflow-menu-container {
        display:none; 
        background: var(--white-off);
        position: fixed;
        top: 2.45rem;
        right: 2.2rem;
        color: var(--black);
        cursor: pointer;
        z-index: 100;
        border-bottom: 1px solid var(--grey-light);
    }
    .header-overflow-menu-container a {
        text-decoration: none;
    }
    .header-overflow-menu-container li {
        padding: calc(var(--dash-base-measure) *1) calc(var(--dash-base-measure) *3);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .header-overflow-menu-item-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: calc(var(--dash-base-measure) *3);
    }
    .header-overflow-menu-container li:hover {
        color: var(--white);
        background: var(--purple);
    }
    :global( .header-overflow-container li:hover svg) {
        fill: var(--white);
    }
    .header-top-container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: calc(var(--dash-base-measure) * 1) calc(var(--dash-base-measure) * 2);
    }
    .header-logo a, .header-considerate-digital {
        width: max-content;
        display: flex;
        align-items: center;
    }
    .header-logo a {
        justify-content: flex-start;
    }
    .header-considerate-digital {
        justify-content: flex-end;
    }

    :global(.header-logo svg) {
        max-width: 2rem;
        height: auto;
    }
    :global(.home-header-container .header-logo svg path, .home-header-container .header-considerate-digital svg path, .home-header-container .header-overflow-menu svg, .home-header-container .header-overflow-menu svg path, .home-header-container .header-navigation-main-menu-icon-container svg path ) {
        fill: var(--white-off);
    }
    :global(.header-considerate-digital svg) {
        max-width: 4rem;
        height: auto;
    }
    :global(.home-header-container ul, .home-header-container li, .header-overflow-menu-container ul, .header-overflow-menu-container li) {
        padding: 0rem;
        margin: 0rem;
        width: 100%;
    }
    :global(.home-header-container li) {
        list-style: none;
        
    }
    .header-navigation-page-title-container {
        width: 100%;
    }
    .header-navigation-main-menu-container {
        width: 100%;
        display: none;
        justify-content: flex-start;
        align-items: center;
        margin-left: calc(var(--dash-base-measure) *3);
        color: var(--white-off);
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
    
    .header-navigation-menu-items {
        display: none;
        width: 100%;
    }


    .header-navigation-menu-items li {
        border-top: 1px solid var(--grey-light);
        width: 100%;
        padding: var(--dash-base-measure);
    }
    .header-navigation-page-sections-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-top: 1px solid var(--grey-light);
        border-bottom: 1px solid var(--grey-light);
    }
    :global(.header-navigation-page-sections-container ul) {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

    }
    :global(.header-navigation-page-sections-container li) {
        margin: var(--dash-base-measure);
        font-size: var(--pub-caption-two-font-size);
        cursor:pointer;
    }
    .header-navigation-page-sections {
        padding: 0.2rem 0.4rem;
    }
    .header-navigation-tool a, .header-navigation-page-title {
        text-transform: uppercase;
        font-size: 0.825rem;
        font-family: bodyFont;
        width: 100%;
        text-align: center;
        display: block;
        cursor: pointer;
    }
    :global(.home-header-container a:hover, .header-navigation-page-title-container:hover .header-navigation-page-title, .header-navigation-page-sections-container li:hover) {
        color: var(--green);
    }
    :global(.header-navigation-page-sections a) {
        font-size: 0.825rem;
        padding: 0rem var(--dash-base-measure);
    }
:global(.header-considerate-digital > svg) {
            display: block;
        }
        :global(.header-overflow-menu > svg) {
            display: block;

        }
        
     .header-overflow-menu {
         padding-top: 0.01rem; 
            cursor: pointer;
            height: min-content;
        }

    /*tablet layout*/
    @media only screen and (min-width:32rem) {
        .header-considerate-digital {
            padding-right: 26%;
            width: 7rem;
            display: block;
            height: min-content;
        }
        .header-navigation-main-menu-container {
            display: flex;
        }
        
        .header-overflow-menu {
            padding-right: calc(var(--dash-base-measure) *4);
        }
        .header-navigation-page-sections-container {
            justify-content: flex-start;
            padding-left: calc(var(--dash-base-measure) * 23);
            padding-top: calc(var(--dash-base-measure) * 1);
            padding-bottom: calc(var(--dash-base-measure) * 1);
        }
    }
    /*laptop layout*/
    @media only screen and (min-width: 80rem) {
         .header-navigation-menu-items {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .header-navigation-menu-items li {
            border: none;
            width: max-content;
            padding-top: 0.1rem;
            padding-bottom: 0rem;
        }
       
    }
</style>
