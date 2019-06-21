import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%`, width: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  console.log(props)
  const warPoints = props.wars.map(war => {
    let warName = war.lat.value+','+war.lng.value
    let radius = '250'
    let latlng = war.lat.value+','+war.lng.value+','+radius
    return (
       <Marker position={{ lat: parseFloat(war.lat.value), lng: parseFloat(war.lng.value) }}
       onClick={props.onMarkerClick.bind(this,latlng,radius,warName)} />
     )})

  return (
    <GoogleMap
      defaultZoom={3}
      defaultCenter={{ lat: 25, lng: 25 }}
    >
    {props.isMarkerShown && warPoints}

    </GoogleMap>
  )
}
);


export default MyMapComponent;
