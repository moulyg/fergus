import React from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import {UserType} from "./models/type";

export const UserContext = React.createContext<UserType>({
    fullName: 'Mouly Gunarathne',
    userId: 1
});


const App: React.FC = () => (
    <UserContext.Provider value={{
        fullName: 'Mouly Gunarathne',
        userId: 1
    }}>
        <HomePage/>
    </UserContext.Provider>
);

export default App;
