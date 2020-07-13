/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXplZW1oYWlkZXIiLCJhIjoiY2thZWw2enllMDEyZzJ3cXYzdnE2bGgyYiJ9.XIHQ37MDwA7FJ6GSXn5E3w';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/azeemhaider/ckaeljyll1ggm1ipn6h4zgoo3',
  });
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    //add marker
    const el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    new mapboxgl.Popup({
      anchor: 'right',
      offset: 20,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}:${loc.description}</p>`)
      .addTo(map);

    //extends the map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 150,
      left: 300,
      right: 100,
      bottom: 150,
    },
  });
  map.on('load', function () {
    const a = locations.map((loc) => loc.coordinates);
    map
      .addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: a,
          },
        },
      })
      .addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#008',
          'line-width': 3,
        },
      });
  });
};
