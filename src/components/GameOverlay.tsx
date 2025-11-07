import './css/GameOverlay.css'

type GameOverlayProperties = {
    score: number;
    onRestart: () => void;
}

export function GameOverOverlay({score, onRestart}: GameOverlayProperties) {
    return (
        <div className='game-over-overlay'>
            <div className='overlay-content'>
                <h2>Game over</h2>
                <p>Score: {score}</p>
                <button onClick={onRestart}>Restart</button>
            </div>
        </div>
    );
}