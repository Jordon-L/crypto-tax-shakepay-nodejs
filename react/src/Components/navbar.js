import React, { Component } from 'react';
import AppBar from '@mui/material/AppBar';
//import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000'
    }
  }
});
//import { ThemeProvider, createTheme } from '@mui/material/styles';
function appBarLabel(label) {
    return (
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {label}
        </Typography>
      </Toolbar>
    );
 }

class Navbar extends Component {
  render() {
    return  (
      <ThemeProvider theme={theme}>
        <AppBar position="static" color="primary">
        {appBarLabel('Crypto Gains') }
        </AppBar>
      </ThemeProvider>
    )
  }
}

export default Navbar; // Don’t forget to use export default!