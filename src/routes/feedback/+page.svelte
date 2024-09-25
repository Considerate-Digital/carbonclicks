<script lang=ts>
    import {onMount} from 'svelte';
    import {page} from '$app/stores';
    import {goto} from '$app/navigation';
    import LogoAnimated from '$lib/branding/LogoAnimated.svelte';
    let title: string = 'Hello';
    let subTitle: string = 'You found us';
    onMount(() => {
        if ($page.url.searchParams.get('title') && $page.url.searchParams.get('title') != '') {
            title = $page.url.searchParams.get('title') ?? "";
            subTitle = $page.url.searchParams.get('sub') ?? "";
        }
    });
    function gotoHome () {
        goto('/');
    }
</script>

<header class=header>
    <a href="/">
			<div class=logo-box >
            <div class=logo-container>
							<LogoAnimated />
            </div>
        </div>
    </a>
</header>


<section class=feedback-container>
    <div class=feedback-center-container>
        <div class=feedback-logo-container>
            <LogoAnimated  />
        </div>
        <h2 class=feedback-title>{title}</h2>
        <h3 class=feedback-subtitle>{subTitle}</h3>
        <button type="button" on:click={gotoHome}>Home</button>
    </div>
</section>


<style>
    
   .header {
    width: 100%;
    height: auto;
		background-color: var(--black);
	}
	.logo-box {
			height: 100%;
			background-color: var(--black);
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 2.4rem;
			padding-bottom: calc(var(--dash-base-measure) *3);
			padding-left: calc(var(--dash-base-measure) *3);
			width: var(--dash-standard-measure);
			flex-shrink: 0;
			cursor: pointer;
		}
.feedback-container {
        height: calc(100vh - 6.8rem);
        width: 100vw;
        min-height: 40rem;
        max-width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .feedback-center-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: calc(var(--dash-base-measure) *2);
        max-width: 24rem;
        text-align: center;
    }
    .feedback-title {
        font-family: bodyFont, sans-serif;
        font-size: var(--pub-title-sans-font-size);
        margin: calc(var(--dash-base-measure) *4) 0rem calc(var(--dash-base-measure) *2) 0rem;
    }
    .feedback-subtitle {
        font-family: bodyFont;
        font-size: var(--pub-body-font-size);
        line-height: 1.25;
        margin: calc(var(--dash-base-measure) *4) 0rem calc(var(--dash-base-measure) *2) 0rem;
    }
    .feedback-logo-container {
        max-width: 20%;
    }
    @media only screen and (min-width:80rem) {
        .header {
            display: none;
        }
        .feedback-container {
            height: 100vh
        }
        .feedback-subtitle { 
            margin: calc(var(--dash-base-measure) *2) 0rem calc(var(--dash-base-measure) *2) 0rem;
        }
    }
</style>
