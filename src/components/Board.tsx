import './css/Board.css'
import { Tile } from './Tile'
import { TileData } from '../types';

type BoardProperties = {
    board: TileData[][];
    size: number;
}

export function Board ({board, size} : BoardProperties)
{
    const boardStyle = {
        gridTemplateColumns: `repeat(${size}, 100px)`,
        gridTemplateRows: `repeat(${size},100px),`
    };

    return (
        <div className='board' style={boardStyle}>
            {
                board.map((row) => (
                    row.map((tile) => (
                        <Tile key={tile.id} tile={tile}/>
                    ))
                ))
            }
        </div>
    );
}