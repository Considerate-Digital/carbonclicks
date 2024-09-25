<script lang="ts">
	import UserAvatarFilled from "carbon-icons-svelte/lib/UserAvatarFilled.svelte";
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import { page } from "$app/stores";

	let demo_text = "";
	if ($page) {
          const demo = $page.url.searchParams.get("demo") ?? undefined;
          if (demo) {
						demo_text = "?demo=true";
					} else {
						demo_text = ""
						}
	}
</script>
	<div class="hide">Text for component testing</div>
<div class="top-menu-icon-container">
	<a href="/dashboard/account{demo_text}">
		<div class="icon" >
			<UserAvatarFilled size={32} />
			<Tooltip 
				tip={"Settings"}
				bottom={true}
			/>
		</div>
	</a>
</div>

<style>
	.top-menu-icon-container {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 0em 2em;
	}
	.icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 0em 0.5em;
		cursor: pointer;
	}
	:global(.top-menu-icon-container > .icon > svg ) {
		fill: var(--background-color-two);
	}
	:global(.icon > svg:hover){
		fill: var(--primary-color-one-light);
	}
	:global(.icon:active > svg) {
		fill: var(--font-color-one);
	}
</style>
