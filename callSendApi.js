'use strict';

const
  request = require('request'),
  PAGE_ACCESS_TOKEN = process.env.GRUUF_FACEBOOK_PAGE_ACCESS_TOKEN,
  APPSECRET_PROOF = process.env.GRUUF_FACEBOOK_APPSECRET_PROOF;

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    messaging_type: "RESPONSE",
    recipient: {
      id: sender_psid
    },
    message: response
  };

  // Send the HTTP request to the Messenger Platform
  request({
    uri: "https://graph.facebook.com/v2.6/me/messages",
    qs: {
      access_token: PAGE_ACCESS_TOKEN,
      appsecret_proof: APPSECRET_PROOF
    },
    method: "POST",
    json: request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent: ' + JSON.stringify(request_body))
    } else {
      console.error("Unable to send message: " + err);
    }
  }); 
}

module.exports = callSendAPI;
