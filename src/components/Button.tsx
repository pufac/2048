import './css/Game.css';

type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

export function Button({ onClick, children, className = "" }: ButtonProps) {

    return (
        <button className={`add-tile-button ${className}`} onClick={onClick}>
            {children}
        </button>
    );
}