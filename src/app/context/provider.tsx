import { createContext } from "vm";

const InfoContext = createContext();


export default function Provider({children} : {children:React.ReactNode}){
    return(
        <InfoContext.prfovider>
            {children}
        </InfoContext.prfovider>
    )
}