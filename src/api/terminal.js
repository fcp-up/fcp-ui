import fetch from 'utils/fetch';

export function getTerminalList() {
  return fetch({
    url: '/fcp/terminal/list',
    method: 'get'
  });
}

export function saveTerminal(terminal) {
  const terminalInfo = {
    params: JSON.stringify(terminal)
  };
  return fetch({
    url: '/fcp/terminal',
    method: 'put',
    params: terminalInfo
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
    method: 'post',
    params: terminalInfo
  });
}