import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const response = await fetch('http://168.231.85.107:3001/teams');
    const teams = await response.json();
    
    return {
      teams
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes:', error);
    return {
      teams: []
    };
  }
};
