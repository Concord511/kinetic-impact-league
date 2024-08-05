import React from "react";
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './Dashboard';

// This component will handle routing for the base Kinetic bundle routes
export const KineticImpactLeagueRouting = () => (
    <>
        <Routes>
            <Route  
                path='/'
                element={<Dashboard />}
            />
        </Routes>
    </>
);
