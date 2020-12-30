require("dotenv").config();
import { response } from "express";
import request from "request";
import homepageService from "./homepageService";
import templateMessage from "./templateMessage";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let sendMessageWelcomeUser = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await homepageService.getFacebookUsername(sender_psid);

            let response1 = {
                "text": `Xin chào ${username}! Đây là Chatbot (trả lời tự động) của tình nguyện viên, phục vụ cứu trợ miền Trung`
            };

            let response2 = {
                "text": "Vui lòng lựa chọn hoặc trả lời những câu hỏi dưới đây."
            };

            let response3 = {

                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": "Bạn thuộc đối tượng nào ?",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Người cần hỗ trợ,...",
                                    "payload": "canhotro",
                                },
                                {
                                    "type": "postback",
                                    "title": "Người muốn tình nguyện,...",
                                    "payload": "muontinhnguyen",
                                }
                            ]
                        },

                    }
            };
            
            await sendMessage(sender_psid, response1);
            await sendMessage(sender_psid, response2);
            await sendMessage(sender_psid, response3);
            resolve("done");
            console.log(response3)


        } catch (e) {
            reject(e);
        }
    })
};

let sendMessage = (sender_psid, response) => {
    return new Promise(async (resolve, reject) => {
        try {
            await homepageService.markMessageRead(sender_psid);
            await homepageService.sendTypingOn(sender_psid);
            // Construct the message body
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('message sent!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};
let takeControlConversation = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            // Construct the message body
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "metadata": "Pass this conversation from page inbox to the bot - primary app"
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/take_thread_control",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, async (err, res, body) => {
                if (!err) {
                    //send messages
                    await sendMessage(sender_psid, { "text": "The super bot came back !!!" });
                    await backToMainMenu(sender_psid);
                    resolve('message sent!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    sendMessage: sendMessage,
    sendMessageWelcomeUser: sendMessageWelcomeUser,
    takeControlConversation: takeControlConversation,
};