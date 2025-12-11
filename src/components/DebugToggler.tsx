import './css/Game.css';

type DebugTogglerProps = {
    isOpen: boolean;
    onToggle: (newValue: boolean) => void;
}

export function DebugToggler({ isOpen, onToggle }: DebugTogglerProps) {
    return (
        <label className="debug-toggle">
            <input 
                type="checkbox" 
                checked={isOpen} 
                onChange={(e) => onToggle(e.target.checked)} 
            />
            <span>Show Debug Controls</span>
        </label>
    );
}