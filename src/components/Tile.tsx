import './css/Tile.css'
import { TileData } from '../types';

type TileProperties = {
    tile: TileData;
}

export function Tile({tile}: TileProperties)
{
    const classes = [
        'tile',
        `tile-${tile.value}`,
        tile.isNew ? 'tile-new' : '',
        tile.isMerged ? 'tile-merged' : '',
    ].join(' ');

    return (
        <div className={classes}>
            {tile.value > 0 ? tile.value : ''}
        </div>
    );
}