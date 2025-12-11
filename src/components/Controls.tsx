import './css/Game.css';

type ControlsProps = {
    onUndo: () => void;
    onRestart: () => void;
    canUndo: boolean;
    undoCount: number;
}

export function Controls({ onUndo, onRestart, canUndo, undoCount }: ControlsProps) {
    return (
        <div className="game-controls" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button 
                className="add-tile-button" 
                onClick={onRestart}
                style={{ backgroundColor: '#8f7a66' }}
            >
                New Game
            </button>

            <button 
                className={`add-tile-button ${!canUndo ? 'inactive-btn' : ''}`} 
                onClick={onUndo}
                disabled={!canUndo}
                style={{ 
                    backgroundColor: canUndo ? '#f59563' : '#ccc', 
                    cursor: canUndo ? 'pointer' : 'not-allowed'
                }}
            >
                Undo ({undoCount}) ↶
            </button>
        </div>
    );
}