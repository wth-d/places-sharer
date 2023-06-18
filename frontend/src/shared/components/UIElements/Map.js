import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
  const mapRef = useRef();

  // const { center, zoom } = props; // destructuring

  useEffect(() => {
    // a constructor
    const map = new window.google.maps.Map(mapRef.current, {
      center: props.center,
      zoom: props.zoom,
    });
    // tells Google map to render the map at the location pointed to by mapRef.current;
    // (If without VPN: "window.google" may be undefined;)

    // create a new marker at center of the map
    new window.google.maps.Marker({ position: props.center, map: map });
  }, [props.center, props.zoom]);
  // or just center/zoom...
  
  return <div ref={mapRef} className={`map ${props.className}`} style={props.style}></div>;
};

export default Map;
