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

function getstyles() {
  return {
    root: {
      padding: '2px 16px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    input: {
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      width: 1,
      height: 28,
      margin: 4,
    },
  };
}


function SearchBar(props) {

  const searchState = props.searchState
  const dispatch = props.dispatch
  const searchString = searchState.searchString
  const searchType = searchState.searchType
  const classes = getstyles()

  return(
    <div>
    <Typography variant='h3' gutterBottom>IUCN Red List Checker</Typography>
    <Paper style={classes.root} elevation={1}>
      <InputBase style={classes.input}
        placeholder={"Search for " + searchType}
        value={searchString}
        onChange={(event) => dispatch(search.inputChange(event.target.value))}
        onKeyPress={(event) => {if (event.charCode == 13)
          {dispatch(retrieve.retrieveAnimalNames(searchString,searchType))}}}/>
      <IconButton style={classes.iconButton} aria-label="Search"
        onClick={(event) => dispatch(retrieve.retrieveAnimalNames(searchString,searchType))}
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
            <option value={'ecoregion'}>Ecoregion</option>
            <option value={'measure'}>Measure</option>
            <option value={'rank'} disabled>Taxonomic rank</option>
            <option value={'category'} disabled>Endangerement category</option>
          </NativeSelect>
        </FormControl>
    </Paper>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    searchState: state.search
  }
}

export default connect(mapStateToProps)(SearchBar)
