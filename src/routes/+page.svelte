<script lang="ts">
  import { Map } from "$lib";
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<main class="h-screen w-screen pt-14 pb-7">
  <div class="flex justify-center items-center h-full w-full p-4">
    <div class="flex justify-center items-center w-full h-full max-w-[900px] max-h-[900px] min-w-[200px] min-h-[200px]">
      <Map teams={data.teams} />
    </div>
  </div>
</main>