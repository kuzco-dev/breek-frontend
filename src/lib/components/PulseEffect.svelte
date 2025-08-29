<script lang="ts">
  export let size: number = 60; // Taille en pixels
  export let duration: number = 2; // Durée de l'animation en secondes
</script>

<div class="pulse-container" style="width: {size}px; height: {size}px;">
  <div class="pulse-circle pulse-1" style="animation-duration: {duration}s;"></div>
  <div class="pulse-circle pulse-2" style="animation-duration: {duration}s;"></div>
</div>

<style>
  .pulse-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-circle {
    position: absolute;
    border-radius: 50%;
    animation: pulse infinite ease-in-out;
  }

  .pulse-1 {
    width: 100%;
    height: 100%;
    background: #00FF41; /* Vert néon vif */
    opacity: 0.9;
    animation-delay: 0s;
    box-shadow: 0 0 1px #00FF41;
  }

  .pulse-2 {
    width: 140%;
    height: 140%;
    background: #39FF14; /* Vert néon moyen */
    opacity: 0.6;
    animation-delay: 0.3s;
    box-shadow: 0 0 5px #39FF14;
  }

  

  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.4;
    }
    100% {
      transform: scale(0.8);
      opacity: 0.8;
    }
  }
</style>
