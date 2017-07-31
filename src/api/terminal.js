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
    method: 'get',
    params: terminalInfo
  });
}