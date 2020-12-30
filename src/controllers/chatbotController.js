require("dotenv").config();
import request from "request";
import homepageService from "../services/homepageService";
import chatbotService from "../services/chatbotService";
import templateMessage from "../services/templateMessage";

// const fasttext = require("fasttext");
//   const path = require('path');

//   const model = path.resolve(__dirname, './traning.txt');
//   const classifier = new fasttext.Classifier(model);
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let message;

var arr = [];

let getHomePage = (req, res) => {
  return res.send("Xin chao");
};




let getWebhook = (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}

let postWebhook = (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {


      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
        message = webhook_event.message;
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}






// Handles messages events
let handleMessage = async (sender_psid, received_message) => {
  let response;
  if (received_message.text){

    let objIntent = received_message.nlp.intents[0];

    let objEntity = Object.values(received_message.nlp.entities)[0][0];
  

    let intentName = ''
    let intentConf = 0
    if(objIntent) {
      intentName = objIntent.name;
      intentConf = objIntent.confidence;
    }
    if (intentName === 'spam' && intentConf >= 0.7){
      response = {
        "text" : "Bot không hiểu bạn định nói gì/n Hãy nhập lại"
      }
    } 
    else if (intentName === 'greet' && intentConf >= 0.7){
      await chatbotService.sendMessageWelcomeUser(sender_psid);
    }
    else if (!arr[1]){
      response = {
        "text" : "Bạn hãy cho biết họ và tên đầy đủ ?"
      }
      await chatbotService.sendMessage(sender_psid,response);
      if (objEntity && objEntity.name === "ho_ten"){
        arr.push(objEntity.value);
      }
      else {
        response = {
          "text" : "bot không nhận diện được, xin nhập lại"
        }
      }
      
      
    }
    else if (!arr[2] && arr[1]){
      response = {
        "text"  : "Xin cho biết ngày tháng năm sinh của bạn (vd 23/12/1998)"
      }
      await chatbotService.sendMessage(sender_psid,response);
      arr[2] = objEntity.value;
    }
    
  }
}


// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch (payload) {
    case "Làm mới hội thoại":
      await chatbotService.sendMessageWelcomeUser(sender_psid);
      break;
    case "canhotro":
      response = {
        "text": "Đối với người muốn được hỗ trợ, chúng tôi cần bạn cung cấp thông tin dưới đây"
      }
      await chatbotService.sendMessage(sender_psid,response);
      arr[0] = "Cần hỗ trợ";

      break;

  }
}




let handleSetupProfile = async (req, res) => {
  try {
    await homepageService.handleSetupProfileAPI();
    return res.redirect("/");
  } catch (e) {
    console.log(e);
  }
};

let getSetupProfilePage = (req, res) => {
  return res.render("profile.ejs");
};






module.exports = {
  getHomePage: getHomePage,
  getWebhook: getWebhook,
  postWebhook: postWebhook,
  handleSetupProfile: handleSetupProfile,
  getSetupProfilePage: getSetupProfilePage,

}