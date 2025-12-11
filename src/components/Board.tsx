
import './css/Board.css'
import { Tile } from './Tile'
import { TileData } from '../types';
import { Grid } from './Grid';
import { SkinType } from './SkinSelector';

type BoardProperties = {
    board: TileData[][];
    size: number;
    skin: SkinType;
}

export function Board ({board, size, skin} : BoardProperties)
{

    const activeTiles: { data: TileData, r: number, c: number }[] = [];
    
    board.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile.value > 0) {
                activeTiles.push({
                    data: tile,
                    r: rowIndex,
                    c: colIndex
                });
            }
        });
    });

    return (
        <div className="board-container">
            <Grid size={size} />

            <div className="tile-container">
                {activeTiles.map((item) => (
                    <Tile
                        key={item.data.id}
                        tile={item.data}
                        row={item.r}
                        col={item.c}
                        skin={skin}
                    />
                ))}
            </div>
        </div>
    );
}