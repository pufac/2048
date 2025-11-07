import './css/Game.css'
import { useState, useEffect, useRef } from 'react';
import { Board } from './Board';
import { ScoreDisplay } from './ScoreDisplay';
import { TileData } from '../types';
import { GameOverOverlay } from './GameOverlay';
import { Header } from './Header';

const debug_tile_values: number[] = [];

const BOARD_SIZE = 5;

for(let i = 1; i <= 20; i++)
{
    debug_tile_values.push(Math.pow(2,i));
}

const handleSmallestTileRemoval = (board: TileData[][], newTileValue: number): TileData[][] => {
    let smallest = Infinity;
    board.forEach(row => {
        row.forEach(cell => {
            if(cell.value > 0 && cell.value < smallest)
            {
                smallest = cell.value;
            }
        })
    });

    if(smallest === Infinity) return board;

    if(newTileValue > smallest && smallest >= 256)
    {
        let found = false;

        const boardAfterClear = board.map(row => {
            return row.map(cell => {
                if(!found && cell.value === smallest)
                {
                    found = true;
                    return {...cell, value:0};
                }
                return cell;
            });
        });
        return boardAfterClear;
    }
    return board;
};

const getNewSpawnValue = (maxTile: number): number => {
    if(maxTile >= 1048576) return 16384;
    if(maxTile >= 524288) return 8192;
    if(maxTile >= 262144) return 4096;
    if(maxTile >= 131072) return 2048;
    if(maxTile >= 65536) return 1024;
    if(maxTile >= 32768) return 512;
    if(maxTile >= 16384) return 256;
    if(maxTile >= 8096) return 128;
    if(maxTile >= 4096) return 64;
    if(maxTile >= 2048) return 32;
    if(maxTile >= 1024) return 16;
    if(maxTile >= 512) return 8;
    if(maxTile >= 256) return 4;
    
    return Math.random() < 0.9 ? 2 : 4;
}


export function Game(){
    
    const nextId = useRef(1);


    const createTile = (value = 0): TileData => {
        return {id: nextId.current++, value};
    };

    const generateEmptyBoard = (): TileData[][] => {
        const emptyBoard: TileData[][] = [];
        for(let i = 0; i < BOARD_SIZE; i++)
        {
            emptyBoard.push(Array.from({length: BOARD_SIZE}, () => createTile()));
        }
        return emptyBoard;
    }

    const [board, setBoard] = useState<TileData[][]>(() => generateEmptyBoard());


    const [score, setScore] = useState(0);

    const [isGameOver, setIsGameOver] = useState(false);

    const checkForGameOver = (currentBoard: TileData[][]): boolean => {

        if(!currentBoard || currentBoard.length === 0) return false;

        //van e ures hely a tablaban
        for(let r = 0; r < BOARD_SIZE; r++)
        {
            for(let c = 0; c < BOARD_SIZE; c++)
            {
                if(currentBoard[r][c].value === 0) return false;
            }
        }

        //ha nincs hely, akkor van még mozgás?
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const currentTileValue = currentBoard[r][c].value;

                if(c < BOARD_SIZE - 1 && currentTileValue === currentBoard[r][c+1].value)
                {
                    return false;
                }

                if(r < BOARD_SIZE - 1 && currentTileValue === currentBoard[r+1][c].value)
                {
                    return false;
                }
            }
        }

        return true;
    }

    

    

    const transpose = (b: TileData[][]): TileData[][] => {
    const newBoard = generateEmptyBoard();
    for(let i = 0; i<BOARD_SIZE; i++){
        for (let j = 0; j < BOARD_SIZE; j++)
        {
            newBoard[i][j] = b[j][i];
        }
    }
    return newBoard;
}

    const startGame = () => {
        let startingBoard = generateEmptyBoard();
        startingBoard = addRandomTile(startingBoard);
        startingBoard = addRandomTile(startingBoard);
        setBoard(startingBoard);
        setScore(0);
        setIsGameOver(false);
    }

    useEffect(() => {
        startGame();
    },[]);

    const mergeRow = (row:number[]): number[] => {
        const newRow = [];
        for (let i = 0; i < row.length; i++)
        {
            if(i < row.length - 1 && row[i] === row[i+1])
            {
                const newValue = row[i] * 2;
                newRow.push(newValue);
                setScore(currentScore => currentScore + newValue);
                i++;
            }
            else{
                newRow.push(row[i]);
            }
        }
        return newRow;
    }

    const playerMoved = useRef(false);
    
    const makeMove = (direction: 'left' | 'right' | 'up' | 'down') => {
        let currentBoard = board;

        if(direction === 'up' || direction === 'down'){
            currentBoard = transpose(currentBoard);
        }

        let newScore = score;
        let boardChanged = false;

        const newBoard = currentBoard.map(row => {
            let newRow = [...row];

            if(direction === 'right' || direction === 'down'){
                newRow.reverse();
            }

            let compressedRow = newRow.filter(tile => tile.value !== 0);

            let mergedRow: TileData[] = [];
            for (let i = 0; i < compressedRow.length; i++)
            {
                if (i < compressedRow.length - 1 && compressedRow[i].value === compressedRow[i+1].value)
                {
                    const mergedValue = compressedRow[i].value * 2;
                    newScore += mergedValue;
                    mergedRow.push({...createTile(mergedValue), isMerged: true});
                    i++;
                    boardChanged = true;
                }else{
                    mergedRow.push(compressedRow[i]);
                }
            }

            if(JSON.stringify(newRow) !== JSON.stringify(mergedRow.concat(Array(newRow.length - mergedRow.length).fill(null))))
            {
                boardChanged = true;
            }

            while(mergedRow.length < BOARD_SIZE){
                mergedRow.push(createTile());
            }

            if(direction === 'right' || direction === 'down')
            {
                mergedRow.reverse();
            }

            return mergedRow;
        });

        if(boardChanged)
        {
            let finalBoard = newBoard;
            if(direction === 'up' || direction === 'down'){
                finalBoard = transpose(finalBoard);
            }

            finalBoard = addRandomTile(finalBoard);

            setScore(newScore);
            setBoard(finalBoard);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const cleanedBoard = board.map(row => 
                row.map(tile => ({
                    ...tile,
                    isNew: undefined,
                    isMerged: undefined,
                }))
            );
            if(JSON.stringify(board) !== JSON.stringify(cleanedBoard)) {
                setBoard(cleanedBoard);
            }
        },200);
        
        if (checkForGameOver(board)){
            setIsGameOver(true);
        }

        return () => clearTimeout(timer);
    }, [board]);

    const addRandomTile = (currentBoard: TileData[][]): TileData[][] => {
        const emptySpots: {r: number, c: number}[] = [];
        currentBoard.forEach((row,r) => {
            row.forEach((tile,c) => {
                if(tile.value === 0) emptySpots.push({r,c});
            });
        });

        if(emptySpots.length > 0)
        {
            const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
            
            const maxTile = currentBoard.flat().reduce((max, cell) => Math.max(max, cell.value),0);

            const valueToSpawn = getNewSpawnValue(maxTile);
            
            let newBoard = currentBoard.map(r => r.map(c => ({...c})));
            newBoard[spot.r][spot.c] = {...createTile(valueToSpawn), isNew: true};
            newBoard = handleSmallestTileRemoval(newBoard, valueToSpawn);
            return newBoard;
        }

        return currentBoard;
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if(isGameOver) return;
            switch (e.key) {
                case 'ArrowLeft': makeMove('left'); break;
                case 'ArrowRight': makeMove('right'); break;
                case 'ArrowUp': makeMove('up'); break;
                case 'ArrowDown': makeMove('down'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [board, isGameOver]);


    const addNewTileDebug = (value: number) => {
        const emptySpots: { r: number, c: number }[] = [];
        board.forEach((r, rIndex) => r.forEach((c, cIndex) => {
            if (c.value === 0) emptySpots.push({ r: rIndex, c: cIndex });
        }));

        if (emptySpots.length > 0) {
            const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
            let newBoard = board.map(r => r.map(c => ({...c})));
            newBoard[spot.r][spot.c] = { ...createTile(value), isNew: true };
            newBoard = handleSmallestTileRemoval(newBoard, value);
            setBoard(newBoard);
        }
    };
    
    return (
        <div className='game-container'>

            {isGameOver && <GameOverOverlay score={score} onRestart={startGame}/>}

            <Header score={score}/>

            

            <Board board={board} size={BOARD_SIZE}/>

            <div className="debug-controls">
                <span>Debug</span>
                {debug_tile_values.map(value => (
                    <button key={`debug-btn-${value}`} onClick={() => addNewTileDebug(value)}>{value}</button>
                ))}
            </div>
        </div>
    );
}