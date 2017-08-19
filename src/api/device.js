import fetch from 'utils/fetch';

export function getDeviceList(requestParams) {
  const getParams = new URLSearchParams();
  getParams.append('params', JSON.stringify(requestParams));
  return fetch({
    url: '/fcp/device/list',
    method: 'get',
    params: getParams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function getDeviceDataList(requestParams) {
  const getParams = new URLSearchParams();
  getParams.append('params', JSON.stringify(requestParams));
  return fetch({
    url: '/fcp/device/list',
    method: 'get',
    params: getParams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function saveDevice(oldValue, newValue) {
  const updateparams = {
    tag: oldValue,
    obj: newValue
  }
  const postparams = new URLSearchParams();
  postparams.append('params', JSON.stringify(updateparams));
  postparams.append('_method', 'put');
  return fetch({
    url: '/fcp/device',
    method: 'post',
    data: postparams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function addDevice(device) {
  const postparams = new URLSearchParams();
  postparams.append('params', JSON.stringify(device));
  return fetch({
    url: '/fcp/device',
    method: 'post',
    data: postparams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function saveDeviceAlarmPhone(device) {
  const postparams = {
    params: JSON.stringify(device)
  };
  return fetch({
    url: '/fcp/device/alarmPhone',
    method: 'post',
    params: postparams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}