<script lang="ts">
    import Markdoc from '@markdoc/markdoc';
    import OpenPanelLeft from 'carbon-icons-svelte/lib/OpenPanelLeft.svelte';
    import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
    import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
    import { onMount } from "svelte";
    import Loader from "$lib/components/common/Loader.svelte";

    export let data

    let html;
    let guide;

    onMount( () => {
        guide = data?.guide;
        const parsed = Markdoc.parse(guide.text);
        const content = Markdoc.transform(parsed /* config*/);      //config stage possible
        html = Markdoc.renderers.html(content);
    });

    function reading_time(html) {
        let text_length = html.split(" ");
        return ((text_length.length / 200) + 1).toFixed(0) 
    }


</script>

{#if html && guide}
<section class="blog-guide-container">
    <h2 class="title">
        {guide.title}
    </h2>
    <div class="date">
        {guide.date}&nbsp;&nbsp;&nbsp;{reading_time(html)} minute read
    </div>
    <div class="content"> 
        {@html html}
    </div>
</section>
{:else}
    <section class="blog-loader-container">
        <Loader />
    </section>
{/if}
<slot />



<style>
    .blog-guide-container {
        display: block;
        padding: calc(var(--base-measure) * 10) calc(var(--base-measure) * 2);
        height: auto;
        min-height: 100vh;
        margin: auto;
    }
    .title {
        font-family: headerFont, serif;
        font-weight: 300;
        font-size: var(--pub-mobile-title-serif-font-size);
        line-height: var(--pub-mobile-title-serif-line-height);
        margin: calc(var(--dash-base-measure) *1) 0rem calc(var(--dash-base-measure) *5) 0rem;
        max-width: 40rem;
    }
    .date {
        font-size: var(--pub-label-font-size);
        border-bottom: 1px solid var(--grey-ultra-light);
        margin-bottom: calc(var(--base-measure) * 4);
    }
    
    .blog-loader-container {
        height: 100vh;
        min-height: 50rem;
    }
    :global(.blog-guide-container img) {
        max-width: 100%;
    }

    @media only screen and (min-width:32rem) {
        .title {
            padding-left: calc(var(--base-measure) *2);
            margin-bottom: calc(var(--base-measure) * 20);
            margin-top: calc(var(--base-measure) * 3);
        }
        .content, .date {
            max-width: 39rem;
            margin-right: auto;
            margin-left: auto;
        }
    }

    @media only screen and (min-width:80rem) {
        .blog-guide-container {
            padding: calc(var(--base-measure) * 10) calc(var(--base-measure) * 10);
        }
        .title {
            max-width: 60rem;
            font-size: var(--pub-super-title-font-size);
            line-height: var(--pub-super-title-line-height);
        }
        .content, .date {
            margin-right: auto;
            margin-left: auto;
        }
        .date {
        }
    }

</style>
