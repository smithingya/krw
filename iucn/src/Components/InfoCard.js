import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import GridListTile from '@material-ui/core/GridListTile'
import image from '../Img/IUCN_Red_List.svg.png'
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import {connect} from 'react-redux';
import {clickedRetrieval} from '../actions/retrieveActions'

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
  const { classes, animal, dispatch } = props;
  if (animal.image == undefined){
    animal.image = image
  }
  const noAnimal = <p>Use the searchfield to find animals with a certain name, threat type, habitat or ecoregion, or conservation measure.
  The endangerment category and the taxonomic subdivisions are not searchable at this time, but clicking on a link of this kind, will show you the animals that are in the same group.
  </p>
  var animalDesc = ''
  if (animal.name != undefined){
    const br = <br />
    var ge = animal.inGenus[Object.keys(animal.inGenus)[0]]
    var genus = <a href="#" onClick={() => dispatch(clickedRetrieval(ge.link,'rank'))}>{ge.label.toLowerCase()}</a>
    var fa = animal.inFamily[Object.keys(animal.inFamily)[0]]
    var family = <a href="#" onClick={() => dispatch(clickedRetrieval(fa.link,'rank'))}>{fa.label.toLowerCase()}</a>
    var or = animal.inOrder[Object.keys(animal.inOrder)[0]]
    var order = <a href="#" onClick={() => dispatch(clickedRetrieval(or.link,'rank'))}>{or.label.toLowerCase()}</a>
    var cl = animal.inClass[Object.keys(animal.inClass)[0]]
    var classs = <a href="#" onClick={() => dispatch(clickedRetrieval(cl.link,'rank'))}>{cl.label.toLowerCase()}</a>
    var ph = animal.inPhylum[Object.keys(animal.inPhylum)[0]]
    var phylum = <a href="#" onClick={() => dispatch(clickedRetrieval(ph.link,'rank'))}>{ph.label.toLowerCase()}</a>
    var ki = animal.inKingdom[Object.keys(animal.inKingdom)[0]]
    var kingdom = <a href="#" onClick={() => dispatch(clickedRetrieval(ki.link,'rank'))}>{ki.label.toLowerCase()}</a>
    if (animal.hasHabitat != undefined){
      var habitats = Object.keys(animal.hasHabitat).map(function(key, index) {
        var codes = animal.hasHabitat[key].code
        var labels = animal.hasHabitat[key].label
        var out = []
        codes.forEach(function(item,index,array){
          out.push({code: codes[index], label:labels[index]})
        })
        return out
      }).map(habitat => habitat.map(h => (<span>&emsp;<a href="#" onClick={() => dispatch(clickedRetrieval(h.label,'habitat'))}>{h.label} (code: {h.code})<br /></a></span>)))
    } else { var habitats = <span>&emsp;unknown <br /></span>}

    if (animal.hasThreat != undefined){
      var threatsArray = Object.keys(animal.hasThreat).map(function(key, index) {
        if (animal.hasThreat[key].code != undefined){
          var codes = animal.hasThreat[key].code
          var labels = animal.hasThreat[key].label
          var out = []
          codes.forEach(function(item,index,array){
            out.push({code: codes[index], label:labels[index]})
          })
          return out
        }
        return [{code: 'unknown', label: 'unknown'}]
      })
      var threatsFlattened = [].concat.apply([],threatsArray)
      var usedCodes = []
      var threats = threatsFlattened.map(h => {
        if (h.label != 'unknown' && usedCodes.indexOf(h.code) == -1){
          usedCodes.push(h.code)
          return <span>&emsp;<a href="#" onClick={() => dispatch(clickedRetrieval(h.label,'threat'))}>{h.label} (code: {h.code})<br /></a></span>
        }
      })
    } else { var threats = <span>&emsp;no threats known <br /></span>}

    if (animal.hasMeasure != undefined){
      var measuresArray = Object.keys(animal.hasMeasure).map(function(key, index) {
        if (animal.hasMeasure[key].code != undefined){
          var codes = animal.hasMeasure[key].code
          var labels = animal.hasMeasure[key].label
          var out = []
          codes.forEach(function(item,index,array){
            out.push({code: codes[index], label:labels[index]})
          })
          return out
        }
        return [{code: 'unknown', label: 'unknown'}]
      })
      var measuresFlattened = [].concat.apply([],measuresArray)
      var usedCodes = []
      var measures = measuresFlattened.map(h => {
        if (h.label != 'unknown' && usedCodes.indexOf(h.code) == -1){
          usedCodes.push(h.code)
          return <span>&emsp;<a href="#" onClick={() => dispatch(clickedRetrieval(h.label,'measure'))}>{h.label} (code: {h.code})<br /></a></span>
        }
      })
    } else { var threats = <span>&emsp;no conservation measures in place<br /></span>}

    var category = animal.hasCategory[Object.keys(animal.hasCategory)[0]]
    if (animal.hasEcoregionName != 'NaN'){
      var eco = <a href="#" onClick={() => dispatch(clickedRetrieval(animal.hasEcoregionName, 'ecoregion'))}>{animal.hasEcoregionName}</a>
    } else {
      var eco = 'unknown'
    }


    animalDesc = <p style={{marginBottom: '60px'}}> {animal.name} - <i>{animal.taxon}</i> <br />(
      {genus}, {family}, {order}, {classs}, {phylum}, {kingdom})<br />
    Endangerement level: <a href="#" onClick={() => dispatch(clickedRetrieval(category.link, 'category'))}>{category.label}</a><br />
    Threats: <br /> {threats}
    Conservation measures: <br /> {measures}
    Habitats: <br /> {habitats}
    WWF Ecoregion: {eco} <br />
    </p>
  }
  return(
    <Card className='Full-height' style={{overflow: 'hidden'}}>
      <Grid container spacing={0} className='Full-height' style={{overflow: 'hidden'}}>
        <Grid item xs={4}>
          <CardMedia image={animal.image} className='Full-height'/>
        </Grid>
        <Grid item xs={8} className='Full-height' style={{overflow: 'hidden'}}>
          <CardContent className='Full-height' style={{overflowY: 'auto'}}>
            {!animal.name && noAnimal}
            {animal.name && animalDesc}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

InfoCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    animal: state.animals.selectedAnimal
  }
}

export default connect(mapStateToProps)(withStyles(styles)(InfoCard))
