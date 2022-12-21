import React, { useEffect, useState } from "react";
import pokemonLogo from "../public/pokemonLogo.svg";
import Image from "next/image";
import axios from "axios";
import { FormEvent, ChangeEvent } from "../types/types";
import BattleArena from "../components/BattleArena";
import pokesong from "../assets/pokesong.wav";

export default function Home({ pokemon }: any) {
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [showPokemon, setShowPokemon] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [opposition, setOpposition] = useState<any>(null);
  const [startBattle, setStartBattle] = useState(false);
  const [playerHP, setPlayerHP] = useState(500);
  const [opponentHP, setOpponentHP] = useState(500);

  const getRandomPokemon = () => {
    const randomPokemon =
      pokemon.results[Math.floor(Math.random() * pokemon.results.length)].name;
    axios
      .get(
        `https://pokeapi.co/api/v2/pokemon/${randomPokemon}
  `
      )
      .then((response) => {
        setSelectedPokemon(response.data);
        setShowPokemon(true);
        setErrorMessage(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (event: ChangeEvent) => {
    setSearchText(event.target.value);
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    axios
      .get(
        `https://pokeapi.co/api/v2/pokemon/${searchText.toLowerCase()}
  `
      )
      .then((response) => {
        if (searchText.length > 0) {
          setSelectedPokemon(response.data);
        } else {
          throw new Error();
        }
        setShowPokemon(true);
        setErrorMessage(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(true);
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
        setOpposition(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [pokemon.results]);

  const toBattleArena = () => {
    if (selectedPokemon) {
      setStartBattle(true);
    } else {
      setErrorMessage(true);
    }
    controlAudio();
  };

  function controlAudio() {
    const audioElement: any = document.querySelector("#bg-audio");
    audioElement.setAttribute("loop", "");
    audioElement?.play();
  }

  return (
    <div className='bg-image'>
      <audio src={pokesong} id='bg-audio' />
      {startBattle ? (
        <BattleArena
          opposition={opposition}
          selectedPokemon={selectedPokemon}
          pokemonLogo={pokemonLogo}
          setStartBattle={setStartBattle}
          setShowPokemon={setShowPokemon}
          playerHP={playerHP}
          setPlayerHP={setPlayerHP}
          opponentHP={opponentHP}
          setOpponentHP={setOpponentHP}
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
              value={searchText}
              onChange={handleChange}
              className='shadow-sm  h-8 w-56 p-1 rounded-sm focus:border-teal-500 focus:ring-teal-500 border-slate-400'
            />
            <button type='submit'>
              <p className='font-press-start text-sm mt-5 transition-ease-in-out duration-300 hover:opacity-80'>
                Search
              </p>
            </button>
          </form>
          {errorMessage && (
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
          {showPokemon && (
            <div className='flex flex-col mt-3 p-3 justify-center items-center border-double border-4 border-indigo-600 bg-slate-300 bg-opacity-50'>
              <p className='text-center	font-press-start text-xs'>
                {selectedPokemon.name}
              </p>
              <Image
                src={selectedPokemon.sprites.other.home.front_default}
                height={100}
                width={100}
                alt={selectedPokemon.name}
              />
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
