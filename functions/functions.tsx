import { Moves } from "../types/types";

//Random Item from a list
export const randomItem = (pokemon: any) =>
  pokemon.results[Math.floor(Math.random() * pokemon.results.length)].name;

//Get 4 moves from list of moves
export function getMultipleRandom(arr: Moves[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}
