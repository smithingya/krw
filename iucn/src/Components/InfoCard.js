import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import GridListTile from '@material-ui/core/GridListTile'
import image from '../Img/bonobo.jpg'
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
  root: {
    minHeight: 0,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  image:{
    left: '50%',
height: '50%',
position: 'relative',
transform: 'translateX(-50%)',
  }
});

function InfoCard(props){
  const { classes } = props;
  return(
    <Grid container className='Full-width'>
      <Grid item xs={3}>
        Image
      </Grid>
      <Grid item>
        Info
      </Grid>
    </Grid>
  )
}

InfoCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoCard)
