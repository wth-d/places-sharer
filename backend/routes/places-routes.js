const express = require('express');

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p2",
    title: "Robarts Library #2",
    description: "The largest library in Canada - for p2.",
    imageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipPogTV20XRMlrjVPtlyOG5p9oeYcziXBYo_WEBf=s1360-w1360-h1020",
    address: "130 St George St, Toronto, ON, M5S 1A5",
    location: {
      lat: 43.6645012,
      lng: -79.4084233,
    },
    creator: "u2",
  },
  {
    id: "p1",
    title: "Robarts Library",
    description: "The largest library in Canada.",
    imageUrl:
      "https://onesearch.library.utoronto.ca/sites/default/public/styles/max_650x650/public/libraryphotos/robarts-library_0.jpg?itok=Ud4zhDLg",
    address: "130 St George St, Toronto, ON, M5S 1A5",
    location: {
      lat: 43.6645012,
      lng: -79.4084233,
    },
    creator: "u1",
  },
];


router.get('/:pId', (req, res, next) => {
  console.log("GET / request in Places");
  const placeId = req.params.pId; // req.params gives: { pId: 'p1' }
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  res.json({ place: place });
});

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;
  const places = [];
  for (let place of DUMMY_PLACES) {
    if (place.creator === userId) {
      places.push(place);
    }
  }
  res.json({ places: places });
});

module.exports = router; // export the router object
