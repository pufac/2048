import { Button } from './Button';

type DebugPanelProps = {
    onSpawn: (value: number) => void;
    onJoker: () => void;
}

export function DebugPanel({ onSpawn, onJoker }: DebugPanelProps) {
    const debugValues: number[] = [];
    for (let i = 1; i <= 20; i++) {
        debugValues.push(Math.pow(2, i));
    }

    return (
        <div className="debug-controls">
            <span>Debug Panel: </span>
            <Button onClick={onJoker} className="joker-btn">
                Joker ★
            </Button>
            {debugValues.map(value => (
                <Button key={`debug-btn-${value}`} onClick={() => onSpawn(value)}>
                    {value}
                </Button>
            ))}
        </div>
    );
}