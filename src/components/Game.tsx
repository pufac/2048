
import './css/Game.css'
import { useState, useEffect, useRef } from 'react';
import { Board } from './Board';
// import { ScoreDisplay } from './ScoreDisplay'; 
import { TileData } from '../types';
import { GameOverOverlay } from './GameOverlay';
import { Header } from './Header';

import { GameLayout } from './GameLayout';
import { Instructions } from './Instructions';
import { DebugPanel } from './DebugPanel';
import { Footer } from './Footer';
import { DebugToggler } from './DebugToggler';
import { SkinSelector, SkinType } from './SkinSelector';
import { Controls } from './Controls';

const debug_tile_values: number[] = [];
const BOARD_SIZE = 5;
const MAX_UNDO_STEPS = 5; 

for (let i = 1; i <= 20; i++) {
    debug_tile_values.push(Math.pow(2, i));
}


const handleSmallestTileRemoval = (board: TileData[][], newTileValue: number): TileData[][] => {
    let smallest = Infinity;
    board.forEach(row => {
        row.forEach(cell => {
            if (cell.value > 0 && cell.value < smallest) {
                smallest = cell.value;
            }
        })
    });

    let largest = 0;
    board.forEach(row => {
        row.forEach(cell => {
            if (cell.value > 0 && cell.value > largest) {
                largest = cell.value;
            }
        })
    });

    if (smallest === Infinity) return board;

    if (newTileValue > smallest && largest > 256) {
        let found = false;
        const boardAfterClear = board.map(row => {
            return row.map(cell => {
                if (!found && cell.value < newTileValue) {
                    found = true;
                    return { ...cell, value: 0 };
                }
                return cell;
            });
        });
        return boardAfterClear;
    }
    return board;
};

const getNewSpawnValue = (maxTile: number): number => {
    if (maxTile >= 1048576) return 16384;
    if (maxTile >= 524288) return 8192;
    if (maxTile >= 262144) return 4096;
    if (maxTile >= 131072) return 2048;
    if (maxTile >= 65536) return 1024;
    if (maxTile >= 32768) return 512;
    if (maxTile >= 16384) return 256;
    if (maxTile >= 8096) return 128;
    if (maxTile >= 4096) return 64;
    if (maxTile >= 2048) return 32;
    if (maxTile >= 1024) return 16;
    if (maxTile >= 512) return 8;
    if (maxTile >= 256) return 4;
    return Math.random() < 0.9 ? 2 : 4;
}

export function Game() {

    const nextId = useRef(1);

    const createTile = (value = 0): TileData => {
        return { id: nextId.current++, value };
    };

    const generateEmptyBoard = (): TileData[][] => {
        const emptyBoard: TileData[][] = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            emptyBoard.push(Array.from({ length: BOARD_SIZE }, () => createTile()));
        }
        return emptyBoard;
    };

    const [board, setBoard] = useState<TileData[][]>(() => generateEmptyBoard());
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [showDebug, setShowDebug] = useState(false);
    const [skin, setSkin] = useState<SkinType>('classic');
    const [history, setHistory] = useState<{ board: TileData[][], score: number }[]>([]);



    const checkForGameOver = (currentBoard: TileData[][]): boolean => {
        if (!currentBoard || currentBoard.length === 0) return false;

        // üres hely
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (currentBoard[r][c].value === 0) return false;
            }
        }

        // szomszedok
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const currentTileValue = currentBoard[r][c].value;
                if (c < BOARD_SIZE - 1 && currentTileValue === currentBoard[r][c + 1].value) return false;
                if (r < BOARD_SIZE - 1 && currentTileValue === currentBoard[r + 1][c].value) return false;
            }
        }
        return true;
    }


    const saveHistory = () => {
        setHistory(prev => {
            const boardSnapshot = board.map(row => row.map(tile => ({ ...tile })));
            
            const newHistory = [
                ...prev, 
                { board: boardSnapshot, score: score }
            ];

            if (newHistory.length > MAX_UNDO_STEPS) {
                return newHistory.slice(newHistory.length - MAX_UNDO_STEPS);
            }
            return newHistory;
        });
    };

    const addRandomTile = (currentBoard: TileData[][]): TileData[][] => {
        const emptySpots: { r: number, c: number }[] = [];
        currentBoard.forEach((row, r) => {
            row.forEach((tile, c) => {
                if (tile.value === 0) emptySpots.push({ r, c });
            });
        });

        if (emptySpots.length > 0) {
            const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];

            const isJokerChance = Math.random() < 0.05;
            let newBoard = currentBoard.map(r => r.map(c => ({ ...c })));
            if (isJokerChance) {
                newBoard[spot.r][spot.c] = { ...createTile(1), isNew: true, isJoker: true };
            }
            else {
                const maxTile = currentBoard.flat().reduce((max, cell) => Math.max(max, cell.value), 0);
                const valueToSpawn = getNewSpawnValue(maxTile);


                newBoard[spot.r][spot.c] = { ...createTile(valueToSpawn), isNew: true };
                newBoard = handleSmallestTileRemoval(newBoard, valueToSpawn);
            }

            return newBoard;
        }
        return currentBoard;
    }

    const startGame = () => {
        setHistory([]);
        let startingBoard = generateEmptyBoard();
        startingBoard = addRandomTile(startingBoard);
        startingBoard = addRandomTile(startingBoard);
        setBoard(startingBoard);
        setScore(0);
        setIsGameOver(false);
    }

    useEffect(() => {
        startGame();
    }, []);

    const handleUndo = () => {
        if (history.length === 0) return;

        const lastState = history[history.length - 1];

        setBoard(lastState.board);
        setScore(lastState.score);
        setIsGameOver(false);

        setHistory(prev => prev.slice(0, -1));
    };

    const makeMove = (direction: 'left' | 'right' | 'up' | 'down') => {
        let boardChanged = false;
        let newScore = score;

        let finalBoard = board.map(row => row.map(tile => ({ ...tile })));

        const processLine = (line: TileData[]): TileData[] => {
            const compressed = line.filter(tile => tile.value !== 0);
            const merged: TileData[] = [];

            for (let i = 0; i < compressed.length; i++) {
                const current = compressed[i];
                const next = compressed[i + 1];
                
                
                if (next && (current.value === next.value || current.isJoker || next.isJoker)) {

                    
                    let valueToDouble = 0;

                    if (current.isJoker && next.isJoker) {
                        valueToDouble = 2;
                    } else if (current.isJoker) {
                        valueToDouble = next.value;
                    } else {
                        valueToDouble = current.value;
                    }

                    const mergedValue = valueToDouble * 2;
                    newScore += mergedValue;

                    merged.push({
                        id: next.id,
                        value: mergedValue,
                        isMerged: true,
                        isJoker: false
                    });
                    i++;
                } else {
                    merged.push(current);
                }
            }
            while (merged.length < BOARD_SIZE) {
                merged.push(createTile());
            }
            return merged;
        };


        if (direction === 'left' || direction === 'right') {
            finalBoard = finalBoard.map(row => {
                const originalRow = [...row];
                const lineToProcess = direction === 'right' ? [...originalRow].reverse() : originalRow;

                let processedLine = processLine(lineToProcess);

                if (direction === 'right') {
                    processedLine.reverse();
                }

                const originalValues = originalRow.map(t => t.value);
                const processedValues = processedLine.map(t => t.value);
                if (JSON.stringify(originalValues) !== JSON.stringify(processedValues)) {
                    boardChanged = true;
                }
                return processedLine;
            });
        } else {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const originalColumn: TileData[] = [];
                for (let r = 0; r < BOARD_SIZE; r++) {
                    originalColumn.push(finalBoard[r][c]);
                }

                const lineToProcess = direction === 'down' ? [...originalColumn].reverse() : originalColumn;
                let processedLine = processLine(lineToProcess);

                if (direction === 'down') {
                    processedLine.reverse();
                }

                const originalValues = originalColumn.map(t => t.value);
                const processedValues = processedLine.map(t => t.value);
                if (JSON.stringify(originalValues) !== JSON.stringify(processedValues)) {
                    boardChanged = true;
                }

                for (let r = 0; r < BOARD_SIZE; r++) {
                    finalBoard[r][c] = processedLine[r];
                }
            }
        }

        if (boardChanged) {
            saveHistory();
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
            if (JSON.stringify(board) !== JSON.stringify(cleanedBoard)) {
                setBoard(cleanedBoard);
            }
        }, 200);

        if (checkForGameOver(board)) {
            setIsGameOver(true);
        }

        return () => clearTimeout(timer);
    }, [board]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver) return;
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
            let newBoard = board.map(r => r.map(c => ({ ...c })));
            newBoard[spot.r][spot.c] = { ...createTile(value), isNew: true };
            newBoard = handleSmallestTileRemoval(newBoard, value);
            setBoard(newBoard);
        }
    };

    const addJokerDebug = () => {
        const emptySpots: { r: number, c: number }[] = [];
        board.forEach((r, rIndex) => r.forEach((c, cIndex) => {
            if (c.value === 0) emptySpots.push({ r: rIndex, c: cIndex });
        }));

        if (emptySpots.length > 0) {
            const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
            let newBoard = board.map(r => r.map(c => ({ ...c })));

            newBoard[spot.r][spot.c] = { ...createTile(1), isNew: true, isJoker: true };

            setBoard(newBoard);
        }
    };

    return (
        <GameLayout>
            {isGameOver && <GameOverOverlay score={score} onRestart={startGame} />}

            <Header score={score} />

            <Controls 
                onUndo={handleUndo} 
                onRestart={startGame} 
                canUndo={history.length > 0}
                undoCount={history.length}
            />

            <SkinSelector currentSkin={skin} onChange={setSkin} />
            <Instructions />

            <DebugToggler isOpen={showDebug} onToggle={setShowDebug} />

            <div className="game-content-wrapper">

                <Board board={board} size={BOARD_SIZE} skin={skin}/>

                {showDebug && (
                    <DebugPanel onSpawn={addNewTileDebug} onJoker={addJokerDebug} />
                )}


            </div>

            <Footer />

        </GameLayout>
    );
}