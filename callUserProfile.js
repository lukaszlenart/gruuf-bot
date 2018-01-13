'use strict';

const
  request = require('request-promise'),
  HOST_URL = process.env.GRUUF_BOT_HOST_URL,
  VERIFY_TOKEN = process.env.GRUUF_FACEBOOK_VERIFY_TOKEN;

function callUserProfile(asid) {
  // Send the HTTP request to the Gruuf App to fetch matching user profile
  return request({
    uri: HOST_URL + "/api/user-profile",
    qs: {
      asid: asid,
      verifyToken: VERIFY_TOKEN
    },
    method: "GET",
    headers: {
      'User-Agent': 'GruufBot'
    },
    json: true
  })
  .then((body) => {
    console.log(JSON.stringify(body));
    return body
  })
}

module.exports = callUserProfile;
