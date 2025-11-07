import './css/Game.css'
import { useState, useEffect, useRef } from 'react';
import { Board } from './Board';
import { ScoreDisplay } from './ScoreDisplay';

const debug_tile_values: number[] = [];

const BOARD_SIZE = 5;

for(let i = 1; i <= 20; i++)
{
    debug_tile_values.push(Math.pow(2,i));
}

const handleSmallestTileRemoval = (board: number[][], newTileValue: number): number[][] => {
    let smallest = Infinity;
    board.forEach(row => {
        row.forEach(cell => {
            if(cell > 0 && cell < smallest)
            {
                smallest = cell;
            }
        })
    });

    if(smallest === Infinity) return board;

    if(newTileValue > smallest && smallest < 256)
    {
        let found = false;

        const boardAfterClear = board.map(row => {
            return row.map(cell => {
                if(!found && cell === smallest)
                {
                    found = true;
                    return 0;
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

const compressRow = (row: number[]): number[] => {
    return row.filter(cell => cell !== 0);
};



const fillRow = (row: number[]): number[] => {
    const newRow = [...row];
    while(newRow.length < BOARD_SIZE){
        newRow.push(0);
    }
    return newRow;
}

const transpose = (board:number[][]): number[][] => {
    const newBoard = Array.from({length:BOARD_SIZE}, () => Array(BOARD_SIZE).fill(0));
    for(let i = 0; i<BOARD_SIZE; i++){
        for (let j = 0; j < BOARD_SIZE; j++)
        {
            newBoard[i][j] = board[j][i];
        }
    }
    return newBoard;
}

const generateEmptyBoard = (): number[][] => {
    return Array.from({length: BOARD_SIZE}, () => Array(BOARD_SIZE).fill(0));
}

export function Game(){
    
    const [board, setBoard] = useState(() => {
        const initialBoard = generateEmptyBoard();
        initialBoard[0][1] = 2;
        initialBoard[2][2] = 4;
        return initialBoard;
    })

    const [score, setScore] = useState(0);

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
        setBoard(currentBoard => {
            let processedBoard: number[][] = currentBoard;
            let boardChanged = false;

            switch (direction) {
                case 'left':
                    processedBoard = currentBoard.map(row => {
                         const originalRowJSON = JSON.stringify(row);
                         const compressed = compressRow(row);
                         const merged = mergeRow(compressed);
                         const filled = fillRow(merged);
                         if (originalRowJSON !== JSON.stringify(filled)) {
                             boardChanged = true;
                         }
                         return filled;
                    });
                    break;
                case 'right':
                     processedBoard = currentBoard.map(row => {
                         const originalRowJSON = JSON.stringify(row);
                         const reversedRow = [...row].reverse(); // Másolaton dolgozunk!
                         const compressed = compressRow(reversedRow);
                         const merged = mergeRow(compressed);
                         const filled = fillRow(merged);
                         const finalRow = filled.reverse();
                         if (originalRowJSON !== JSON.stringify(finalRow)) {
                             boardChanged = true;
                         }
                         return finalRow;
                    });
                    break;
                case 'up':
                    { const transposedUp = transpose(currentBoard);
                    const movedUp = transposedUp.map(row => {
                        const originalRowJSON = JSON.stringify(row);
                        const compressed = compressRow(row);
                        const merged = mergeRow(compressed);
                        const filled = fillRow(merged);
                        if (originalRowJSON !== JSON.stringify(filled)) {
                            boardChanged = true;
                        }
                        return filled;
                    });
                    processedBoard = transpose(movedUp);
                    break; }
                case 'down':
                    { const transposedDown = transpose(currentBoard);
                    const movedDown = transposedDown.map(row => {
                        const originalRowJSON = JSON.stringify(row);
                        const reversedRow = [...row].reverse();
                        const compressed = compressRow(reversedRow);
                        const merged = mergeRow(compressed);
                        const filled = fillRow(merged);
                        const finalRow = filled.reverse();
                         if (originalRowJSON !== JSON.stringify(finalRow)) {
                            boardChanged = true;
                        }
                        return finalRow;
                    });
                    processedBoard = transpose(movedDown);
                    break; }
            }

            if (boardChanged) {
                playerMoved.current = true;
                return processedBoard;
            }

            return currentBoard;
        });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowLeft':
                makeMove('left');
                break;
            case 'ArrowRight':
                makeMove('right');
                break;
            case 'ArrowUp':
                makeMove('up');
                break;
            case 'ArrowDown':
                makeMove('down');
                break;
        }

    };

    useEffect(() => {
        window.addEventListener('keydown',handleKeyDown);
        console.log("added event listener");

        return () => {
            window.removeEventListener('keydown',handleKeyDown);
        };
    },[]);

    useEffect(() => {
        console.log("new tile use effect");
        if(playerMoved.current)
        {
            playerMoved.current = false;

            let maxTile = 0;
            board.forEach(row => {
                row.forEach(cell => {
                    if(cell > maxTile) {
                        maxTile = cell;
                    }
                })
            });

            addNewTile(getNewSpawnValue(maxTile));
        }
    }, [board])


    const addNewTile = (value?: number) => {
    setBoard(currentBoard => { // 1. Funkcionális frissítés: Mindig a legfrissebb táblát kapjuk!
        
        // 2. Határozzuk meg a spawnolandó értéket
        let valueToSpawn: number;
        if (value) {
            // Ha kaptunk értéket (debug gomb), azt használjuk
            valueToSpawn = value;
        } else {
            // Ha nem (játékmenet), akkor számoljuk ki
            const maxTile = currentBoard.flat().reduce((max, cell) => Math.max(max, cell), 0);
            valueToSpawn = getNewSpawnValue(maxTile);
        }

        // 3. Keressünk üres helyet (a logika ugyanaz)
        const emptyTiles: { row: number, col: number }[] = [];
        currentBoard.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 0) {
                    emptyTiles.push({ row: rowIndex, col: colIndex });
                }
            });
        });

        // Ha nincs üres hely, nem csinálunk semmit, visszaadjuk a régi táblát
        if (emptyTiles.length === 0) {
            return currentBoard;
        }

        const randomIndex = Math.floor(Math.random() * emptyTiles.length);
        const randomTile = emptyTiles[randomIndex];

        // 4. Hozzáadjuk az új lapkát és lefuttatjuk a takarítást
        const newBoardWithTile = currentBoard.map(row => [...row]);
        newBoardWithTile[randomTile.row][randomTile.col] = valueToSpawn;

        const finalBoard = handleSmallestTileRemoval(newBoardWithTile, valueToSpawn);

        // 5. Visszaadjuk a végső táblát a Reactnek
        return finalBoard;
    });
};
    
    return (
        <div className='game-container'>
            <div className="game-header">
                <h1 className='title'>2048</h1>
                <ScoreDisplay label="Score" score = {score} />
            </div>

            <Board board={board} size={BOARD_SIZE}/>

            <div className="debug-controls">
                <span>Debug</span>
                {debug_tile_values.map(value => (
                    <button key={`debug-btn-${value}`} onClick={() => addNewTile(value)}>{value}</button>
                ))}
            </div>
        </div>
    );
}