<script lang="ts">
  import LogoAnimated from '$lib/branding/LogoAnimated.svelte';
  export let message = "message"; 
</script>


<section class="loader-container">
  <h6 class="loader-message">{message}</h6>
  <div class="loader-sizer">
    <LogoAnimated />
  </div><!--loader-sizer-->

</section><!--loader-container-->


<style>
  .loader-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .loader-sizer {
    width: 6rem;
    height: auto;
  }
  .loader-message {
    margin-bottom: 2rem;
  }
    

</style>
