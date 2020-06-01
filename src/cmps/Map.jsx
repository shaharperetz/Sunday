import React, { Component, useState } from "react";
import { connect } from "react-redux";
import {
  GoogleMap,
  Marker,
  withScriptjs,
  withGoogleMap,
} from "react-google-maps";
import UserService from "../services/UserService";
import { useEffect } from "react";
import { compose, withProps } from "recompose";
import { loadUsers, setUser } from '../actions/UserActions.js';
const API_KEY = "AIzaSyA61EAVmAo2YECcoYMVz_hJITa6l67Mm1E";
// const API_KEY='AIzaSyA4SHtEoWU34-H_zLBuEhO6BMYDakaQV5g'

const MyMapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100vh`, width: `50vw` }} />,
    containerElement: <div style={{ height: `400px`, width: `50vw` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
  )((props) => (
    
    <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: 32.0853, lng: 34.7818 }}
    onClick={(event) => {
      props.setMarkers({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        
      });
    }}
  >
  
    {props.user.profile && <Marker position={{ lat: props.user.profile.location.lat, lng: props.user.profile.location.lng }}></Marker>}
    {/* {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} onClick={props.onMarkerClick} />} */}
  </GoogleMap>
));

// const WrappedMap = withScriptjs(withGoogleMap(Map))

class WrappedMap extends React.PureComponent {
  state = {
    isMarkerShown: false,
    user:null
  };
  componentDidMount() {
    this.loadUser();
  }
  componentDidUpdate(){
    const user = this.props.user
    this.setState({ user })
  }
  loadUser = async () => {
    let user = this.props.user
    this.setState({ user })
}

  setMarkers = async(data) => {
    console.log("WrappedMap -> onClick -> data", data);
    const user = this.props.user
    user.profile.location = data
    const updatedUser= await UserService.update(user)
    this.setState({ user })

  };
  

  render() {
    return (
      <MyMapComponent
        // isMarkerShown={this.state.isMarkerShown}
        // onMarkerClick={this.handleMarkerClick}
        user={this.state.user}
        setMarkers={this.setMarkers}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.loggedInUser,
});

const mapDispatchToProps = {
  loadUsers,
  setUser
};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedMap);
