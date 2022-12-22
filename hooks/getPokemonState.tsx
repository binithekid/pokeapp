import { useReducer } from "react";
import { Pokemon, Moves } from "../types/types";

type State = {
  selectedPokemon: Pokemon | null;
  searchText: string;
  errorMessage: boolean;
  opposition: Pokemon | null;
  startBattle: boolean;
  playerHP: number;
  opponentHP: number;
  playerMoves: Moves[];
  oppositionMoves: Moves[];
};

type Action =
  | { type: "SET_SELECTED_POKEMON"; payload: Pokemon }
  | { type: "SET_SEARCH_TEXT"; payload: string }
  | { type: "SET_ERROR_MESSAGE"; payload: boolean }
  | { type: "SET_OPPOSITION"; payload: Pokemon }
  | { type: "SET_START_BATTLE"; payload: boolean }
  | { type: "SET_PLAYER_HP"; payload: number }
  | { type: "SET_OPPONENT_HP"; payload: number }
  | { type: "SET_PLAYER_MOVES"; payload: Moves[] }
  | { type: "SET_OPPOSITION_MOVES"; payload: Moves[] };

const initialState: State = {
  selectedPokemon: null,
  searchText: "",
  errorMessage: false,
  opposition: null,
  startBattle: false,
  playerHP: 500,
  opponentHP: 500,
  playerMoves: [],
  oppositionMoves: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SELECTED_POKEMON":
      return { ...state, selectedPokemon: action.payload };
    case "SET_SEARCH_TEXT":
      return { ...state, searchText: action.payload };
    case "SET_ERROR_MESSAGE":
      return { ...state, errorMessage: action.payload };
    case "SET_OPPOSITION":
      return { ...state, opposition: action.payload };
    case "SET_START_BATTLE":
      return { ...state, startBattle: action.payload };
    case "SET_PLAYER_HP":
      return { ...state, playerHP: action.payload };
    case "SET_OPPONENT_HP":
      return { ...state, opponentHP: action.payload };
    case "SET_PLAYER_MOVES":
      return { ...state, playerMoves: action.payload };
    case "SET_OPPOSITION_MOVES":
      return { ...state, oppositionMoves: action.payload };
    default:
      return state;
  }
};

export const usePokemonState = () => {
  return useReducer(reducer, initialState);
};
