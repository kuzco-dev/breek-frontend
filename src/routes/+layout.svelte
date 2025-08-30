<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { PulseEffect, NoAuthHeader } from '$lib';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="flex fixed w-screen h-14 bg-card border-b justify-between border-border items-center z-50 px-4">

  <div class="flex items-center">
    <a href="/" class="rounded-md py-1 px-3 cursor-pointer transition-colors duration-200 hover:bg-secondary">
      Discover the map
    </a>
  </div>
  <div class="flex items-center">
    <svg class="w-full h-8" viewBox="0 0 63 92" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 91.6284L63 75.9963V10.9963L27.9448 19.6945V0L10 5.54098V61.3815L27.9448 56.1142V40.3406L43.0552 36.5912V61.3815L0 72.0648V91.6284Z" class="fill-primary"/>
    </svg>
  </div>
  
  <NoAuthHeader />
</header>


{@render children?.()}

<footer class="fixed flex items-center w-screen bg-card justify-between bottom-0 border-t border-border h-7 gap-6 px-6 z-50">
  <div class="text-xs text-muted-foreground">Map v1.0</div>
  <div class="flex items-center gap-2">
    <PulseEffect size={10} duration={4} />
    <div class="text-xs text-muted-foreground">Last update 10 minutes ago</div>
  </div>
</footer>
