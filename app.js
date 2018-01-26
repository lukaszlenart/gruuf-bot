'use strict';

// Imports dependencies and set up http server
const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()), // creates express http server
  register_subscribe_hook = require('./register_subscribe_hook'),
  callToAsidMatching = require('./callToAsidMatching'),
  callUserProfile = require('./callUserProfile'),
  callSendAPI = require('./callSendApi');

// Sets server port and logs message on success
app.listen(process.env.PORT || 8080, () => console.log('webhook is listening'));

// register subscribe confirmation handler
register_subscribe_hook(app);

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(JSON.stringify(webhook_event));

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else {
        handleNonMessage(sender_psid);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

function handleMessage(sender_psid, received_message) {
  callToAsidMatching(sender_psid)
  .catch((err) => {
    console.log(err);
    return {};
  })
  .then((body) => {
    console.log(JSON.stringify(body));

    if (body.data && body.data.length > 0) {
      return callUserProfile(body.data[0].id)
    } else {
      return {}
    }
  })
  .catch((err) => {
    console.log(err);
    return {}
  })
  .then((body) => {
    let response;

    if (received_message.text) {
      if (body.profile) {
        response = handleUserMessage(body, received_message);
      } else {
        response = {
          text: "Please login to the app using Facebook in other case I won't be able to assist you."
        }
      }
    } else {
      response = {
        text: "No message from your side?!?"
      }
    }

    callSendAPI(sender_psid, response);
  });
}

function handleNonMessage(sender_psid) {
  // Create the payload for a basic text message
  let response = {
    "text": 'Sorry but I only support text messages.'
  };
  
  // Sends the response message
  callSendAPI(sender_psid, response);    
}

function handleUserMessage(user_profile, received_message) {
  const is_greeting =
      received_message.nlp.entities.greetings &&
      received_message.nlp.entities.greetings.length > 0 &&
      received_message.nlp.entities.greetings[0].value === 'true';

  const is_show_bikes =
      received_message.nlp.entities.show_bikes &&
      received_message.nlp.entities.show_bikes.length > 0 &&
      received_message.nlp.entities.show_bikes[0].value === 'all';

  if (is_greeting) {
    return {
      text: "Hello " + user_profile.profile.firstName + ", at your service."
    }
  } else if (is_show_bikes) {
    if (user_profile.bikes && user_profile.bikes.length > 0) {
      let bikes = '';
      for (let bike of user_profile.bikes) {
        bikes += "\n- " + bike.name + " (" + bike.metadata.manufacturer + " " + bike.metadata.model + ")"
      }
      return {
        text: "Here is a list of your bikes:" + bikes
      }
    } else {
      return {
        text: "You have no bikes registered, visit the website to add some :)"
      }
    }
  } else {
    return {
      text: "I cannot help you yet " + user_profile.profile.firstName +", please try again later :("
    }
  }

}