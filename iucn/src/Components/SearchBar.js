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

const styles = {
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


class SearchBar extends React.Component{

  state = {
    age: 'animal',
    name: 'hai',
    labelWidth: 0,
  };


  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render(){
    const { classes } = this.props;
    return(
      <div>
      <Typography variant='h3' gutterBottom>IUCN Red List Checker</Typography>
      <Paper className={classes.root} elevation={1}>
        <InputBase className={classes.input} placeholder={"Search for " + this.state.age} />
        <IconButton className={classes.iconButton} aria-label="Search">
          <SearchIcon />
        </IconButton>
        <FormControl className={classes.formControl}>
            <NativeSelect
              value={this.state.age}
              onChange={this.handleChange('age')}
              input={<Input name="age" id="age-native-helper" />}
            >
              <option value={'animal'}>Animal</option>
              <option value={'threat'}>Threat</option>
              <option value={'country'}>Country</option>
            </NativeSelect>
          </FormControl>
      </Paper>
      </div>
    )
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchBar)
