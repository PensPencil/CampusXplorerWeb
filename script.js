mapboxgl.accessToken =
  "MAPBOX_ACCESS_TOKEN";
const bounds = [
  [80.034231, 12.815018], // Southwest coordinates
  [80.059444, 12.829497], // Northeast coordinates
];
const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/penspencil/clonefuqe00dn01o434pw7e8e", // style URL
  center: [80.045184, 12.822991], // starting position [lng, lat]
  pitch: 60,
  bearing: 45,
  zoom: 16, // starting zoom
  maxBounds: bounds,
});

map.addControl(
  new MapboxDirections({
    accessToken: mapboxgl.accessToken,
  }),
  "top-left"
);
map.on("load", () => {
  map.addSource("custom-buildings", {
    type: "vector",
    url: "mapbox://penspencil.65oprw7o",
  });

  map.addLayer({
    id: "custom-buildings",
    type: "fill-extrusion",
    source: "custom-buildings",
    "source-layer": "building-bc07ze",
    paint: {
      "fill-extrusion-color": "#aaa",
      "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-base": 0,
      "fill-extrusion-opacity": 0.6,
    },
  });
});
map.on("load", () => {
  map.addSource("places", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            description:
              '<img src="ub.png" alt="University Building"><p>University Building</p>',
          },
          geometry: {
            type: "Point",
            coordinates: [80.04214639609157, 12.823295570315647],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<img src="tp.png" alt="University Building"><p>Tech Park</p>',
          },
          geometry: {
            type: "Point",
            coordinates: [80.04515546452645, 12.824872112492155],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<img src="biotech.png" alt="University Building"><p>Bio Tech Block</p>',
          },
          geometry: {
            type: "Point",
            coordinates: [80.043923, 12.824685],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<img src="cv.png" alt="University Building"><p>CV Raman Research Park</p>',
          },
          geometry: {
            type: "Point",
            coordinates: [80.0443, 12.824997],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<img src="arch.png" alt="University Building"><p>SRM Architecture Block</p>',
          },
          geometry: {
            type: "Point",
            coordinates: [80.04390078872697, 12.824023053370032],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<img src="belab.png" alt="University Building"><p>Basic Engineering Lab</p>',
          },
          geometry: {
            type: "Point",
            coordinates: [80.043507, 12.823404],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<img src="tpg.png" alt="University Building"><p>TP Ganeshan Auditorium</p>',
          },
          geometry: {
            type: "Point",
            coordinates: [80.04655411555366, 12.824717350002222],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<img src="hos.png" alt="University Building"><p>SRM Global Hospital</p>',
          },
          geometry: {
            type: "Point",
            coordinates: [80.04869827155176, 12.82279992169503],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<img src="fab.png" alt="University Building"><p>SRM Fablab</p>',
          },
          geometry: {
            type: "Point",
            coordinates: [80.045773, 12.822379],
          },
        },
      ],
    },
  });
  // Add a layer showing the places.
  map.addLayer({
    id: "places",
    type: "circle",
    source: "places",
    paint: {
      "circle-color": "#4264fb",
      "circle-radius": 6,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on("mouseenter", "places", (e) => {
    map.getCanvas().style.cursor = "pointer";

    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    const popupContent = document.createElement("div");
    popupContent.innerHTML = description;

    const images = popupContent.getElementsByTagName("img");
    for (const img of images) {
      img.src = `css/${img.getAttribute("src")}`;
    }

    popup.setLngLat(coordinates).setDOMContent(popupContent).addTo(map);
  });

  map.on("mouseleave", "places", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
});
map.on("mouseleave", "places", () => {
  // Reset the cursor style and remove the popup on mouseleave
  map.getCanvas().style.cursor = "";
  popup.remove();
});

const placesSearchInput = document.getElementById("places-search");

const placesAutocomplete = new google.maps.places.Autocomplete(
  placesSearchInput
);

placesAutocomplete.addListener("place_changed", () => {
  const place = placesAutocomplete.getPlace();

  if (!place.geometry) {
    console.error("Place selection did not return geometry");
    return;
  }

  // Get the coordinates of the selected place
  const { lat, lng } = place.geometry.location;

  // Center the map on the selected place
  map.flyTo({
    center: [lng(), lat()],
    zoom: 18, // Adjust the zoom level as needed
    essential: true, // This animation is considered essential with respect to prefers-reduced-motion
  }); // You can also add additional logic here based on the selected place
});
