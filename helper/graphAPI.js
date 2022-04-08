// Initial Config
const axios = require('axios').default;
const apiKey = process.env.ACCESS_TOKEN;
const config = {
    headers: {
        Authorization: `Bearer ${apiKey}`
    }
};
const scimEndpoint = "https://scim.workplace.com/Users";
const graphEndpoint = "https://graph.facebook.com";

// Post to group
const postGroup = async (content, link, groupId) => {
    const contentBody = {
        "message": content,
        "link": link
    }
    const res = await axios.post(
        `${graphEndpoint}/${groupId}/feed`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("content was posted successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Comment a post
const postComment = async (content, postId) => {
    const contentBody = {
        "message": content
    }
    const res = await axios.post(
        `${graphEndpoint}/${postId}/comments`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("comment was posted successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Send carousel chat message
const sendCarouselChatMessage = async (recipient) => {
    const contentBody = {
        "recipient": {
            "id": recipient
          },
          "message": {
            "attachment": {
              "type": "template",
              "payload": {
              "template_type": "generic",
              "elements": [
                  {
                  "title": "Get your questions answered",
                  "subtitle": "Knowledge base mode on 📚",
                  "image_url": "https://storagemvbz.blob.core.windows.net/images/HR.png"
                  },
                  {
                  "title": "Connect with experts",
                  "subtitle": "We got you covered 👍",
                  "image_url": "https://storagemvbz.blob.core.windows.net/images/Experts.png"
                  },
                  {
                  "title": "Provide feeback",
                  "subtitle": "Help us improve 🔝",
                  "image_url": "https://storagemvbz.blob.core.windows.net/images/Feedback.png"
                  }
                  ]
              }
            }
        }
    }
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("message was sent successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Send GIF message
const sendGIFChatMessage = async (recipient) => {
    const contentBody = {
        "recipient": {
            "id": recipient
          },
          "message":{
            "attachment":{
              "type":"image",
              "payload":{
                "url":"https://storagemvbz.blob.core.windows.net/images/OKAY.gif",
                "is_reusable":true
              }
            }
          }
    }
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("message was send successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Send Text message
const sendTextChatMessage = async (content, recipient) => {
    const contentBody = {
        "recipient": {
            "id": recipient
          },
          "message":{
            "text": `${content}`
          }
    }
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("message was sent successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Send Text message
const sendGroupTextChatMessage = async (content, thread_key) => {
    const contentBody = {
        "recipient": {
            "thread_key": thread_key
          },
          "message":{
            "text": `${content}`
          }
    }
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("message was sent successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Send File message
const sendFileChatMessage = async (recipient) => {
    const contentBody = {
        "recipient": {
            "id": recipient
          },
          "message":{
            "attachment":{
              "type":"file",
              "payload":{
                "url":"https://storagemvbz.blob.core.windows.net/images/FOX_FABRICS_PAYROLL.docx",
                "is_reusable":true
              }
            }
        }
    }
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("message was sent successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Send Attachment message
const sendGroupAttachmentMessage = async (thread_key, attachment) => {
    const contentBody = {
        "recipient": {
            "thread_key": thread_key
        },
        "message": attachment
    }
    // console.log(JSON.stringify(contentBody));
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("message was sent successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Send Attachment message
const sendAttachmentMessage = async (recipient, attachment) => {
    const contentBody = {
        "recipient": {
            "id": recipient
        },
        "message": attachment
    }
    // console.log(JSON.stringify(contentBody));
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("message was sent successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Send Typing
const sendTypingChatMessage = async (recipient) => {
    const contentBody = {
        "recipient": {
            "id": recipient
          },
          "sender_action":"typing_on"
    }
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("user typing was sent successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Send Quick Replies
const sendQuickReplyChatMessage = async (recipient) => {
    const contentBody = {
        "recipient": {
            "id": recipient
          },
          "message": {
            "text": "Existe algo mais em que eu possa ajudar hoje?",
            "quick_replies":[
              {
                "content_type":"text",
                "title":"Sim",
                "payload":"HELP_NEEDED"
              },{
                "content_type":"text",
                "title":"Não",
                "payload":"HELP_NEEDED"
              }
          ]
        }
    }
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("message was sent successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Send Rating Quiz
const sendQuickReplyRatingChatMessage = async (recipient) => {
    const contentBody = {
        "recipient": {
            "id": recipient
          },
          "message": {
            "text": "How would you rate my service today?",
            "quick_replies":[
              {
                "content_type":"text",
                "title":"1",
                "payload":"RATING"
              },
              {
                "content_type":"text",
                "title":"2",
                "payload":"RATING"
              },
              {
                "content_type":"text",
                "title":"3",
                "payload":"RATING"
              },
              {
                "content_type":"text",
                "title":"4",
                "payload":"RATING"
              },
              {
                "content_type":"text",
                "title":"5",
                "payload":"RATING"
              }
          ]
        }
    }
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("message was sent successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Send Typing
const sendGroupTypingChatMessage = async (thread_key) => {
    const contentBody = {
        "recipient": {
            "thread_key": thread_key
          },
          "sender_action":"typing_on"
    }
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("group chat typing was sent successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Create Group Chat Thread
const createGroupChatThread = async (userName, question) => {
    const membersArray = await getGroupMembers(process.env.GROUP_ID);
    const contentBody = {
        "recipient": {
          "ids":
        //   [
        //       "100076451664478",
        //       "100076700204135"
        //   ]
        membersArray
        },
        "message": {
            "text": `Hi everyone, I'm creating this thread due to the following question, which was asked by *${userName}*:\n\n"${question}"\n\nPlease mention me if you want to reply back to the user.`
        }
    }
    const res = await axios.post(
        `${graphEndpoint}/me/messages`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("thread was created successfully");
        return res.data.thread_key;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Rename Group Chat Thread
const renameGroupChatThread = async (thread_id, name) => {
    const contentBody = {
        "name": name
      }
    const res = await axios.post(
        `${graphEndpoint}/${thread_id}/threadname`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("thread was created successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Terminate Group Chat
const terminateGroupChatThread = async (thread_id) => {
    const contentBody = {
        "to": [
            "100076451664478",
            "100076700204135"
        ]
    }
    const res = await axios.delete(
        `${graphEndpoint}/${thread_id}/participants`,
        contentBody,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("thread was removed successfully");
        return true;
    }
    if (res.status == 400) {
        // Post was created successfully
        console.log("thread was removed successfully");
        return true;
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Get member name
const getMemberName = async (recipient) => {
    const res = await axios.get(
        `${graphEndpoint}/${recipient}?fields=name`,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("message was sent successfully");
        console.log(res.data.name);
        if (res.data.name) {
            return res.data.name;
        }
        else
        {
            return "Unknown User";
        }
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Get group members
const getGroupMembers = async (groupID) => {
    const res = await axios.get(
        `${graphEndpoint}/${groupID}/members?fields=id`,
        config
    );
    if (res.status == 200) {
        // Post was created successfully
        console.log("group members were retrieved successfully");
        if (res.data.data) {
            let membersArray = []
            res.data.data.forEach(member => {
                membersArray.push(member.id);
            });
            // console.log(membersArray);
            return membersArray;
        }
        else
        {
            return "Unknown Error";
        }
    }
    else {
        // Post wasn't created yet
        console.log("an error happened");
        return false;
    }
}

// Export call
module.exports = {
    postGroup,
    postComment,
    sendGIFChatMessage,
    sendCarouselChatMessage,
    sendFileChatMessage,
    sendQuickReplyChatMessage,
    sendQuickReplyRatingChatMessage,
    sendTextChatMessage,
    sendTypingChatMessage,
    getMemberName,
    sendAttachmentMessage,
    createGroupChatThread,
    renameGroupChatThread,
    sendGroupTextChatMessage,
    sendGroupTypingChatMessage,
    sendGroupAttachmentMessage,
    terminateGroupChatThread,
    getGroupMembers
};
