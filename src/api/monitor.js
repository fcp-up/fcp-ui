import fetch from 'utils/fetch';

export function fetchDeviceList(requestParams) {
  const reqParams = {
    pageSize: requestParams.pageSize || 10000,
    pageIndex: requestParams.currentPage || 1
  }
  const getParams = new URLSearchParams();
  getParams.append('params', JSON.stringify(reqParams));
  return fetch({
    url: '/fcp/device/list',
    method: 'get',
    params: getParams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
