<script lang="ts">
  import { Map } from "$lib";
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<main class="h-screen w-screen pt-14 pb-7">
 
  <div class="flex justify-center items-center pt-10">
    <Map teams={data.teams} />
  </div>
</main>