const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "1088298445038-r77cabomgatt7t9nubrdpfc9oggqnkah.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    payload = ticket.getPayload();
  } catch (e) {
    console.log(e);
  }
  if (payload) return payload.email;
  else return "";
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}

module.exports = verify;
