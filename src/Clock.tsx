import React, {useContext} from 'react';
import {UserContext} from './UserContext'
import useInterval from './useInterval'

export default function Clock() {
    
    const x = useInterval({ cnt: 1 })
    const user = useContext(UserContext)
    return (
        <div>
        <h1>Hello {user.name}, {x.clockState.cnt}!</h1>
        <h2>It is {x.clockState.date.toLocaleTimeString()}</h2>
        <button onClick={() => {x.setClockState({date: new Date(), cnt: 1})}}>Reset</button>
        </div>
            
    )

}
