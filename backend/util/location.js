const axios = require('axios').default;

const HttpError = require('../models/http-error');

// const getCoordinatesForAddress = async function(address) {
//   const apiUrl = "https://geocode.maps.co/search?q=";

//   try {
//     const response = await fetch(apiUrl + encodeURIComponent(address));

//     if (response.ok) {
//       const jsonRes = await response.json();

//       if (!jsonRes || jsonRes.length === 0) {
//         throw new HttpError(
//           "Could not find location for the specified address.",
//           422
//         );
//       }

//       return {
//         lat: jsonRes[0].lat,
//         lng: jsonRes[0].lon
//       };
//     } else {
//       throw new Error("Request to geocoding API failed!");
//     }
//   } catch (networkError) {
//     console.log("network error:", networkError);
//     throw networkError;
//   }

//   // return {
//   //   lat: 40.7484,
//   //   lng: -73.9871
//   // };
// };



const getCoordinatesForAddress = async function(address) {
  const response = await axios.get(
    `https://geocode.maps.co/search?q=${encodeURIComponent(address)}`
  );

  if (response.status >= 200 && response.status <= 299) {
    const data = response.data;

    if (!data || data.length === 0) {
      throw new HttpError(
        "Could not find location for the specified address.",
        422
      );
    }

    console.log(data);
    return {
      lat: data[0].lat,
      lng: data[0].lon
    };
  } else {
    throw new Error("Request to geocoding API failed!");
  }
};

module.exports = getCoordinatesForAddress;
