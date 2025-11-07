import './css/Header.css'
import { Title } from './Title'
import { ScoreDisplay } from './ScoreDisplay'

type HeaderProperties = {
    score: number;
}

export function Header({score}:HeaderProperties){
    return (
        <div className='game-header'>
            <Title/>
            <ScoreDisplay label='score' score={score} />
        </div>
    );
}