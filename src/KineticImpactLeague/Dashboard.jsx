import React, { useState, useEffect } from "react";
import { searchSubmissions } from '@kineticdata/react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { SubmitPointsModal } from "./Utils/SubmitPointsModal";

export const Dashboard = () => {
    const [leagueData, setLeagueData] = useState();

    useEffect(() => {
        const kapp = 'datastore';
        const form = 'kil-leaderboard';
        searchSubmissions({
            kapp,
            form,
            search: {
                include: ['details', 'values']
            }
        }).then(({ submissions }) => {
            const parsedSubmissionValues = submissions.map((submission, index) => ({
                id: index,
                displayName: submission.values['Display Name'],
                engagements: submission.values['Engagements'],
                points: submission.values['Points']
            }));
            setLeagueData(parsedSubmissionValues);
        });
    }, []);

    const columns = [
        {
            field: 'displayName',
            headerName: 'User',
            width: 250,
            editable: false,
        },
        {
            field: 'engagements',
            headerName: 'Engagements',
            type: 'number',
            sortable: true,
            width: 110,
            editable: false,
        },
        {
            field: 'points',
            headerName: 'Points',
            type: 'number',
            sortable: true,
            width: 160,
        },
    ];

    return leagueData && (
        <div className="kil-wrapper">
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={leagueData}
                    columns={columns}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'points', sort: 'desc' }],
                        },
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </Box>
            <SubmitPointsModal />
        </div>
    )
}