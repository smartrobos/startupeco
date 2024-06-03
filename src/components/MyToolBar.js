import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from '@mui/material';
import { Drawer } from "@mui/material";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Home, Logout, Person } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { auth, signOut } from '../firebaseConfig';
import profilePicPlaceholder from '../assets/images/profile-pic-placeholder.jpeg';

const MyToolbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.clear();
            navigateTo('login');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    }

    const navigateTo = (path) => {
        navigate(`/${path}`);
    }

    const list = () => (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            style={{ width: '200px' }}
        >
            <List>
                <ListItemButton key={'Home'} onClick={() => navigateTo('home')}>
                    <ListItemIcon><Home color='info' /></ListItemIcon>
                    <ListItemText primary={'Home'} />
                </ListItemButton>
                <ListItemButton key={'Search'} onClick={() => navigateTo('search')}>
                    <ListItemIcon><Person color='info' /></ListItemIcon>
                    <ListItemText primary={'Search'} />
                </ListItemButton>
                <ListItemButton key={'Profile'} onClick={() => navigateTo('profile')}>
                    <ListItemIcon><Person color='info' /></ListItemIcon>
                    <ListItemText primary={'Profile'} />
                </ListItemButton>
                <ListItemButton key={'Logout'} onClick={() => logout()}>
                    <ListItemIcon><Logout color='info' /></ListItemIcon>
                    <ListItemText primary={'Logout'} />
                </ListItemButton>
            </List>
        </div>
    );

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <div >
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Startup Eco
                    </Typography>
                    <Menu id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => closeMenu()}>
                        <MenuItem onClick={() => logout()}>
                            <ListItemIcon><Logout color='info' /></ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                    <Avatar onClick={(event) => openMenu(event)} aria-haspopup="true"
                        alt="Profile" src={user != null ? user.photoURL : profilePicPlaceholder} />
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
                {list()}
            </Drawer>
        </div>
    );
};

export default MyToolbar;
