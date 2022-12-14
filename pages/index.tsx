import React, { useState } from "react";
import background from "../public/background.png";
import pokemonLogo from "../public/pokemonLogo.svg";
import Image from "next/image";
import axios from "axios";

export default function Home({ pokemon }: any) {
  const [randomise, setRandomise] = useState({});
  const [showPokemon, setShowPokemon] = useState(false);

  const randomPokemon =
    pokemon.results[Math.floor(Math.random() * pokemon.results.length)].name;

  const PokeFetch = (randomPokemon: string) => {
    axios
      .get(
        `https://pokeapi.co/api/v2/pokemon/${randomPokemon}
`
      )
      .then((response) => {
        setRandomise(response.data);
        setShowPokemon(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className='bg-no-repeat bg-center bg-cover h-screen w-screen'
      style={{ backgroundImage: `url(${background.src})` }}>
      <div className='flex items-center justify-center h-screen flex-col'>
        <Image src={pokemonLogo.src} alt='Poke logo' width={400} height={400} />
        <p className='font-fugaz-one text-2xl -mt-5 mb-7'>BATTLE</p>
        <p className='font-press-start text-xs mb-1'>Enter Pokemon name:</p>
        <form className='flex flex-col'>
          <input className='shadow-sm  h-8 w-56 p-1 rounded-sm focus:border-teal-500 focus:ring-teal-500 border-slate-400' />
          <button>
            <p className='font-press-start text-sm mt-5 transition-ease-in-out duration-300 hover:opacity-80'>
              Search
            </p>
          </button>
        </form>
        <p className='mb-1 mt-1 font-press-start text-xs'>or</p>
        <button
          onClick={() => PokeFetch(randomPokemon)}
          className='font-press-start text-sm transition-ease-in-out duration-300 hover:opacity-80'>
          Randomise
        </button>
        {showPokemon && (
          <div className='flex flex-col mt-3 p-3 justify-center items-center border-double border-4 border-indigo-600 bg-slate-300 bg-opacity-50'>
            <p className='text-center	font-press-start text-xs'>
              {randomise.name}
            </p>
            <Image
              src={randomise.sprites.other.home.front_default}
              height={100}
              width={100}
              alt={randomise.name}
            />
          </div>
        )}
        <button className='font-press-start text-3xl mt-5 text-red-500 transition-ease-in-out duration-300 hover:text-red-400'>
          Fight!
        </button>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=500&offset=0"
  );
  const pokemon = await res.json();

  return {
    props: {
      pokemon,
    },
  };
}
