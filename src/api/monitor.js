import fetch from 'utils/fetch';

export function fetchDeviceList() {
  return fetch({
    url: '/fcp/terminal/list',
    method: 'get'
  });
}
