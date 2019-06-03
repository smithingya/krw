import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import image from '../Img/bonobo.jpg'
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    maxWidth: 600,
    height: '100%',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

const tileData = [
  {
   img: image,
   title: 'Bonobo',
   author: 'VU',
 },
 {
   img: image,
   title: 'Bonobo',
   author: 'VU',
  },
  {
   img: image,
   title: 'Bonobo',
   author: 'VU',
  },
  {
   img: image,
   title: 'Bonobo',
   author: 'VU',
 },
 {
   img: image,
   title: 'Bonobo',
   author: 'VU',
  },
  {
   img: image,
   title: 'Bonobo',
   author: 'VU',
  },
  {
   img: image,
   title: 'Bonobo',
   author: 'VU',
 },
 {
   img: image,
   title: 'Bonobo',
   author: 'VU',
  },
  {
   img: image,
   title: 'Bonobo',
   author: 'VU',
  },
];


function ResultsList(props) {
  const { classes } = props;

  return(
    <div className={classes.root}>
     <GridList cellHeight={160} className={classes.gridList} cols={3}>
     {tileData.map(tile => (
          <GridListTile key={tile.img}>
            <img src={tile.img} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              subtitle={<span>IUCN Category: {tile.author}</span>}
              actionIcon={
                <IconButton className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
     </GridList>
   </div>
  )
}

ResultsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResultsList)
