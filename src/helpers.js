// Grabs Anonymous token from Reddit
function fetchAnonymousToken() {
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

export async function createToken() {
  // create token for snoowrap
  const anonymousToken = localStorage.getItem('anonymousToken');
  const time = localStorage.getItem('time');
  const currentTime = Math.round(new Date().getTime() / 1000.0); // Time in epoch
  let token = null;

    // Check if token exist or has expired
    // The time is in epoch time 3600 is one hour
    if (!anonymousToken || currentTime - time > 3600) {
      token = await fetchAnonymousToken();
      localStorage.setItem('anonymousToken', token);
      localStorage.setItem('time', currentTime);
      return token
    }
  return anonymousToken
}

// Checks if url is a photo
export function checkURL(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}