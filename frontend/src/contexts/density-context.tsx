'use client'

import { createContext, type ReactNode, useContext, useState } from "react";

type Density = 'comfortable' | 'compact';

type DensityContextValue = {
    density: Density;
    toggleDensity: () => void;
}

const DensityContext = createContext<DensityContextValue|undefined>(undefined);

export default function DensityProvider({children}: {children: ReactNode}){
    const [density, setDensity] = useState<Density>('comfortable');

    function toggleDensity() {
        setDensity((currentDensity) => 
            currentDensity === 'comfortable' ? 'compact' : 'comfortable'
        )
    }

    return (
        <DensityContext.Provider value={{density, toggleDensity}} >
            {children}
        </DensityContext.Provider>
    )
}

export function useDensity() {
    const context = useContext(DensityContext);
    if(!context) {
        throw new Error("useDensity must be used inside DensityProvider")
    }
    return context;
}