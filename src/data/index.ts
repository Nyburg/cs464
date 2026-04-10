import oregonPop from '../../sample_data/oregon_pop.json';
import birds from '../../sample_data/bird_pop.json';
import fish from '../../sample_data/fish.json';
import planets from '../../sample_data/planets.json';
import presidents from '../../sample_data/presidents.json';
import consoles from '../../sample_data/console.json';
import retroGames from '../../sample_data/retroGames.json';
import sellingGames from '../../sample_data/selling_games.json';
import moonMissions from '../../sample_data/moonmissions.json';
import mtg from '../../sample_data/mtg.json';
import countries from '../../sample_data/countries_area.json';
import roundabouts from '../../sample_data/roundabout_cities.json';
import starsRaw from '../../sample_data/stars.json';
import bhLegendsRaw from '../../sample_data/bhlegends.json';
import dQuest from '../../sample_data/dquest.json';

const stars = { ...starsRaw, items: starsRaw.stars };
const bhLegends = { ...bhLegendsRaw, items: bhLegendsRaw.legends };

export const datasets = [
  { label: 'Oregon Cities by Population', data: { ...oregonPop } },
  { label: 'Bird Populations', data: { ...birds } },
  { label: 'Fish by Length (Central Oregon)', data: { ...fish } },
  { label: 'Planets by Distance from Sun', data: { ...planets } },
  { label: 'US Presidents', data: { ...presidents } },
  { label: 'Game Consoles by Release Year', data: { ...consoles } },
  { label: 'Retro Video Games', data: { ...retroGames } },
  { label: 'Highest Selling Games', data: { ...sellingGames } },
  { label: 'Moon Missions', data: { ...moonMissions } },
  { label: 'Magic: The Gathering Sets', data: { ...mtg } },
  { label: '20 Largest Countries by Area', data: { ...countries } },
  { label: 'Cities by Most Roundabouts', data: { ...roundabouts } },
  { label: 'Stars by Distance from Sun', data: { ...stars } },
  { label: 'Brawlhalla Legends', data: { ...bhLegends } },
  { label: 'Dragon Quest Chronology', data: { ...dQuest } },
];