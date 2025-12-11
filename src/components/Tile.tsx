import './css/Tile.css';
import { TileData } from '../types';
import { SkinType } from './SkinSelector';

type TileProperties = {
    tile: TileData;
    row: number;
    col: number;
    skin: SkinType;
}

export function Tile({ tile, row, col, skin }: TileProperties) {
    const classes = [
        'tile',
        `tile-${tile.value}`,
        tile.isNew ? 'tile-new' : '',
        tile.isMerged ? 'tile-merged' : '',
        tile.isJoker ? 'tile-joker' : '' // <-- CSS OSZTÁLY A JOKERNEK
    ].filter(Boolean).join(' ');

    const tileStyle = {
        top: `${row * 115 + 15}px`,
        left: `${col * 115 + 15}px`,
    };

    const getDisplayText = () => {
        if (tile.isJoker) return '★';
        if (tile.value === 0) return '';

        switch (skin) {
            case 'exponent':
                return Math.log2(tile.value);
            
            case 'alphabet':
                const charCode = 64 + Math.log2(tile.value);
                return String.fromCharCode(charCode);

            case 'classic':
            default:
                return tile.value;
        }
    };

    return (
        <div className={classes} style={tileStyle}>
            {getDisplayText()}
        </div>
    );
}