<script lang="ts">
    import { calculateDotColor } from "$lib/utils/calculateDotColor";
    export let PC = 0;
</script>

<section class="score-container">
    <div class="score"
         style="
            color: {calculateDotColor((100-PC))}
            "
        >
        {PC.toFixed(0)}<span class="score-unit">/100</span>
    </div>
    <h3 class="score-title">
        Efficiency Score
    </h3>
    <p class="score-info">
        Find out how to improve your score using <a href="/guide" target="_blank">our resources</a>.
    </p>

</section>

<style>
    .score-container {
        text-align: center;
        margin: calc(var(--base-measure) * 12) 0rem;
    }
    .score-title {
        font-size: var(--pub-title-sans-font-size);
    }
    .score {
        font-size: 12rem;
        line-height: 1;
    }
    .score-unit {
        color: var(--font-color-one);
    }

</style>
