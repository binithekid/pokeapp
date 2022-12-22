import React, { useEffect, useReducer, useState } from "react";
import pokemonLogo from "../public/pokemonLogo.svg";
import Image from "next/image";
import axios from "axios";
import { FormEvent, ChangeEvent } from "../types/types";
import BattleArena from "../components/BattleArena";
import pokesong from "../assets/pokesong.wav";
import { PokemonData } from "../types/types";
import { usePokemonState } from "../hooks/getPokemonState";
import { randomItem } from "../functions/functions";

export default function Home({ pokemon }: PokemonData) {
  const [state, dispatch] = usePokemonState();

  const getRandomPokemon = () => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${randomItem(pokemon)}`)
      .then((response) => {
        dispatch({ type: "SET_SELECTED_POKEMON", payload: response.data });
        dispatch({ type: "SET_ERROR_MESSAGE", payload: false });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (event: ChangeEvent) => {
    dispatch({ type: "SET_SEARCH_TEXT", payload: event.target.value });
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    axios
      .get(
        `https://pokeapi.co/api/v2/pokemon/${state.searchText.toLowerCase()}
  `
      )
      .then((response) => {
        if (state.searchText.length > 0) {
          dispatch({ type: "SET_SELECTED_POKEMON", payload: response.data });
        } else {
          throw new Error();
        }
        dispatch({ type: "SET_ERROR_MESSAGE", payload: false });
      })
      .catch((err) => {
        console.error(err);
        dispatch({ type: "SET_ERROR_MESSAGE", payload: true });
      });
  };

  useEffect(() => {
    const oppPokemon =
      pokemon.results[Math.floor(Math.random() * pokemon.results.length)].name;
    axios
      .get(
        `https://pokeapi.co/api/v2/pokemon/${oppPokemon}
  `
      )
      .then((response) => {
        dispatch({ type: "SET_OPPOSITION", payload: response.data });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dispatch, pokemon.results]);

  const toBattleArena = () => {
    if (state.selectedPokemon) {
      dispatch({ type: "SET_START_BATTLE", payload: true });
    } else {
      dispatch({ type: "SET_ERROR_MESSAGE", payload: true });
    }
    controlAudio();
  };

  function controlAudio() {
    const audioElement: HTMLAudioElement | null =
      document.querySelector("#bg-audio");
    audioElement?.setAttribute("loop", "");
    audioElement?.play();
  }

  return (
    <div className='bg-image'>
      <audio src={pokesong} id='bg-audio' />
      {state.startBattle ? (
        <BattleArena
          pokemonLogo={pokemonLogo}
          selectedPokemon={state.selectedPokemon}
          opposition={state.opposition}
        />
      ) : (
        <div className='flex items-center justify-center h-screen flex-col'>
          <Image
            src={pokemonLogo.src}
            alt='Poke logo'
            width={400}
            height={400}
          />
          <p className='font-fugaz-one text-2xl -mt-5 mb-7'>BATTLE</p>
          <p className='font-press-start text-xs mb-1'>Enter Pokemon name:</p>
          <form className='flex flex-col' onSubmit={handleSearch}>
            <input
              type='text'
              name='search'
              value={state.searchText}
              onChange={handleChange}
              className='shadow-sm  h-8 w-56 p-1 rounded-sm focus:border-teal-500 focus:ring-teal-500 border-slate-400'
            />
            <button type='submit'>
              <p className='font-press-start text-sm mt-5 transition-ease-in-out duration-300 hover:opacity-80'>
                Search
              </p>
            </button>
          </form>
          {state.errorMessage && (
            <p className='font-press-start text-xs text-red-500 pt-2 pb-1'>
              Please enter a valid Pokemon name
            </p>
          )}
          <p className='mb-1 mt-1 font-press-start text-xs'>or</p>
          <button
            onClick={() => getRandomPokemon()}
            className='font-press-start text-sm transition-ease-in-out duration-300 hover:opacity-80'>
            Randomise
          </button>
          {state.selectedPokemon && (
            <div className='flex flex-col mt-3 p-3 justify-center items-center border-double border-4 border-indigo-600 bg-slate-300 bg-opacity-50'>
              <p className='text-center	font-press-start text-xs'>
                {state.selectedPokemon?.name}
              </p>
              {state.selectedPokemon && (
                <Image
                  src={state.selectedPokemon?.sprites?.other.home.front_default}
                  height={100}
                  width={100}
                  alt={state.selectedPokemon?.name}
                />
              )}
            </div>
          )}
          <button
            onClick={() => toBattleArena()}
            className='font-press-start text-3xl mt-5 text-red-500 transition-ease-in-out duration-300 hover:text-red-400'>
            Fight!
          </button>
        </div>
      )}
    </div>
  );
}

Home.getInitialProps = async () => {
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=500&offset=0"
  );
  const pokemon = await res.json();

  return { pokemon };
};
