// import logo from './logo.svg';
import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';

import './App.css';
import Home from './components/Home/Home';
// import AppBar from './components/AppBar/AppBar';
import { lightTheme, darkTheme } from './theme';
import GlobalStyles from './globalStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <GlobalStyles />
      <div className="App">
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                News
              </Typography>
              {/* <Button color="inherit">Login</Button> */}
              {isDarkTheme ? (
                <BrightnessHighIcon onClick={() => setIsDarkTheme(!isDarkTheme)} />
              ) : (
                <Brightness3Icon onClick={() => setIsDarkTheme(!isDarkTheme)} />
              )}
            </Toolbar>
          </AppBar>
        </div>
        <Home />
      </div>
    </ThemeProvider>
  );
}

export default App;
