import { createContext } from "react";

export const InfoContext = createContext<{lang:string} | null>(null);


export default function Provider({children} : {children:React.ReactNode}){/
    
    return(
        <InfoContext.Provider value={{lang:'fa'}}>
            {children}
        </InfoContext.Provider>
    )
}