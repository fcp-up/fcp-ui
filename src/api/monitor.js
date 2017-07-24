import fetch from 'utils/fetch';

export function fetchMarkers() {
  return fetch({
    url: '/test/marker.json',
    method: 'get'
  });
}
