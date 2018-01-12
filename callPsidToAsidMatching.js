'use strict';

const
  request = require('request'),
  PAGE_ACCESS_TOKEN = process.env.GRUUF_FACEBOOK_PAGE_ACCESS_TOKEN,
  APPSECRET_PROOF = process.env.GRUUF_FACEBOOK_APPSECRET_PROOF,
  APP_ID = process.env.GRUUF_FACEBOOK_APP_ID;

function callToAsidMatching(psid, response) {
  // Send the HTTP request to the ID Matching
  request({
    "uri": "https://graph.facebook.com/v2.6/" + psid + "/ids_for_apps",
    "qs": {
      "access_token": PAGE_ACCESS_TOKEN,
      "appsecret_proof": APPSECRET_PROOF,
      "app": APP_ID
    },
    "method": "GET"
  }, (err, res, body) => {
    if (err) {
      console.error("Unable to send message:" + err);
    } else {
      console.log('ID matched!');
      console.log(body);
    }
  }); 
}

module.exports = callToAsidMatching;
