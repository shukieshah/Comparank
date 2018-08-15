import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



class RankingCriteriaCheckList extends React.Component {
  state = {
    value: 'Price',
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
    this.props.handleChange(event.target.value);
  };

  render() {
    return (
      <div>
        <FormControl component='fieldset'>
          <FormLabel component='legend'>Rank By</FormLabel>
          <RadioGroup
            aria-label='Rank By'
            value={this.state.value}
            onChange={this.handleChange}
          >
            <FormControlLabel value='Price' control={<Radio />} label='Price'/>
            <FormControlLabel value='Rating' control={<Radio />} label='Rating' />
            <FormControlLabel value='Popularity' control={<Radio />} label='Popularity' />
            <FormControlLabel value='Weighted Combined Ranking' control={<Radio />} label='Weighted Combined Ranking' />
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

class BusinessInfoPanel extends React.Component {
  render() {
    return (
      <div>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{this.props.businessDetails.name}    @{this.props.businessDetails.location}  </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div align="left">
              <Typography>Phone Number: {this.props.businessDetails.phone}</Typography>
              <Typography>Price Level: {this.props.businessDetails.price}</Typography>
              <Typography>Rating: {this.props.businessDetails.rating}</Typography>
              <Typography>Number of Reviews: {this.props.businessDetails.review_count}</Typography>
              <Typography>Latitude: {this.props.businessDetails.latitude}</Typography>
              <Typography>Longitude: {this.props.businessDetails.longitude}</Typography>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessList: [],
      businessIds: {},
      name: null,
      location: null,
      rankCriteria: 'Price'
    };
  }

  handleChangeLocation(event) {
    this.setState({ location: event.target.value });
  };

  handleChangeName(event) {
    this.setState({ name: event.target.value });
  };

  handleChangeCriteria(criteria) {
    this.setState({ rankCriteria: criteria });
  };


  onAdd() {
    if (!this.state.name || !this.state.location) {
      alert('Please provide a valid business name and the general location');
    } else {
      fetch('/api/getBusinessDetails/' + this.state.name + '/' + this.state.location)
        .then(res => res.json())
        .then(function(businessDetails) {
          if (businessDetails.business_not_found) {
            alert('Business was not found');
          } else if (businessDetails.id in this.state.businessIds) {
            alert('Business was already added');
          } else{
            var businessList = this.state.businessList;
            var businessIds = this.state.businessIds;
            businessList.push(businessDetails);
            businessIds[businessDetails.id] = true;
            this.setState({ businessList: businessList });
            this.setState({ businessIds: businessIds });
            console.log('Added ' + businessDetails.id + ': ');
            console.log(businessDetails);
          }
        }.bind(this));
    }
  }

  onRank() {
    if (this.state.businessList.length == 0) {
      alert('No businesses have been added');
    } else {
      fetch('/api/rankBusinesses/' + JSON.stringify(this.state.businessList) + '/' + this.state.rankCriteria)
        .then(res => res.json())
        .then(function(businessList) {
          this.setState({ businessList: businessList });
        }.bind(this));
    }
  }

  onRemove(i) {
    var businessList = this.state.businessList;
    var businessIds = this.state.businessIds;
    delete businessIds[businessList[i].id]
    businessList.splice(i, 1);
    this.setState({ businessList: businessList });
    this.setState({ businessIds: businessIds });
  }

  render() {
    return (
      <div>
        <AppBar position='static' color='primary'>
          <Toolbar>
            <div>
              <Typography variant='title' color='inherit'>
                 COMPARANK
              </Typography>
              <Typography color='inherit'>
                 Powered by Yelp-Fusion
              </Typography>
            </div>
          </Toolbar>
        </AppBar>
        <br/>
        <br/>
        <div>
          <Input onChange={this.handleChangeName.bind(this)} autoFocus={true} placeholder='Name of Business'/>
          <br/>
          <br/>
          <Input onChange={this.handleChangeLocation.bind(this)} autoFocus={true} placeholder='City, State, or Zip'/>
          <br/>
          <br/>
          <Button variant='contained' color='primary' onClick={this.onAdd.bind(this)}>
              Add to List
          </Button>
        </div>
        <br/>
        <br/>
        <RankingCriteriaCheckList handleChange={this.handleChangeCriteria.bind(this)}/>
        <br/>
        <Button variant='contained' color='secondary' onClick={this.onRank.bind(this)}>
            Rank Businesses
        </Button>
        <br/>
        <br/>
        {
          this.state.businessList.map(function(businessDetails, i) {
            return (
              <div>
                <BusinessInfoPanel businessDetails={businessDetails} key={i}/>
                <Button variant='contained' color='default' onClick={this.onRemove.bind(this, i)}>
                    Remove
                </Button>
              </div>
            )
          }.bind(this))
        }
      </div>
    );
  }
}
