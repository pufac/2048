import './css/Board.css'
import { Tile } from './Tile'

type BoardProperties = {
    board: number[][];
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
                board.map((row, rowIndex) => (
                    row.map((cellValue, colIndex) => 
                    <Tile
                        key={`tile-${rowIndex}-${colIndex}`}
                        value={cellValue}
                    />
                    ))
                )
            }
        </div>
    );
}