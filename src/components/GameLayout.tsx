import { ReactNode } from 'react';
import './css/Game.css';

type GameLayoutProps = {
    children: ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
    return (
        <div className='game-container'>
            {children}
        </div>
    );
}