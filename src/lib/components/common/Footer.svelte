<script lang="ts">
</script>

<footer>
    <div class="hide">Test text</div>
    <div class="footer-container">
        <div class="footer-menu-container">
            <ul>
                <li>
                    <a href="/guide/analytics">
                        About
                    </a>
                </li>

                <li>
                    <a href="https://considerate.digital/terms" target="_blank">
                        Privacy & Terms
                    </a>
                </li>
            </ul>
        </div><!--footer-menu-container-->
        
    </div><!--footer-container-->
    <section class="footer-rights-container">
        <div class="footer-rights">
            All Rights Reserved &mdash; Considerate Digital {new Date().getFullYear()}
        </div><!--footer-rights-->
    </section><!--footer-rights-container-->

</footer>

<style>
    .footer-container {
        background: var(--background-color-one);
        color: var(--black);
        padding: var(--dash-standard-measure) 1rem 2rem 1rem;
        /*
        border-top: 1px solid var(--primary-color-one);
        border-bottom: 1px solid var(--primary-color-one);
        */
    }
    ul {padding: 0rem}
    li {
        list-style: none;
        padding: 0rem;
    }
    :global(.footer-container .button--invert) {
        background-color: var(--black);
        border-color: var(--white);
        color: var(--white);
    }
    :global(.footer-container .button--invert:hover) {
        background-color: var(--white);
        border-color: var(--blac);
        color: var(--black);
    }
    :global(.footer-considerate-digital-logo-container svg) {
        width: 5.4rem;
        height: auto;
    }
    :global(.footer-container .footer-considerate-digital-logo-container svg path ) {
        fill: var(--white);
    }

    .footer-rights-container {
        padding: 0.4rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }
    .footer-rights {
        font-size: 0.8rem;
    }
    :global(.footer-container input, .footer-container textarea) {
        background-color: var(--black);
        color: var(--white);
        border-bottom: 1px solid var(--grey-medium);
    }
    :global(.footer-container .button) {
        max-width: 24rem; 
    }

    @media only screen and (min-width:80rem) {
        .footer-container {
            display: grid;
            grid-template-columns: 30% 70%;
            grid-template-rows: auto;
            padding-top: 3rem;
        }
        .footer-menu-container {
            grid-column: 1/2;
            grid-row: 2/3;
            padding-left: calc(var(--dash-base-measure) * 3);
        }
        
    }
</style>
