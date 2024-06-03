import MyToolbar from './MyToolBar';
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import profilePicPlaceholder from '../assets/images/profile-pic-placeholder.jpeg';
import Avatar from '@mui/material/Avatar';

const Search = () => {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    return (
        <div>
            <MyToolbar />
            <Grid container spacing={3} style={{ padding: 20, justifyContent: 'center' }}>
                <Grid item xs={12} sm={6} lg={4}>
                    <TextField name="search" value={search} onChange={(event) => setSearch(event.target.value)}
                        label="Search" variant="outlined" style={{ width: '100%' }} />
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{ padding: 20, flexDirection: 'row', flexWrap: 'wrap' }}>
                {users.map((item, index) => (
                    <Grid item xs={12} sm={6} lg={2}>
                        <Card style={{ backgroundColor: 'lightblue', borderRadius: 24 }}>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar alt="Profile Pic" sx={{ width: '100%', height: 'auto', borderRadius: 10 }}
                                    src={profilePicPlaceholder} />
                                <h3 style={{ margin: '15px 0 0 0' }}>Matheas</h3>
                                <span style={{ marginTop: '10px' }}>Developer @Google</span>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

            </Grid>
        </div>
    );
}

export default Search;