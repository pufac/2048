import './css/Tile.css';
import { TileData } from '../types';

type TileProperties = {
    tile: TileData;
    row: number;
    col: number;
}

export function Tile({ tile, row, col }: TileProperties) {
    const classes = [
        'tile',
        `tile-${tile.value}`,
        tile.isNew ? 'tile-new' : '',
        tile.isMerged ? 'tile-merged' : '',
    ].filter(Boolean).join(' ');

    const tileStyle = {
        top: `${row * 115 + 15}px`,
        left: `${col * 115 + 15}px`,
    };

    return (
        <div className={classes} style={tileStyle}>
            {tile.value > 0 ? tile.value : ''}
        </div>
    );
}