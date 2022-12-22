import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import ProgressBar from "./ProgressBar";
import gsap from "gsap";
import hitsound from "../assets/hitsound.wav";
import useSound from "use-sound";
import { BattleArenaProps, Moves, MoveData } from "../types/types";
import { usePokemonState } from "../hooks/getPokemonState";
import { getMultipleRandom } from "../functions/functions";
import Confetti from "react-confetti";

const BattleArena = ({
  pokemonLogo,
  selectedPokemon,
  opposition,
}: BattleArenaProps) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [moveData, setMoveData] = useState<MoveData[]>([]);
  const [oppMoveData, setOppMoveData] = useState<MoveData[]>([]);
  const [description, setDescription] = useState(
    "Choose a move to start the battle!"
  );
  const [reUseMove, setReUseMove] = useState("");
  const [battleOver, setBattleOver] = useState(false);
  const [state, dispatch] = usePokemonState();

  //Set 4 moves from list of moves
  useEffect(() => {
    dispatch({
      type: "SET_PLAYER_MOVES",
      payload: getMultipleRandom(selectedPokemon!.moves, 4),
    });
    dispatch({
      type: "SET_OPPOSITION_MOVES",
      payload: getMultipleRandom(opposition!.moves, 4),
    });
  }, [dispatch, selectedPokemon, opposition]);

  //Set move data
  useEffect(() => {
    state.playerMoves.map((item: Moves) => {
      axios
        .get(item.move.url)
        .then((response) =>
          setMoveData((prevArray: MoveData[]) => [
            ...prevArray,
            { name: response.data.name, power: response.data.power },
          ])
        );
    });

    state.oppositionMoves.map((item: Moves) => {
      axios
        .get(item.move.url)
        .then((response) =>
          setOppMoveData((prevArray: MoveData[]) => [
            ...prevArray,
            { name: response.data.name, power: response.data.power },
          ])
        );
    });
  }, [state.playerMoves, state.oppositionMoves]);

  //Sound effect
  const [hitFX] = useSound(hitsound);

  //OnClick function
  const moveSelect = (name: string) => {
    moveData.map((item: MoveData) => {
      if (name === item.name) {
        dispatch({
          type: "SET_OPPONENT_HP",
          payload: state.opponentHP - item!.power,
        });
      }
    });
    setIsDisabled(true);
    setDescription(`${selectedPokemon?.name} used ${name}`);
    setReUseMove(name);

    setTimeout(() => {
      const randomOppMove =
        oppMoveData[Math.floor(Math.random() * oppMoveData.length)];
      setIsDisabled(false);
      randomOppMove.power &&
        dispatch({
          type: "SET_PLAYER_HP",
          payload: state.playerHP - randomOppMove?.power,
        });
      setDescription(`${opposition?.name} used ${randomOppMove?.name}`);
    }, 2000);
  };

  useEffect(() => {
    if (state.playerHP < 0 || state.opponentHP < 0) {
      setBattleOver(true);
    }
  }, [state.playerHP, state.opponentHP]);

  const backToHome = () => {
    window.location.reload();
  };

  //Animation
  const playerRef: React.MutableRefObject<HTMLImageElement | null> =
    useRef(null);
  const opponentRef: React.MutableRefObject<HTMLImageElement | null> =
    useRef(null);

  useEffect(() => {
    gsap.fromTo(
      opponentRef?.current,
      {
        scale: 1,
        opacity: 1,
      },
      {
        scale: 1.1,
        repeat: 1,
        ease: "elastic",
        yoyoEase: "power3",
        opacity: 0.7,
      }
    );

    if (state.opponentHP < 500) {
      hitFX();
    }
  }, [state.opponentHP, hitFX]);

  useEffect(() => {
    !battleOver &&
      gsap.fromTo(
        playerRef.current,
        {
          scale: 1,
          opacity: 1,
        },
        {
          scale: 1.1,
          repeat: 1,
          ease: "elastic",
          yoyoEase: "power3",
          opacity: 0.7,
        }
      );
    if (state.playerHP < 500 && !battleOver) {
      hitFX();
    }
  }, [battleOver, state.playerHP, hitFX]);

  return (
    <div className='flex items-center justify-center h-screen flex-col'>
      <div className='items-center justify-center flex-col hidden sm:flex'>
        <Image
          className='cursor-pointer'
          src={pokemonLogo?.src}
          alt='Poke logo'
          width={250}
          height={250}
          onClick={() => backToHome()}
        />
        <p className='font-fugaz-one text-lg -mt-3 mb-7'>BATTLE</p>
      </div>
      <div className='relative flex flex-col sm:flex-row w-2/3 flex-wrap'>
        {state.playerHP > 0 ? (
          <div
            className={`${
              battleOver ? "w-full" : "w-full sm:w-5/12"
            }  flex items-center justify-center flex-col transition-all ease-in-out duration-1000`}>
            <p className='text-xs sm:text-lg font-press-start'>
              {selectedPokemon?.name}
            </p>
            {state.opponentHP > 0 && (
              <ProgressBar maxValue={500} value={state.playerHP} />
            )}
            {selectedPokemon && (
              <Image
                ref={playerRef}
                src={selectedPokemon?.sprites.other.home.front_default}
                height={120}
                width={120}
                alt={selectedPokemon?.name}
              />
            )}
            {state.opponentHP > 0 && (
              <div className='grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                {moveData.map((move: any) => (
                  <div
                    className='border col-span-1 flex items-center justify-center'
                    key={move.name}>
                    <button
                      disabled={isDisabled || reUseMove === move.name}
                      onClick={() => moveSelect(move.name)}
                      className='p-1 md:p-3 font-press-start text-xxs transition-all ease-in-out duration-1000'>
                      {move.name}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
        {state.playerHP > 0 && state.opponentHP > 0 ? (
          <div className='flex items-center justify-center sm:w-2/12 p-8 sm:p-0'>
            <p className='font-press-start text-md md:text-3xl text-red-500 '>
              vs
            </p>
          </div>
        ) : null}
        {state.opponentHP > 0 ? (
          <div
            className={`${
              battleOver
                ? "w-full"
                : "w-full sm:w-5/12 sm:absolute sm:top-0 sm:right-0"
            }  flex items-center justify-center flex-col transition-all ease-in-out duration-1000`}>
            <p className='text-xs sm:text-lg font-press-start'>
              {opposition?.name}
            </p>
            {state.playerHP > 0 && (
              <ProgressBar maxValue={500} value={state.opponentHP} />
            )}
            {opposition && (
              <Image
                ref={opponentRef}
                src={opposition?.sprites.other.home.front_default}
                height={120}
                width={120}
                alt={opposition?.name}
              />
            )}
          </div>
        ) : null}
      </div>
      {battleOver ? (
        <div className='flex flex-col align-center justify-center'>
          <p className='mt-9 font-press-start'>
            {state.opponentHP < 0 ? "You are the Winner!" : "You Lose!"}
          </p>
          <button
            onClick={() => backToHome()}
            className='font-press-start text-1xl mt-5 text-red-500 transition-ease-in-out duration-300 hover:text-red-400'>
            Play Again!
          </button>
        </div>
      ) : (
        <div className='flex align-center justify-center'>
          <p className='mt-9 font-press-start text-xs md:text-lg text-center px-10 md:p-0'>
            {description}
          </p>
        </div>
      )}
      {battleOver && state.playerHP > 0 && <Confetti gravity={0.2} />}
    </div>
  );
};

export default BattleArena;
