import { GridCell } from "./GridCell";

type GridRowProperties = {
    size:number;
}

export function GridRow({size}:GridRowProperties){
    return <>{Array.from({ length: size }).map((_, i) => <GridCell key={i} />)}</>;
}