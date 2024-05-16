'use client';

import { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { Float } from '@headlessui-float/react';
import { Menu, Button, Input } from '@headlessui/react';
import { POKEMON, TRAINERS, POKEBALLS, GRID, ENTITY } from 'utils/constants';
import { minMax, getRandomElement, getRandomInt } from 'utils/range';

export const PokemonGame = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [grid, setGrid] = useState([]);
  const [showTooltip, setShowTooltip] = useState('');
  const [activePokemon, setActivePokemon] = useState({});
  const [trainers, setTrainers] = useState({});
  const [numTrainers, setNumTrainers] = useState(
    minMax(Number(searchParams.get('trainers')) || ENTITY.TRAINER.default_num, ENTITY.TRAINER.min, ENTITY.TRAINER.max),
  );
  const [numRows, setNumRows] = useState(
    minMax(Number(searchParams.get('rows')) || GRID.ROW.default_num, GRID.ROW.min, GRID.ROW.max),
  );
  const [numCols, setNumCols] = useState(
    minMax(Number(searchParams.get('cols')) || GRID.COL.default_num, GRID.COL.min, GRID.COL.max),
  );
  const gridRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!searchParams.get('rows') || !searchParams.get('cols') || !searchParams.get('trainers')) {
      router.push(
        `?${createQueryString('rows', numRows)}&${createQueryString('cols', numCols)}&${createQueryString(
          'trainers',
          numTrainers,
        )}`,
      );
    }
    resetGrid();
  }, [numCols, numRows, numTrainers]);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const getRandomPokeball = () => {
    const pokeballsArray = POKEBALLS.reduce((acc, pokeball) => {
      acc.push(...Array(pokeball.rarity).fill(pokeball));
      return acc;
    }, []);
    return getRandomElement(pokeballsArray);
  };

  const resetGrid = () => {
    const newActivePokemon = getRandomElement(POKEMON);
    const newTrainers = [...TRAINERS]
      .sort(() => Math.random() - 0.5)
      .slice(0, numTrainers)
      .reduce((acc, trainer) => {
        const pokeball = getRandomPokeball();
        acc[trainer.id] = { ...trainer, pokeball, time: 0 };
        return acc;
      }, {});

    const newGrid = Array(numRows)
      .fill()
      .map(() =>
        Array(numCols)
          .fill()
          .map(() => ({ entityType: ENTITY.LAND.type })),
      );

    const getEmptyPositions = () => {
      const emptyPositions = [];
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          if (newGrid[i][j].entityType === ENTITY.LAND.type) {
            emptyPositions.push({ row: i, col: j });
          }
        }
      }
      return emptyPositions;
    };

    const setRandomItemInGrid = (item) => {
      const randomIndex = getRandomInt(emptyPositions.length - 1);
      const { row, col } = emptyPositions[randomIndex];
      newGrid[row][col] = item;
      emptyPositions.splice(randomIndex, 1);
      return { row, col, emptyPositions };
    };

    const emptyPositions = getEmptyPositions();

    const { row: pokemonRow, col: pokemonCol } = setRandomItemInGrid(newActivePokemon);
    newActivePokemon.row = pokemonRow;
    newActivePokemon.col = pokemonCol;

    if (Object.keys(newTrainers).length > emptyPositions.length) {
      const trainersToRemove = Object.keys(newTrainers).slice(emptyPositions.length);
      trainersToRemove.forEach((trainerId) => {
        delete newTrainers[trainerId];
      });
    }

    Object.values(newTrainers).forEach((trainer, index) => {
      const { row, col } = setRandomItemInGrid(trainer);
      const time = Math.sqrt(Math.pow(pokemonRow - row, 2) + Math.pow(pokemonCol - col, 2)) / trainer?.pokeball?.speed;
      newTrainers[trainer.id].row = row;
      newTrainers[trainer.id].col = col;
      newTrainers[trainer.id].time = time;
    });
    setGrid(newGrid);
    setActivePokemon(newActivePokemon);
    setTrainers(newTrainers);
  };

  const fastestTime = Object.values(trainers).sort((a, b) => a.time - b.time)?.[0]?.time;
  const trainersSortedByTime = Object.values(trainers).filter((trainer) => trainer.time === fastestTime);

  const handleOnMouseEnter = (id) => (e) => {
    e.stopPropagation();
    setShowTooltip(id);
  };

  const handleOnMouseLeave = (e) => {
    e.stopPropagation();
    setShowTooltip('');
  };

  const handleChangeNumTrainers = (e) => {
    const newNumTrainers = parseInt(e.target.value, 10);
    router.push(`?${createQueryString('trainers', newNumTrainers)}`);
    setNumTrainers(newNumTrainers);
  };

  const handleChangeRows = (e) => {
    const newNumRows = parseInt(e.target.value, 10);
    router.push(`?${createQueryString('rows', newNumRows)}`);
    setNumRows(newNumRows);
  };

  const handleChangeCols = (e) => {
    const newNumCols = parseInt(e.target.value, 10);
    router.push(`?${createQueryString('cols', newNumCols)}`);
    setNumCols(newNumCols);
  };

  const pluralize = (word, count) => {
    return count > 1 ? `${word}s` : word;
  };

  return (
    <div className="max-h-screen w-full flex flex-col items-center justify-start">
      <div className="my-8 w-72" ref={controlsRef}>
        <h2 className="mb-2 font-bold text-2xl">{pluralize('Winning Trainer', trainersSortedByTime.length)}</h2>
        <div>
          <span className="font-bold">{pluralize('Name', trainersSortedByTime.length)}:</span>{' '}
          {trainersSortedByTime.map((trainer) => trainer?.name).join(', ')}
        </div>
        <div>
          <span className="font-bold">{pluralize('Ball', trainersSortedByTime.length)}:</span>{' '}
          {trainersSortedByTime.map((trainer) => trainer?.pokeball?.name).join(', ')}
        </div>
        <div className="mb-4">
          <span className="font-bold">Time:</span> {fastestTime?.toFixed(2)}
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col gap-y-2">
            <div className="font-bold">Number of Trainers:</div>
            <Input
              min={1}
              max={TRAINERS.length}
              type="number"
              name="trainers"
              value={numTrainers}
              onChange={handleChangeNumTrainers}
              className="w-full text-center block rounded-lg border-none bg-neutral-800 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="font-bold">Grid Size:</div>
            <div className="flex flex-row gap-2">
              <Input
                min={GRID.ROW.min}
                max={GRID.ROW.max}
                type="number"
                name="rows"
                value={numRows}
                onChange={handleChangeRows}
                className="w-full text-center block rounded-lg border-none bg-neutral-800 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              />
              <Input
                min={GRID.COL.min}
                max={GRID.COL.max}
                type="number"
                name="cols"
                value={numCols}
                onChange={handleChangeCols}
                className="w-full text-center block rounded-lg border-none bg-neutral-800 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              />
            </div>
            <Button
              onClick={resetGrid}
              className="w-full text-center items-center gap-2 rounded-md bg-neutral-800 py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-neutral-600 data-[active]:bg-neutral-700 data-[focus]:outline-1 data-[focus]:outline-white"
            >
              Generate Grid
            </Button>
          </div>
        </div>
      </div>
      <div
        ref={gridRef}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(50deg) rotateZ(45deg)`,
          marginTop: `${numCols * 11 - numRows * 13 + 12}px`,
        }}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((col, colIndex) => {
              if (col.entityType === ENTITY.LAND.type) {
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="w-12 h-12 border border-white flex items-center justify-center bg-green-500"
                  >
                    <span className="rounded-full p-2 leading-none" />
                  </div>
                );
              }
              return (
                <Menu as="div" key={`${rowIndex}-${colIndex}`} className="flex">
                  <Float
                    portal
                    show={showTooltip === `${rowIndex}-${colIndex}`}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Button
                      className="w-12 h-12"
                      onMouseEnter={handleOnMouseEnter(`${rowIndex}-${colIndex}`)}
                      onMouseLeave={handleOnMouseLeave}
                    >
                      <div
                        className={clsx(
                          {
                            ['-translate-x-2 -translate-y-2']: showTooltip === `${rowIndex}-${colIndex}`,
                            ['bg-purple-500']: col.entityType === ENTITY.TRAINER.type,
                            ['bg-red-500']: col.entityType === ENTITY.POKEMON.type,
                          },
                          'transition-all duration-300 ease-in-out',
                          'w-12 h-12 border flex items-center justify-center cursor-pointer',
                        )}
                      >
                        <span
                          className={clsx('rounded-full p-2 leading-none', {
                            ['bg-yellow-500']:
                              col.entityType === ENTITY.TRAINER.type && fastestTime === trainers[col.id].time,
                          })}
                        >
                          {col?.name?.[0]}
                        </span>
                      </div>
                    </Menu.Button>
                    <Menu.Items className="rounded-lg bg-neutral-800/60 backdrop-blur-2xl p-4" static>
                      {col.entityType === ENTITY.POKEMON.type && (
                        <div>
                          <div>Pokemon</div>
                          <div>Name: {activePokemon.name}</div>
                        </div>
                      )}
                      {col.entityType === ENTITY.TRAINER.type && (
                        <div>
                          <div>Name: {trainers[col.id].name}</div>
                          <div>Ball: {trainers[col.id].pokeball.name}</div>
                          <div>Time: {trainers[col.id].time.toFixed(2)}</div>
                        </div>
                      )}
                    </Menu.Items>
                  </Float>
                </Menu>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonGame;
