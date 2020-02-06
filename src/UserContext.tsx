import React from 'react';
interface User {
    name: string
}
export const UserContext = React.createContext<User>({name: "Antti"})
