import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import ProgressBar from "./ProgressBar";
import gsap from "gsap";
import hitsound from "../assets/hitsound.wav";
import useSound from "use-sound";

const BattleArena = ({
  opposition,
  selectedPokemon,
  pokemonLogo,
  opponentHP,
  setOpponentHP,
  playerHP,
  setPlayerHP,
}: any) => {
  const [playerMoves, setPlayerMoves] = useState<any>([]);
  const [oppositionMoves, setOppositionMoves] = useState<any>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [moveData, setMoveData] = useState<any>([]);
  const [oppMoveData, setOppMoveData] = useState<any>([]);
  const [description, setDescription] = useState<any>(
    "Choose a move to start the battle!"
  );
  const [reUseMove, setReUseMove] = useState("");
  const [battleOver, setBattleOver] = useState(false);

  //Get 4 moves from list of moves
  function getMultipleRandom(arr: any, num: number) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, num);
  }

  //Set 4 moves from list of moves
  useEffect(() => {
    setPlayerMoves(getMultipleRandom(selectedPokemon.moves, 4));
    setOppositionMoves(getMultipleRandom(opposition.moves, 4));
  }, [selectedPokemon, opposition]);

  //Set move data
  useEffect(() => {
    playerMoves.map((item: any) => {
      axios
        .get(item.move.url)
        .then((response) =>
          setMoveData((prevArray: any) => [
            ...prevArray,
            { name: response.data.name, power: response.data.power },
          ])
        );
    });

    oppositionMoves.map((item: any) => {
      axios
        .get(item.move.url)
        .then((response) =>
          setOppMoveData((prevArray: any) => [
            ...prevArray,
            { name: response.data.name, power: response.data.power },
          ])
        );
    });
  }, [playerMoves, oppositionMoves]);

  //Sound effect
  const [hitFX] = useSound(hitsound);

  //OnClick function
  const moveSelect = (name: string) => {
    moveData.map((item: any) => {
      if (name === item.name) {
        setOpponentHP(opponentHP - item.power);
      }
    });
    setIsDisabled(true);
    setDescription(`${selectedPokemon.name} used ${name}`);
    setReUseMove(name);

    setTimeout(() => {
      const randomOppMove =
        oppMoveData[Math.floor(Math.random() * oppMoveData.length)];
      setIsDisabled(false);
      setPlayerHP(playerHP - randomOppMove?.power);
      setDescription(`${opposition.name} used ${randomOppMove?.name}`);
    }, 2000);
  };

  useEffect(() => {
    if (playerHP < 0 || opponentHP < 0) {
      setBattleOver(true);
    }
  }, [playerHP, opponentHP]);

  const backToHome = () => {
    window.location.reload();
  };

  //Animation try
  const playerRef = useRef<any>();
  const opponentRef = useRef<any>();

  useEffect(() => {
    gsap.fromTo(
      opponentRef.current,
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

    if (opponentHP < 500) {
      hitFX();
    }
  }, [opponentHP, hitFX]);

  useEffect(() => {
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
    if (playerHP < 500) {
      hitFX();
    }
  }, [playerHP, hitFX]);

  return (
    <div className='flex items-center justify-center h-screen flex-col'>
      <div className='items-center justify-center flex-col hidden sm:flex'>
        <Image
          className='cursor-pointer'
          src={pokemonLogo.src}
          alt='Poke logo'
          width={250}
          height={250}
          onClick={() => backToHome()}
        />
        <p className='font-fugaz-one text-lg -mt-3 mb-7'>BATTLE</p>
      </div>
      <div className='relative flex flex-col sm:flex-row w-2/3 flex-wrap'>
        {playerHP > 0 ? (
          <div
            className={`${
              battleOver ? "w-full" : "w-full sm:w-5/12"
            }  flex items-center justify-center flex-col transition-all ease-in-out duration-1000`}>
            <p className='text-xs sm:text-lg font-press-start'>
              {selectedPokemon.name}
            </p>
            {opponentHP > 0 && <ProgressBar maxValue={500} value={playerHP} />}
            <Image
              ref={playerRef}
              src={selectedPokemon.sprites.other.home.front_default}
              height={120}
              width={120}
              alt={selectedPokemon.name}
            />
            {opponentHP > 0 && (
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
        {playerHP > 0 && opponentHP > 0 ? (
          <div className='flex items-center justify-center sm:w-2/12 p-8 sm:p-0'>
            <p className='font-press-start text-md md:text-3xl text-red-500 '>
              vs
            </p>
          </div>
        ) : null}
        {opponentHP > 0 ? (
          <div
            className={`${
              battleOver
                ? "w-full"
                : "w-full sm:w-5/12 sm:absolute sm:top-0 sm:right-0"
            }  flex items-center justify-center flex-col transition-all ease-in-out duration-1000`}>
            <p className='text-xs sm:text-lg font-press-start'>
              {opposition.name}
            </p>
            {playerHP > 0 && <ProgressBar maxValue={500} value={opponentHP} />}
            <Image
              ref={opponentRef}
              src={opposition.sprites.other.home.front_default}
              height={120}
              width={120}
              alt={selectedPokemon.name}
            />
          </div>
        ) : null}
      </div>
      {battleOver ? (
        <div className='flex flex-col align-center justify-center'>
          <p className='mt-9 font-press-start'>
            {opponentHP < 0 ? "You are the Winner!" : "You Lose!"}
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
    </div>
  );
};

export default BattleArena;
