import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Input from '@material-ui/core/Input';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import {connect} from 'react-redux';
import * as search from '../actions/searchActions'
import * as retrieve from '../actions/retrieveActions'
import InputAdornment from '@material-ui/core/InputAdornment';

function getstyles() {
  return {
    root: {
      padding: '8px 16px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      width: '100%',
    },
    input: {
      flex: 1,
      paddingLeft: '4px'
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      width: 1,
      height: 28,
      margin: 4,
    },
    formControl:{
      paddingBottom: '8px'
    }
  };
}


function SearchBar(props) {

  const searchState = props.searchState
  const dispatch = props.dispatch
  const wars = props.wars
  const searchString = searchState.searchString
  const searchType = searchState.searchType
  const warString = searchState.warString
  const classes = getstyles()
  var searchForWars = searchType === 'war'
  const adorn = <InputAdornment position="end">radius in km</InputAdornment>
  return(
    <div fullWidth>
    <Typography variant='h3' gutterBottom>IUCN Red List Checker</Typography>
    <Paper fullWidth style={classes.root} elevation={1}>
      <InputBase style={classes.input}
        placeholder={"Search for " + searchType}
        value={searchString}
        endAdornment={searchForWars && adorn}
        onChange={(event) => dispatch(search.inputChange(event.target.value))}
        onKeyPress={(event) => {if (event.charCode == 13)
          {dispatch(retrieve.retrieveAnimalNames(searchString,searchType))}}}/>
      <IconButton style={classes.iconButton} aria-label="Search"
        onClick={(event) => {if (searchForWars) {
          dispatch(retrieve.retrieveAnimalNames(warString+','+searchString,searchType))}
        else {
          dispatch(retrieve.retrieveAnimalNames(searchString,searchType))
        }}}
      >
        <SearchIcon />
      </IconButton>
      <FormControl style={classes.formControl}>
          <NativeSelect
            value={searchType}
            onChange={(event) => dispatch(search.typeChange(event.target.value))}
            input={<Input name="type" id="type-native-helper" />}
          >
            <option value={'animal'}>Animal</option>
            <option value={'threat'}>Threat</option>
            <option value={'habitat'}>Habitat</option>
            <option value={'measure'}>Measure</option>
            <option value={'war'}>UN Peacekeeping Mission</option>
            <option value={'rank'} disabled>Taxonomic rank</option>
            <option value={'category'} disabled>Endangerement category</option>
            <option value={'ecoregion'} disabled>Ecoregion</option>
          </NativeSelect>
        </FormControl>
        <FormControl fullWidth style={classes.formControl}>
            <NativeSelect
              disabled={!searchForWars}
              value={warString}
              onChange={(event) => dispatch(search.warChange(event.target.value))}
              input={<Input name="war" id="type-native-helper" />}
            >
              <option value={''} disabled></option>
              {wars.map(war => (
                <option key={war.warName.value} value={[war.lat.value,war.lng.value]}> {war.warName.value} </option>
              ))}
            </NativeSelect>
        </FormControl>
    </Paper>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    searchState: state.search,
    wars: state.animals.wars
  }
}

export default connect(mapStateToProps)(SearchBar)
