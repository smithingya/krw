import React from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import MyMapComponent from './MapComponent'
import SearchBar from './Components/SearchBar'
import ResultsList from './Components/ResultsList'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InfoCard from './Components/InfoCard'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  topmargin: {
    marginTop: 100,
  },
  smalltopmargin: {
    marginTop: 4,
  },
});

function App(props) {
  const { classes } = props;
  return (
    <div className="App" className='Full-height' style={{overflow: 'hidden'}}>
      <Grid container spacing={0} className='Full-height' style={{overflow: 'hidden'}}>
        <Grid item xs={6} container alignItems="center" direction="column" spacing={16}>
          <Grid item className={classes.topmargin}>
              <SearchBar />
          </Grid>
          <Grid item >
            <ResultsList className='Full-width' />
          </Grid>
        </Grid>
        <Grid item xs={6} container spacing={8} direction="column" className={classes.smalltopmargin}>
          <Grid item xs={6} className='Full-width' style={{maxHeight: '400px'}}>
            <InfoCard style={{overflow: 'hidden'}}/>
          </Grid>
          <Grid item xs={6} className='Full-width'>
            <MyMapComponent />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(App);
