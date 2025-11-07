import './css/Grid.css'
import { GridRow } from './GridRow'

type GridProperties = {
    size:number;
}

export function Grid({size}: GridProperties) {

    const gridStyle = {
        gridTemplateColumns: `repeat(${size}, 100px)`,
        gridTemplateRows: `repeat(${size}, 100px)`,
    };

    return (
        <div className="grid-container" style={gridStyle}>
            {Array.from({ length: size * size }).map((_, i) => (
                <div className="grid-cell" key={i} />
            ))}
        </div>
    );
}