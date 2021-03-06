/* TODO: Fix linting errors */

import React, { Component } from "react";
import MapGL, { NavigationControl, Marker } from "react-map-gl";
import Dimensions from "react-dimensions";
import { css } from "emotion";
import PropTypes from "prop-types";
import createRef from "create-react-ref/lib/createRef";
import Geocoder from "react-map-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaGFja29yZWdvbiIsImEiOiJjamk0MGZhc2cwNDl4M3FsdHAwaG54a3BnIn0.Fq1KA0IUwpeKQlFIoaEn_Q";
const CIVIC_LIGHT = "mapbox://styles/hackoregon/cjiazbo185eib2srytwzleplg";
const CIVIC_DARK = "mapbox://styles/mapbox/dark-v9";

const mapWrapper = css`
  margin: 0 auto;
  padding: 0;
  width: 100%;
  height: 100%;
`;

const navControl = css`
  position: absolute;
  left: 0;
  z-index: 1;
`;

class BaseMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        longitude: props.initialLongitude || -122.6765,
        latitude: props.initialLatitude || 45.5231,
        zoom: props.initialZoom || 9.5,
        minZoom: 6,
        maxZoom: 20,
        pitch: props.initialPitch || 0,
        bearing: 0,
        scrollZoom: true
      },
      tooltipInfo: null,
      x: null,
      y: null,
      mounted: false,
      civicMapStyle: CIVIC_LIGHT
    };
    this.onViewportChange = this.onViewportChange.bind(this);
    this.onHover = this.onHover.bind(this);
    this.mapRef = createRef();
  }

  componentDidMount() {
    // Geocoder requires a ref to the map component
    this.setState({ mounted: true });
  }

  componentWillReceiveProps(props) {
    if (this.props.updateViewport) {
      let updatedViewportProps = {
        zoom: props.initialZoom,
        pitch: props.initialPitch,
        longitude: props.initialLongitude,
        latitude: props.initialLatitude
      };

      // Remove all keys that have null/undefined values to keep defaults
      Object.keys(updatedViewportProps).forEach(key => {
        if (updatedViewportProps[key] == null) {
          delete updatedViewportProps[key];
        }
      });

      this.setState({
        viewport: { ...this.state.viewport, ...updatedViewportProps }
      });
    }

    if (props.civicMapStyle === "light") {
      this.setState({ civicMapStyle: CIVIC_LIGHT });
    } else if (props.civicMapStyle === "dark") {
      this.setState({ civicMapStyle: CIVIC_DARK });
    }
  }

  onHover({ object, x, y }) {
    this.setState({
      tooltipInfo: object,
      x,
      y
    });
  }

  onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  render() {
    const { viewport, tooltipInfo, x, y, mounted } = this.state;

    const {
      height,
      civicMapStyle,
      mapboxToken,
      geocoder,
      locationMarker,
      navigation,
      geocoderOptions,
      geocoderOnChange,
      mapGLOptions,
      children,
      useContainerHeight,
      onBaseMapClick
    } = this.props;

    viewport.width = this.props.containerWidth
      ? this.props.containerWidth
      : 500;
    viewport.height = useContainerHeight
      ? this.props.containerHeight
      : height
      ? height
      : 500;

    const childrenLayers = React.Children.map(children, child => {
      return React.cloneElement(child, {
        viewport,
        tooltipInfo,
        x,
        y,
        onHover: info => this.onHover(info)
      });
    });

    return (
      <div className={mapWrapper}>
        <MapGL
          className="MapGL"
          {...viewport}
          mapStyle={this.state.civicMapStyle}
          mapboxApiAccessToken={mapboxToken}
          onViewportChange={viewport => this.onViewportChange(viewport)}
          ref={this.mapRef}
          {...mapGLOptions}
          onClick={onBaseMapClick}
        >
          <div className={navControl}>
            {navigation && (
              <NavigationControl
                className="NavigationControl"
                onViewportChange={viewport => this.onViewportChange(viewport)}
              />
            )}
          </div>
          {locationMarker && (
            <Marker
              latitude={viewport.latitude}
              longitude={viewport.longitude}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <span role="img" aria-label="star">
                ❌
              </span>
            </Marker>
          )}
          {geocoder && mounted && (
            <Geocoder
              mapRef={{ current: this.mapRef.current }}
              mapboxApiAccessToken={mapboxToken}
              onViewportChange={viewport => {
                this.onViewportChange(viewport);
                !!geocoderOnChange && geocoderOnChange(viewport);
              }}
              options={{ ...geocoderOptions }}
            />
          )}
          {childrenLayers}
        </MapGL>
      </div>
    );
  }
}

BaseMap.propTypes = {
  mapboxToken: PropTypes.string,
  mapboxStyle: PropTypes.string,
  geocoder: PropTypes.bool,
  navigation: PropTypes.bool,
  geocoderOptions: PropTypes.shape({}),
  geocoderOnChange: PropTypes.func,
  mapGLOptions: PropTypes.shape({}),
  children: PropTypes.node,
  useContainerHeight: PropTypes.bool,
  updateViewport: PropTypes.bool
};

BaseMap.defaultProps = {
  mapboxStyle: CIVIC_LIGHT,
  mapboxToken: MAPBOX_TOKEN,
  navigation: true,
  geocoder: false,
  useContainerHeight: false,
  updateViewport: true
};
export default Dimensions()(BaseMap);
