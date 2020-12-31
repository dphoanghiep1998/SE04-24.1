require("dotenv").config();
import request from "request";
import homepageService from "../services/homepageService";
import chatbotService from "../services/chatbotService";



const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

var arr = {};

var tt = 0;


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
  let response1 = {
    "text": "bot không nhận diện được, xin nhập lại"
  };

  if (received_message.text) {

    let objIntent = received_message.nlp.intents[0];

    let objEntity = Object.values(received_message.nlp.entities)[0][0];


    let intentName = ''
    let intentConf = 0

    if (received_message.text === "Làm mới hội thoại") {
      await chatbotService.sendMessageWelcomeUser(sender_psid);
      arr[sender_psid] = [];
    }
    if (objIntent) {
      intentName = objIntent.name;
      intentConf = objIntent.confidence;
    }
    if (intentName === 'spam' && intentConf >= 0.7) {
      response = {
        "text": "Bot không hiểu bạn định nói gì/n Hãy nhập lại"
      }
    }
    else if (intentName === 'greet' && intentConf >= 0.7) {
      await chatbotService.sendMessageWelcomeUser(sender_psid);
    }
    else {
      if (tt == 1) {

        if (!arr[sender_psid][1]) {

          if (objEntity && objEntity.name === "ho_ten") {
            arr[sender_psid].push(objEntity.value);
            response = {
              "text": "Xin cho biết ngày tháng năm sinh của bạn (vd 23/12/1998)"
            }
            await chatbotService.sendMessage(sender_psid, response);
          }
          else {

            await chatbotService.sendMessage(sender_psid, response1);
          }

        }
        else if (!arr[sender_psid][2]) {

          if (objEntity && objEntity.name === "wit$datetime") {
            arr[sender_psid].push(objEntity.value);
            response = {
              "text": "Số căn cước / CMND ví dụ (187238484) ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          } else {

            await chatbotService.sendMessage(sender_psid, response1);
          }
        }
        else if (!arr[sender_psid][3]) {


          if (objEntity && objEntity.name === "wit$number" || objEntity.name === "wit$phone_number") {
            arr[sender_psid].push(objEntity.value);
            response = {
              "text": "Quê quán (ví dụ số 10, ngách 23, quận 8, TPHCM )?"
            }
            await chatbotService.sendMessage(sender_psid, response);

          } else {

            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (!arr[sender_psid][4]) {

          if (objEntity && objEntity.name === "dia_diem") {
            arr[sender_psid].push(objEntity.value);
            response = {
              "text": "Số điện thoại liên lạc của bạn là gì ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          } else {

            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (!arr[sender_psid][5]) {

          if (objEntity && objEntity.name === "wit$phone_number") {
            arr[sender_psid].push(objEntity.value);
            response = {
              "text": "Mức độ khẩn cấp về tình hình hiện tại ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          } else {

            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (!arr[sender_psid][6]) {

          if (objEntity && objEntity.name === "tinh_trang") {
            arr[sender_psid].push(objEntity.value);
            response = {
              "text": "Ví trí hiện tại của bạn ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          } else {
            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (arr[sender_psid][7]==null) {

          if (objEntity && objEntity.name === "dia_diem") {
            arr[sender_psid].push(objEntity.value);
            response = {
              "text": "Bạn có cần giúp đỡ về lương thực không ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          }

          else {
            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (arr[sender_psid][8]==null) {

          if (objEntity && objEntity.name === "dong_y") {
            arr[sender_psid].push(1);
            response = {
              "text": "Bạn có cần giúp đỡ về y tế không ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          } else if (objEntity && objEntity.name === "tu_choi") {
            arr[sender_psid].push(0);
            response = {
              "text": "Bạn có cần giúp đỡ về y tế không ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          }
          else {
            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (arr[sender_psid][9]==null) {

          if (objEntity && objEntity.name === "dong_y") {
            arr[sender_psid].push(1);
            response = {
              "text": "Bạn có cần giúp đỡ về nước uống không ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          } else if (objEntity && objEntity.name === "tu_choi") {
            arr[sender_psid].push(0);
            response = {
              "text": "Bạn có cần giúp đỡ về nước uống không ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          }
          else {
            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (arr[sender_psid][10]==null) {

          if (objEntity && objEntity.name === "dong_y") {
            arr[sender_psid].push(1);
            response = {
              "text": "Bạn có cần giúp đỡ về nơi ở không ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          } else if (objEntity && objEntity.name === "tu_choi") {
            arr[sender_psid].push(0);
            response = {
              "text": "Bạn có cần giúp đỡ về nơi ở không ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          }
          else {
            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (arr[sender_psid][11]==null) {

          if (objEntity && objEntity.name === "dong_y") {
            arr[sender_psid].push(1);
            response = {
              "text": "Bạn có cần giúp đỡ về tiền mặt không ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          } else if (objEntity && objEntity.name === "tu_choi") {
            arr[sender_psid].push(0);
            response = {
              "text": "Bạn có cần giúp đỡ về tiền mặt không ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          }
          else {
            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (arr[sender_psid][12]==null) {

          if (objEntity && objEntity.name === "dong_y") {
            arr[sender_psid].push(1);
            response = {
              "text": "Bạn đang ở cùng bao nhiêu người ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          } else if (objEntity && objEntity.name === "tu_choi") {
            arr[sender_psid].push(objEntity.value);
            response = {
              "text": "Bạn đang ở cùng bao nhiêu người"
            }
            await chatbotService.sendMessage(sender_psid, response);
          }
          else {
            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (arr[sender_psid][13]==null) {

          if (objEntity && objEntity.name === "wit$number" || objEntity.name === "so_luong") {
            arr[sender_psid].push(objEntity.value);
            response = {
              "text": "Có người bị thương không ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          }
          else {
            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (arr[sender_psid][14]==null) {

          if (objEntity && objEntity.name === "dong_y") {
            arr[sender_psid].push(1);
            response = {
              "text": "Ước tính tổng thiệt hại tài sản (quy đổi ra tiền mặt) ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          } else if (objEntity && objEntity.name === "tu_choi") {
            arr[sender_psid].push(0);
            response = {
              "text": "Ước tính tổng thiệt hại tài sản (quy đổi ra tiền mặt) ?"
            }
            await chatbotService.sendMessage(sender_psid, response);
          }
          else {
            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (arr[sender_psid][15]==null) {
          if (objEntity && objEntity.name === "wit$amount_of_money") {
            arr[sender_psid].push(objEntity.value);
            response = {
              "text": "Bạn có muốn gửi thông tin của mình đến tổ chức cứu trợ cứu nạn thuộc danh sách của chúng tôi không ? \n Gõ 'show org' để hiển thị danh sách"
            }
            await chatbotService.sendMessage(sender_psid, response);
          } else {
            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (arr[sender_psid][16]==null) {
          if (objEntity && objEntity.name === "tu_choi") {
            arr[sender_psid].push(0);
            response = {
              "text": "Bạn muốn cho Page biết thêm thông tin gì, hãy ghi vào dưới nhé ! (Gõ No ) nếu không có !"

            }
            await chatbotService.sendMessage(sender_psid, response);
          } else if (objEntity && objEntity.name === "dong_y") {
            arr[sender_psid].push(1);
            response = {
              "text": "Bạn muốn cho Page biết thêm thông tin gì, hãy ghi vào dưới nhé ! (Gõ No ) nếu không có !"

            }
            await chatbotService.sendMessage(sender_psid, response);
          }
          else {
            await chatbotService.sendMessage(sender_psid, response1);
          }
        } else if (arr[sender_psid][17]==null) {
          if (objEntity && objEntity.name === "tu_choi") {
            arr[sender_psid].push(0);
            mode=0;
            response = {
              "text": "Cảm ơn anh chị đã gửi thông tin, chúng tôi sẽ chuyển thông tin đến các bên liên quan !!!"

            }
            await chatbotService.sendMessage(sender_psid, response);
          } else {
            
            arr[sender_psid].push(received_message);
            mode=0;
            response = {
              "text": "Cảm ơn anh chị đã gửi thông tin, chúng tôi sẽ chuyển thông tin đến các bên liên quan !!!"

            }
            await chatbotService.sendMessage(sender_psid, response);
          }
        }
        console.log("--------------------- " + objEntity.name);
        console.log("Mang " + arr);
      }

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
      arr[sender_psid] = []
      await chatbotService.sendMessageWelcomeUser(sender_psid);
      break;
    case "canhotro":
      tt = 1;
      var text = "cần hỗ trợ";
      response = {
        "text": "Đối với người muốn được hỗ trợ, chúng tôi cần bạn cung cấp thông tin dưới đây"
      }

      await chatbotService.sendMessage(sender_psid, response);
      arr[sender_psid].push(text);
      response = {
        "text": "Họ và tên của bạn là gì (ví dụ Trần Văn Quảng)",
      }
      await chatbotService.sendMessage(sender_psid, response);
      console.log("Mang la" + arr);
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