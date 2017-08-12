import fetch from 'utils/fetch';

export function getTerminalList(requestParams) {
  const reqParams = {
    pageSize: requestParams.pageSize || 10,
    pageIndex: requestParams.currentPage || 1
  }
  const getParams = new URLSearchParams();
  getParams.append('params', JSON.stringify(reqParams));
  return fetch({
    url: '/fcp/terminal/list',
    method: 'get',
    params: getParams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function saveTerminal(oldValue, newValue) {
  const updateparams = {
    tag: oldValue,
    obj: newValue
  }
  const postparams = new URLSearchParams();
  postparams.append('params', JSON.stringify(updateparams));
  postparams.append('_method', 'put');
  return fetch({
    url: '/fcp/terminal',
    method: 'post',
    data: postparams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function addTerminal(terminal) {
  const postparams = new URLSearchParams();
  postparams.append('params', JSON.stringify(terminal));
  return fetch({
    url: '/fcp/terminal',
    method: 'post',
    data: postparams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function saveTerminalAlarmPhone(terminal) {
  const alarmPhone = [{
    terminalNo: terminal.no,
    phoneNo: terminal.alarmPhoneNo
  }];
  const terminalInfo = {
    params: JSON.stringify(alarmPhone)
  };
  return fetch({
    url: '/fcp/terminal/alarmPhone',
    method: 'put',
    params: terminalInfo
  });
}