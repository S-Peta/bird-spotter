import { createContext, useState } from "react";

type ContainerProps = {
    children: React.ReactNode
}
type TypePointsContext = {
    points: number,
    setPoints: React.Dispatch<React.SetStateAction<number>>
}
const PointsContextState = {
    points: 0,
    setPoints: () => 0
}

export const PointsContext = createContext<TypePointsContext>(PointsContextState)
export const PointsProvider = (props:ContainerProps) => {
    const [points, setPoints] = useState<number>(0)
    return (
        <PointsContext.Provider value={{points, setPoints}}>
            {props.children}
        </PointsContext.Provider>
    )
}
