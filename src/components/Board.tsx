import './css/Board.css'
import { Tile } from './Tile'
import { TileData } from '../types';
import { Grid } from './Grid';

type BoardProperties = {
    board: TileData[][];
    size: number;
}

export function Board ({board, size} : BoardProperties)
{
    return (
        <div className="board-container">
            <Grid size={size} />

            <div className="tile-container">
                {board.map((row, rowIndex) =>
                    row.map((tile, colIndex) =>
                        tile.value > 0 ? (
                            <Tile
                                key={tile.id}
                                tile={tile}
                                row={rowIndex}
                                col={colIndex}
                            />
                        ) : null
                    )
                )}
            </div>
        </div>
    );
}