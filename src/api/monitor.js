import fetch from 'utils/fetch';

export function fetchDeviceList() {
  return fetch({
    url: '/fcp/device/list',
    method: 'get'
  });
}
