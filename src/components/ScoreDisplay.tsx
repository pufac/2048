import './css/ScoreDisplay.css'

type ScoreDisplayProperties = {
    label: string;
    score: number;
}

export function ScoreDisplay({label, score}: ScoreDisplayProperties)
{
    return (
        <div className="score-display">
            <span className="label">{label}</span>
            <span className="score">{score}</span>
        </div>
    );
}