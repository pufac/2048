import './css/Tile.css'

type TileProperties = {
    value: number;
}

export function Tile({value}: TileProperties)
{
    return (
        <div className={`tile tile-${value}`}>
            {value > 0 ? value : ''}
        </div>
    );
}