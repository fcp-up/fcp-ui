import fetch from 'utils/fetch';

export function getDeviceList() {
  return fetch({
    url: '/fcp/device/list',
    method: 'get'
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

export function addDevice(terminal) {
  const postparams = new URLSearchParams();
  postparams.append('params', JSON.stringify(terminal));
  return fetch({
    url: '/fcp/device',
    method: 'post',
    data: postparams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// export function saveTerminalAlarmPhone(terminal) {
//   const alarmPhone = [{
//     terminalNo: terminal.no,
//     phoneNo: terminal.alarmPhoneNo
//   }];
//   const terminalInfo = {
//     params: JSON.stringify(alarmPhone)
//   };
//   return fetch({
//     url: '/fcp/terminal/alarmPhone',
//     method: 'put',
//     params: terminalInfo
//   });
// }