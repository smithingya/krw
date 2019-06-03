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
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

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
    <Card className='Full-height'>
      <Grid container spacing={0} className='Full-height'>
        <Grid item xs={4}>
          <CardMedia image={image} className='Full-height'/>
        </Grid>
        <Grid item className='Full-height'>
          <CardContent className='Full-height'>
            Animal Name <br />
            Animal taxonomy: kingdom, phylum, etc.<br />
            Habitats<br />
            Endangerement level<br />
            Threats<br />
            Conservation measures<br />

          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

InfoCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoCard)
