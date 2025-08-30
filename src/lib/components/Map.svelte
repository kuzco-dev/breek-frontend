<script lang="ts">
  // Interface pour typer les données des équipes

  import { X } from "$lib"
  import { onMount } from "svelte";
  
  interface Team {
    id: string;
    team_name: string;
    twitter: string;
    name: string;
    description: string;
    size: number;
    coord_x: number;
    coord_y: number;
    image_url: string;
  }

  // Props pour recevoir les équipes depuis le parent
  interface Props {
    teams: Team[];
  }
  
  let { teams }: Props = $props();
  
  let scale = $state(1);    
  let offsetX = $state(0);   
  let offsetY = $state(0);   
  let containerSize = $state(900);
  let contentSize = $state(900);
  let isDragging = $state(false);
  let startX = $state<any>(0);
  let startY = $state<any>(0);
  let mapContainer: HTMLElement;

  // Fonction pour calculer la taille de la carte basée sur l'écran
  function calculateMapSize(): number {
    if (typeof window === 'undefined') return 900;
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Utiliser la plus petite dimension pour s'assurer que la carte tient
    const maxSize = Math.min(screenWidth * 0.8, screenHeight * 0.7);
    
    // Appliquer les limites min/max
    return Math.max(200, Math.min(900, maxSize));
  }

  // Fonction pour mettre à jour la taille de la carte
  function updateMapSize(): void {
    const newSize = calculateMapSize();
    containerSize = newSize;
    contentSize = newSize;
    
    // Réinitialiser les offsets pour centrer la carte
    offsetX = 0;
    offsetY = 0;
    scale = 1;
  }

  // Écouter les changements de taille d'écran
  onMount(() => {
    updateMapSize();
    
    const handleResize = () => {
      updateMapSize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  function onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    let newScale = clamp(scale + delta, 1, 3);
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;
    offsetX = clamp(offsetX - (mx * (newScale - scale)), containerSize - contentSize*newScale, 0);
    offsetY = clamp(offsetY - (my * (newScale - scale)), containerSize - contentSize*newScale, 0);
    scale = newScale;
  }

  function startDrag(event: MouseEvent) {
    isDragging = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
  }

  function drag(event: MouseEvent) {
    if (isDragging) {
      const newX = event.clientX - startX;
      const newY = event.clientY - startY;
      offsetX = clamp(newX, containerSize - contentSize*scale, 0);
      offsetY = clamp(newY, containerSize - contentSize*scale, 0);
    }
  }

  function stopDrag() {
    isDragging = false;
  }

  // Exemple de délimitation logique (zone rectangulaire avec quelques détours)
  const boundaryPoints = [
    {x: 12, y: 0}, {x: 12, y: 2}, {x: 9, y: 2}, {x: 9, y: 3}, {x: 10, y: 3}, {x: 10, y: 4}, {x: 14, y: 4}, 
    {x: 14, y: 8}, {x: 7, y: 8}, {x: 7, y: 10}, {x: 8, y: 10},{x: 8, y: 11},{x: 8, y: 12}, {x: 9, y: 12},
    {x: 9, y: 16}, {x: 6, y: 16}, {x: 6, y: 19}, {x: 5, y: 19}, {x: 5, y: 18}, {x: 3, y: 18}, {x: 3, y: 21},
    {x: 0, y: 21}, {x: 0, y: 0}, {x: 12, y: 0},
  ];

  const GRID_SIZE = 30; // Nombre de carrés dans la grille
  const CELL_SIZE = $derived(containerSize / GRID_SIZE); // Taille d'un carré en pixels
  const BORDER_SIZE = 1; // Taille de la bordure en pixels

  function getMapImageProps(x: number, y: number, size: number) {
    const pixelX = x * CELL_SIZE;
    const pixelY = y * CELL_SIZE;
    const pixelWidth = size * CELL_SIZE;
    const pixelHeight = size * CELL_SIZE;
    const imageX = pixelX + BORDER_SIZE;
    const imageY = pixelY + BORDER_SIZE;
    const imageWidth = pixelWidth - (BORDER_SIZE * 2);
    const imageHeight = pixelHeight - (BORDER_SIZE * 2);
    
    return {
      pixelX, pixelY, pixelWidth, pixelHeight,
      imageX, imageY, imageWidth, imageHeight
    };
  }

  let hoveredTeams = $state<Set<string>>(new Set());

  function handleMapImageMouseOver(teamId: string) {
    hoveredTeams.add(teamId);
    hoveredTeams = new Set(hoveredTeams); // Trigger reactivity in Svelte 5
  }

  function handleMapImageMouseOut(teamId: string) {
    hoveredTeams.delete(teamId);
    hoveredTeams = new Set(hoveredTeams); // Trigger reactivity in Svelte 5
  }

  const strokeClass = "stroke-border";
  const strokeWidth = 2;

  const pixelPoints = $derived(boundaryPoints.map(point => ({
    x: point.x * CELL_SIZE,
    y: point.y * CELL_SIZE
  })));

  const pathData = $derived(pixelPoints.map((point, index) => {
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ') + ' Z');

  let showDiscoverTeam = $state(false);

  function handleDiscoverTeam(teamId: string){
    showDiscoverTeam = true;
    console.log(teamId);
  }


</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  bind:this={mapContainer}
  class="relative" 
  style="width: {containerSize}px; height: {containerSize}px;"
  onwheel={onWheel} 
  onmousedown={startDrag} 
  onmousemove={drag}
  onmouseup={stopDrag}
  onmouseleave={stopDrag}
>
  <svg style="width: {containerSize}px; height: {containerSize}px;">
    <g transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}>
      {#each Array(31) as _, i}
        <line 
          x1="0" 
          y1={i * (containerSize / 30)} 
          x2={containerSize} 
          y2={i * (containerSize / 30)} 
          class="stroke-border" 
          stroke-width="1"
        />
      {/each}

      {#each Array(31) as _, i}
        <line 
          x1={i * (containerSize / 30)} 
          y1="0" 
          x2={i * (containerSize / 30)} 
          y2={containerSize} 
          class="stroke-border" 
          stroke-width="1"
        />
      {/each}
      
      <path 
        d={pathData}
        
        fill="#00e686"
        opacity="0.02"
      />

      {#each teams as team}
        {@const props = getMapImageProps(team.coord_x, team.coord_y, team.size)}
        {@const isHovered = hoveredTeams.has(team.id)}
        <rect 
          x={props.pixelX} 
          y={props.pixelY} 
          width={props.pixelWidth} 
          height={props.pixelHeight} 
          fill="rgba(0, 0, 0, 0.1)" 
          stroke="rgba(255, 255, 255, 0.3)" 
          stroke-width={isHovered ? 4 : BORDER_SIZE}
          rx="2"
          ry="2"
          style="transition: stroke-width 0.3s ease-in-out;"
        />
        
        <image 
          href={'/teams/' + (team.image_url || '')} 
          x={props.imageX} 
          y={props.imageY} 
          width={props.imageWidth} 
          height={props.imageHeight} 
          preserveAspectRatio="xMidYMid slice"
          onmouseover={() => handleMapImageMouseOver(team.id)}
          onmouseout={() => handleMapImageMouseOut(team.id)}
          onclick={() => handleDiscoverTeam(team.id)}
          class="cursor-pointer"
        />
      {/each}
      
      <path 
        d={pathData}
        class="stroke-foreground"
        stroke-width={strokeWidth}
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.9"
      />
    
    </g>
  </svg>
</div>

{#if showDiscoverTeam}
	<div class="fixed right-4 top-22 flex flex-col justify-around h-60 bg-card border border-border p-4  w-100 z-[49]">
    <div class="flex justify-between">
      <div class="flex">
        image ici
        <h1 class="text-2xl">Karmine Corp</h1>
      </div>
      <button onclick={() => { showDiscoverTeam = false; }} class="cursor-pointer"><X /></button>
    </div>
    <div class="border border-b border-border my-4">
    </div>
    <div class="flex gap-3 justify-around">
      <div class="flex flex-col items-center">
        <div class="text-sm text-muted-foreground">Total fans</div>
        <div class="font-semibold text-lg">2 302</div>
      </div>
      <div class="flex flex-col items-center">
        <div class="text-sm text-muted-foreground">Globals stats</div>
        <div class="font-semibold text-lg">23 243</div>
      </div>
    </div>
    <div class="border border-b border-border my-4"></div>
    <a href="/karminecorp" type="submit" class="text-center bg-green-400 p-2 rounded-lg w-full cursor-pointer hover:bg-primary/90 transition-colors duration-200">Discover</a>
  </div>
{/if}