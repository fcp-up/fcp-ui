import fetch from 'utils/fetch';

export function getSessionId() {
  return fetch({
    url: '/fcp/session.js',
    method: 'get'
  });
}
