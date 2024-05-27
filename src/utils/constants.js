export const GRID = {
  ROW: {
    query: 'rows',
    min: 1,
    max: 15,
    default_num: 10,
  },
  COL: {
    query: 'cols',
    min: 1,
    max: 15,
    default_num: 10,
  },
};

export const ENTITY = {
  POKEMON: {
    type: 'POKEMON',
  },
  TRAINER: {
    type: 'TRAINER',
    query: 'trainers',
    min: 1,
    max: 10,
    default_num: 7,
  },
  LAND: {
    type: 'LAND',
  },
  POKEBALL: {
    type: 'POKEBALL',
  },
};

export const POKEMON = [
  { id: '1', name: 'Bulbasaur', entityType: ENTITY.POKEMON.type },
  { id: '2', name: 'Charmander', entityType: ENTITY.POKEMON.type },
  { id: '3', name: 'Squirtle', entityType: ENTITY.POKEMON.type },
  { id: '4', name: 'Pikachu', entityType: ENTITY.POKEMON.type },
  { id: '5', name: 'Jigglypuff', entityType: ENTITY.POKEMON.type },
  { id: '6', name: 'Meowth', entityType: ENTITY.POKEMON.type },
  { id: '7', name: 'Psyduck', entityType: ENTITY.POKEMON.type },
  { id: '8', name: 'Snorlax', entityType: ENTITY.POKEMON.type },
  { id: '9', name: 'Mewtwo', entityType: ENTITY.POKEMON.type },
  { id: '10', name: 'Mew', entityType: ENTITY.POKEMON.type },
];

export const TRAINERS = [
  { id: '1', name: 'Ash', entityType: ENTITY.TRAINER.type },
  { id: '2', name: 'Misty', entityType: ENTITY.TRAINER.type },
  { id: '3', name: 'Brock', entityType: ENTITY.TRAINER.type },
  { id: '4', name: 'Gary', entityType: ENTITY.TRAINER.type },
  { id: '5', name: 'Jessie', entityType: ENTITY.TRAINER.type },
  { id: '6', name: 'James', entityType: ENTITY.TRAINER.type },
  { id: '7', name: 'Professor Elm', entityType: ENTITY.TRAINER.type },
  { id: '8', name: 'Professor Oak', entityType: ENTITY.TRAINER.type },
  { id: '9', name: 'Nurse Joy', entityType: ENTITY.TRAINER.type },
  { id: '10', name: 'Officer Jenny', entityType: ENTITY.TRAINER.type },
];

export const POKEBALLS = [
  {
    id: '1',
    name: 'Pokeball',
    entityType: ENTITY.POKEBALL.type,
    speed: 1,
    rarity: 50,
  },
  {
    id: '2',
    name: 'Greatball',
    entityType: ENTITY.POKEBALL.type,
    speed: 2,
    rarity: 25,
  },
  {
    id: '3',
    name: 'Ultraball',
    entityType: ENTITY.POKEBALL.type,
    speed: 3,
    rarity: 15,
  },
  {
    id: '4',
    name: 'Masterball',
    entityType: ENTITY.POKEBALL.type,
    speed: 4,
    rarity: 10,
  },
];
