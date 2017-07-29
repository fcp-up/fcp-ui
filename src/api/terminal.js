import fetch from 'utils/fetch';

export function getTerminalList() {
  return fetch({
    url: '/fcp/terminal/list',
    method: 'get'
  });
}