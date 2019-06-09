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
import {connect} from 'react-redux';
import {retrieveAnimalDetails} from '../actions/retrieveActions'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    width: 600,
    maxHeight: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});


function ResultsList(props) {
  const { classes, animalList, dispatch } = props;
  console.log(animalList)

  return(
    <div className={classes.root}>
    <div className='Full-width'>
     <GridList cellHeight={160} className={classes.gridList} cols={3}>
     {animalList.map(tile => {
       // console.log(tile.image)
       return (
          <GridListTile key={tile.taxon}
          onClick={() => dispatch(retrieveAnimalDetails(tile))}
          >
            <img src={tile.image} alt={tile.name} />
            <GridListTileBar
              title={tile.name}
              subtitle={<span>{tile.taxon}</span>}
              actionIcon={
                <IconButton className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        )})}
     </GridList>
   </div>
   </div>
  )
}

ResultsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    animalList: state.animals.list
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ResultsList))
