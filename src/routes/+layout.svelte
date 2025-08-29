<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="flex fixed w-screen h-14 bg-card border-b border-border items-center z-50">
  <div class="flex font-bold items-center">
    <h1 class="text-2xl mx-6 font-supreme">
      BREEK 
    </h1>
    <a href="/" class="rounded-md mx-4 py-1 px-3 cursor-pointer font-supreme">
      Map
    </a>
  </div>
</header>


{@render children?.()}

<footer class="fixed flex items-center w-screen justify-between bottom-0 border-t border-border h-7 gap-6 px-6 z-50">
  <div class="text-xs">Map Pangaia v1.0.0</div>
  <div class="text-xs">Last update 10 minutes ago</div>
</footer>
