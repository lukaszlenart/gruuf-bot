'use strict';

const
  request = require('request-promise'),
  HOST_URL = process.env.GRUUF_BOT_HOST_URL,
  VERIFY_TOKEN = process.env.GRUUF_FACEBOOK_VERIFY_TOKEN;

function callRegisterMileage(asid, bikeId, mileage, mileage_type) {
  // Send the HTTP request to the Gruuf App to fetch matching user profile
  return request({
    uri: HOST_URL + "/api/register-mileage",
    method: "POST",
    headers: {
      'User-Agent': 'GruufBot'
    },
    body: {
      "verifyToken": VERIFY_TOKEN,
      "asid": asid,
      "payload": {
        "bikeId": bikeId,
        "mileage": mileage,
        "mileageType": mileage_type
      }
    },
    json: true
  })
  .then((body) => {
    console.log(JSON.stringify(body));
    return body
  })
}

module.exports = callRegisterMileage;
