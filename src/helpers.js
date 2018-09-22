// Grabs Anonymous token from Reddit
export default function fetchAnonymousToken() {
  const form = new FormData();
  form.set('grant_type', 'https://oauth.reddit.com/grants/installed_client');
  form.set('device_id', 'DO_NOT_TRACK_THIS_DEVICE');
  return fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'post',
    body: form,
    headers: {
      authorization: `Basic ${btoa('0Ry1TaKGFLtP5Q:')}`,
    },
    credentials: 'omit',
  })
    .then(response => response.text())
    .then(JSON.parse)
    .then(tokenInfo => tokenInfo.access_token);
}
