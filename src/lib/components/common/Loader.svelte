<script lang="ts">
  import LogoAnimated from '$lib/branding/LogoAnimated.svelte';
  
  export let text = "";
</script>


<section class="loader-container">
  <div class="loader-wrapper">
  <div class="loader-sizer">
    <LogoAnimated />
  </div><!--loader-sizer-->
   <p class="loader-text">{text}</p> 
 </div><!--loader-wrapper-->

</section><!--loader-container-->


<style>
  .loader-container {
    height: 100%;
    min-height: inherit;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loader-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .loader-text {
    margin-top: calc(var(--base-measure) * 2);
  }

  .loader-sizer {
    width: 6rem;
    height: auto;
  }
    

</style>
