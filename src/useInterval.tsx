import React, { useState, useEffect } from 'react'

export interface ClockState  {
    date: Date,
    cnt: number,
}

export interface UseInterval {
    clockState: ClockState,
    setClockState: React.Dispatch<React.SetStateAction<ClockState>>;
}

export default function useInterval(initialVal?: Partial<ClockState>): UseInterval {
    const defaultVal: ClockState = {
        date: new Date(),
        cnt: 1
    }
    const [clockState, setClockState] = useState<ClockState>({ ...defaultVal, ...initialVal } )
    useEffect(()=>{
        const timerId = setInterval(() => {
            //console.log('here', timerId)
            setClockState({ date: new Date(), cnt: clockState.cnt + 1 })
        }, 1000)
        //console.log('timer', timerId)
        return () => {
            //console.log('clearing', timerId)
            clearInterval(timerId) 
        }
    },[clockState.cnt,clockState.date])
    return {clockState, setClockState}
}