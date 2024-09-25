<script>
    import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
</script>
<nav>
    <section class=" docs-menu-section">
        <h4 class="docs-menu-section-title">
            Guides
        </h4>
        <ul>
            <a data-sveltekit-reload class="docs-menuItem-title"  href="/guide/fonts"  >
                <li class="docs-menu-section-menuItem-container">
                       Fonts 
                </li><!--docs-menu-section-menuItem-container"-->
            </a>
            <a data-sveltekit-reload class="docs-menuItem-title"  href="/guide/images"  >
                <li class="docs-menu-section-menuItem-container">
                       Images
                </li><!--docs-menu-section-menuItem-container"-->
            </a>
            <a data-sveltekit-reload class="docs-menuItem-title"  href="/guide/cache"  >
                <li class="docs-menu-section-menuItem-container">
                       Cache
                </li><!--docs-menu-section-menuItem-container"-->
            </a>
            <a data-sveltekit-reload class="docs-menuItem-title"  href="/guide/hosting"  >
                <li class="docs-menu-section-menuItem-container">
                       Hosting
                </li><!--docs-menu-section-menuItem-container"-->
            </a>
            <a data-sveltekit-reload class="docs-menuItem-title"  href="/guide/videos">
                <li class="docs-menu-section-menuItem-container">
                       Videos
                </li><!--docs-menu-section-menuItem-container"-->
            </a>
        </ul>
    </section><!--docs-menu-section-->
    <section class=" docs-menu-section">
        <h4 class="docs-menu-section-title">
            Tools
        </h4>
        <ul>
            <!--coming soon-->
            <a data-sveltekit-reload class="hide docs-menuItem-title"  href="/guide/certification"  >
                <li class="docs-menu-section-menuItem-container">
                    Certification
                </li><!--docs-menu-section-menuItem-container"-->
            </a>
            <a data-sveltekit-reload class="docs-menuItem-title"  href="/guide/carbon-clicks"  >
                <li class="docs-menu-section-menuItem-container">
                       CarbonClicks
                </li><!--docs-menu-section-menuItem-container"-->
            </a>
            <div class="docs-menuItem-subMenu-container">
                            <ul>
                                <a data-sveltekit-reload class="docs-subMenu-title" href="/guide/how-does-carbon-clicks-work">
                                    <li class="docs-subMenu-container">
                                        <ChevronRight size={16} />
                                        How does it work?
                                    </li>
                                </a>
                                <a data-sveltekit-reload class="docs-subMenu-title" href="/guide/how-to-install-carbon-clicks">
                                    <li class="docs-subMenu-container">
                                        <ChevronRight size={16} />
                                        How to install it?
                                    </li>
                                </a>

                            </ul>
                        </div><!--docs-menuItem-subMenu-container-->
        </ul>
    </section><!--docs-menu-section-->
    <section class=" docs-menu-section hide">
        <h4 class="docs-menu-section-title">
            FAQs
        </h4>
        <ul>
            <a data-sveltekit-reload class="docs-menuItem-title"  href="/guide/url-error"  >
                <li class="docs-menu-section-menuItem-container">
                    URL Error
                </li><!--docs-menu-section-menuItem-container"-->
            </a>
        </ul>
    </section><!--docs-menu-section-->

</nav>
<style>
    .docs-menu-section ul, .docs-menu-section li {
        list-style: none;
        padding: 0rem;
    }
    .docs-menu-section {
        margin-top: calc(var(--dash-base-measure) * 4);
    }
    .docs-menu-section-title {
        font-family: bodyFont, sans;
        font-size: var(--pub-caption-font-size);
        text-transform: uppercase;
        margin-bottom: calc(var(--dash-base-measure) * 2);
    }
    .docs-menu-section-menuItem-container {
        margin: calc(var(--dash-base-measure) *2) 0rem;
    }
    .docs-subMenu-container {
        display: flex;
        align-items: center;
    }
    :global(.docs-subMenu-container svg) {
        margin-right: var(--base-measure);
    }
</style>
