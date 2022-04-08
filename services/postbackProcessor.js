// Initialize Config
const { sendGIFChatMessage, sendFileChatMessage,
sendQuickReplyChatMessage, sendTypingChatMessage, sendTextChatMessage, sendAttachmentMessage } = require('../helper/graphAPI');
const providedAnswer = require('../payloads/providedAnswer');
const chatStates = require('../config/chatStates');
const { getConversationState, setConversationState } = require('./storageProcessor');
const chatAnswers = require('../config/chatAnswers');

// Process Message
const processPostback = async (body) => {

    // console.log('postback received');
    const recipient = body.entry[0].messaging[0].sender.id;
    // console.log(recipient);

    // Retrieve Conversation State
    let conversationState = await getConversationState(recipient);
    console.log(conversationState);

    await sendTypingChatMessage(recipient)
    await sendTextChatMessage("One moment please...", recipient);
    await sendTypingChatMessage(recipient)
    // await sendGIFChatMessage(recipient);
    // await sendTypingChatMessage(recipient)
    // await sendFileChatMessage(recipient)
    await sendTextChatMessage(chatAnswers.DEFAULT_ANSWER, recipient);
    await sendTypingChatMessage(recipient)
    // await sendQuickReplyChatMessage(recipient);
    await sendAttachmentMessage(recipient, providedAnswer);

    // Update Conversation State
    await setConversationState(recipient, chatStates.QUESTION_ANSWERED);
}

// Export call
module.exports = {
    processPostback
};
