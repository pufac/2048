import './css/Game.css';

export type SkinType = 'classic' | 'exponent' | 'alphabet';

type SkinSelectorProps = {
    currentSkin: SkinType;
    onChange: (skin: SkinType) => void;
}

export function SkinSelector({ currentSkin, onChange }: SkinSelectorProps) {
    return (
        <div className="skin-selector" style={{ marginBottom: '15px' }}>
            <span style={{ marginRight: '10px', color: '#776e65', fontWeight: 'bold' }}>Skin:</span>
            
            <button 
                className={`add-tile-button ${currentSkin === 'classic' ? '' : 'inactive-btn'}`}
                onClick={() => onChange('classic')}
                style={{ opacity: currentSkin === 'classic' ? 1 : 0.6, transform: 'scale(0.9)' }}
            >
                2-4-8
            </button>

            <button 
                className={`add-tile-button`}
                onClick={() => onChange('exponent')}
                style={{ opacity: currentSkin === 'exponent' ? 1 : 0.6, transform: 'scale(0.9)' }}
            >
                1-2-3
            </button>

            <button 
                className={`add-tile-button`}
                onClick={() => onChange('alphabet')}
                style={{ opacity: currentSkin === 'alphabet' ? 1 : 0.6, transform: 'scale(0.9)' }}
            >
                A-B-C
            </button>
        </div>
    );
}