// Initialize Config
const { sendCarouselChatMessage, sendQuickReplyRatingChatMessage, sendTextChatMessage, sendTypingChatMessage,
    getMemberName,
    sendAttachmentMessage,
    createGroupChatThread,
    renameGroupChatThread,
    sendGroupTypingChatMessage,
    sendGroupTextChatMessage,
    sendGroupAttachmentMessage,
    terminateGroupChatThread} = require('../helper/graphAPI');
const chatStates = require('../config/chatStates');
const questionsAttachment = require('../payloads/questionsAttachment');
const providedAnswer = require('../payloads/providedAnswer');
const { getConversationState, setConversationState, setUserThreadMapping, getUserThreadMappingFromThread, getUserThreadMappingFromUser, clearThreadConversationStateFromThread, clearThreadConversationStateFromUser } = require('./storageProcessor');
const exitRequest = require('../payloads/exitRequest');
const exitRequestGroup = require('../payloads/exitRequestGroup');
const terminateGroupChat = require('../payloads/terminateGroupChat');
const chatAnswers = require('../config/chatAnswers');
const config = require('../config/config');

// Process User Message
const processUserMessage = async (body) => {
    // console.log(JSON.stringify(body));
    const recipient = body.entry[0].messaging[0].sender.id;
    // console.log(recipient);

    // Retrieve Conversation State
    let conversationState = await getConversationState(recipient);
    console.log(conversationState);

    await sendTypingChatMessage(recipient);

    if (body.entry[0].messaging[0].message.quick_reply)
    {
        if (body.entry[0].messaging[0].message.quick_reply.payload)
        {
            switch (body.entry[0].messaging[0].message.quick_reply.payload)
            {
                case 'HELP_NEEDED':
                    await sendTextChatMessage(chatAnswers.BEFORE_EXPERT, recipient);

                    // Update Conversation State
                    await setConversationState(recipient, chatStates.EXPERT_REQUESTED);

                    break;

                case 'ANSWER_OK':
                    await sendTextChatMessage(chatAnswers.ANSWER_OK, recipient);
                    await sendQuickReplyRatingChatMessage(recipient);

                    // Update Conversation State
                    await setConversationState(recipient, chatStates.INITIAL_CONVERSATION);

                    break;

                case 'RATING':
                    await sendTextChatMessage(chatAnswers.THANKS_MESSAGE_1, recipient);

                    // Update Conversation State
                    await setConversationState(recipient, chatStates.INITIAL_CONVERSATION);

                    break;

                case 'EXIT':
                    await sendTextChatMessage(chatAnswers.THANKS_MESSAGE_2, recipient);
                    await sendQuickReplyRatingChatMessage(recipient);

                    // TODO FINISH LOGIC
                    const groupChat = await getUserThreadMappingFromUser(recipient);
                    if (groupChat == false || groupChat == null)
                    {
                        await sendTypingChatMessage(recipient);
                        await sendGroupTextChatMessage(chatAnswers.RESTART_DEMO, recipient);
                    }
                    else
                    {
                        await sendGroupTypingChatMessage(groupChat);
                        await sendGroupTextChatMessage(chatAnswers.CHAT_FINISHED_USER, groupChat);
                        // await sendGroupAttachmentMessage(groupChat, terminateGroupChat);
                    }

                    // Update Conversation State
                    await setConversationState(recipient, chatStates.INITIAL_CONVERSATION);

                    // Clear Conversation From Thread
                    await clearThreadConversationStateFromUser(recipient);

                    break;

                default:
                    await sendTextChatMessage(chatAnswers.DEFAULT_HANDLER, recipient);

                    // Update Conversation State
                    await setConversationState(recipient, chatStates.INITIAL_CONVERSATION);

                    break;
            }
        }
    }
    else
    {
        const senderName = await getMemberName(recipient);
        let replyTxt = "";
        let userMsg = body.entry[0].messaging[0].message.text;
        switch(conversationState)
        {
            case chatStates.INITIAL_CONVERSATION:
                replyTxt = `Hello ${senderName}, here is a list of what I can do.`;
                await sendTextChatMessage(replyTxt, recipient);
                await sendTypingChatMessage(recipient);
                await sendCarouselChatMessage(recipient);
                await sendTypingChatMessage(recipient);
                replyTxt = "Feel free to ask your question and I'll do my best to help you!"
                await sendTextChatMessage(replyTxt, recipient);
                await sendTypingChatMessage(recipient);
                replyTxt = "In addition, here are the top questions of this week."
                await sendTextChatMessage(replyTxt, recipient);
                await sendTypingChatMessage(recipient);
                await sendAttachmentMessage(recipient, questionsAttachment);

                // Update Conversation State
                await setConversationState(recipient, chatStates.AWAITING_QUESTION);

                break;

            case chatStates.AWAITING_QUESTION:
                await sendTypingChatMessage(recipient);
                await sendTextChatMessage(chatAnswers.DEFAULT_WAIT, recipient);
                await sendTypingChatMessage(recipient)
                await sendTextChatMessage(chatAnswers.DEFAULT_ANSWER, recipient);
                await sendTypingChatMessage(recipient)
                await sendAttachmentMessage(recipient, providedAnswer);

                // Update Conversation State
                await setConversationState(recipient, chatStates.QUESTION_ANSWERED);

                break;

            case chatStates.EXPERT_REQUESTED:
                await sendTypingChatMessage(recipient);
                replyTxt = `Thanks ${senderName}, I'll connect you to an expert now.`;
                await sendTextChatMessage(replyTxt, recipient);

                // TODO Connect Expert and update states
                const thread_key = await createGroupChatThread(senderName, userMsg);
                await renameGroupChatThread(thread_key, `${senderName} - FAQ Question`);
                await setUserThreadMapping(recipient, thread_key);

                // Update Conversation State
                await setConversationState(recipient, chatStates.EXPERT_WAITING);

                break;

            case chatStates.EXPERT_WAITING:
                await sendTypingChatMessage(recipient);
                replyTxt = `Thanks ${senderName}, the expert should reply soon.`;
                await sendTextChatMessage(replyTxt, recipient);
                await sendTypingChatMessage(recipient);
                await sendAttachmentMessage(recipient, exitRequest);

                break;

            case chatStates.EXPERT_CONNECTED:
                const groupChat = await getUserThreadMappingFromUser(recipient);

                const finalString = "*User:* " + userMsg;

                if (groupChat == false || groupChat == null)
                {
                    await sendTypingChatMessage(recipient);
                    await sendGroupTextChatMessage(chatAnswers.RESTART_DEMO, recipient);
                }
                else
                {
                    await sendTypingChatMessage(recipient);
                    await sendTextChatMessage(chatAnswers.PROACTIVE_FROM_USER, recipient);
                    await sendGroupTextChatMessage(finalString, groupChat);
                }

                await sendTypingChatMessage(recipient);
                await sendAttachmentMessage(recipient, exitRequest);

                break;

            default:
                replyTxt = `Sorry ${senderName}, still working on it.`;
                await sendTextChatMessage(replyTxt, recipient);
                console.log(chatAnswers.DEFAULT_STATE_HANDLER);

                // Update Conversation State
                await setConversationState(recipient, chatStates.INITIAL_CONVERSATION);
        }
    }
}

// Process Group Message
const processGroupMessage = async (body) => {

    const recipient = body.entry[0].messaging[0].sender.id;
    const thread_key = body.entry[0].messaging[0].thread.id;

    if (body.entry[0].messaging[0].message.quick_reply)
    {
        if (body.entry[0].messaging[0].message.quick_reply.payload)
        {
            switch (body.entry[0].messaging[0].message.quick_reply.payload)
            {
                // case 'TERMINATE':
                //     await sendGroupTypingChatMessage(thread_key);
                //     await sendGroupTextChatMessage("I'm going to terminate this group chat, bye.", thread_key);

                //     await terminateGroupChatThread(thread_key);

                //     break;

                case 'EXIT':
                    await sendGroupTypingChatMessage(thread_key);
                    await sendGroupTextChatMessage(chatAnswers.FINISH_CONVERSATION, thread_key);

                    // Process terminating conversation
                    const userChat = await getUserThreadMappingFromThread(thread_key);
                    if (userChat == false || userChat == null)
                    {
                        await sendGroupTypingChatMessage(thread_key);
                        await sendGroupTextChatMessage(chatAnswers.RESTART_DEMO, thread_key);
                        // await sendGroupAttachmentMessage(thread_key, terminateGroupChat);
                    }
                    else
                    {
                        await sendGroupTypingChatMessage(thread_key);
                        await sendGroupTextChatMessage(chatAnswers.CHAT_FINISHED, thread_key);

                        // await sendGroupAttachmentMessage(thread_key, terminateGroupChat);

                        // Update Conversation State
                        await sendTypingChatMessage(userChat);
                        await sendTextChatMessage(chatAnswers.CHAT_FINISHED_EXPERT, userChat);
                        await sendQuickReplyRatingChatMessage(userChat);
                        await setConversationState(userChat, chatStates.INITIAL_CONVERSATION);

                        // Clear Conversation From Thread
                        await clearThreadConversationStateFromThread(thread_key);
                    }

                    break;

                default:
                    await sendGroupTypingChatMessage(thread_key);
                    await sendGroupTextChatMessage(chatAnswers.DEFAULT_HANDLER, thread_key);

                    break;
            }
        }
    }
    else
    {
        const senderName = await getMemberName(recipient);
        let replyTxt = `Sorry ${senderName}, not implemented yet.`;
        let userMsg = body.entry[0].messaging[0].message.text;

        if (body.entry[0].messaging[0].mentions)
        {
            if (body.entry[0].messaging[0].mentions[0].id === process.env.BOT_ID)
            {
                const msgWithoutMentioning = userMsg.substr(body.entry[0].messaging[0].mentions[0].length);
                const finalString = "*Expert:*" + msgWithoutMentioning;

                // Process mentioned bot
                const userChat = await getUserThreadMappingFromThread(thread_key);
                console.log(userChat);
                if (userChat == null || userChat == false)
                {
                    await sendGroupTypingChatMessage(thread_key);
                    await sendGroupTextChatMessage(chatAnswers.RESTART_DEMO, thread_key);
                    // await sendGroupAttachmentMessage(thread_key, terminateGroupChat);
                }
                else
                {
                    await sendGroupTypingChatMessage(thread_key);
                    await sendGroupTextChatMessage(chatAnswers.PROACTIVE_FROM_THREAD, thread_key);
                    await sendTextChatMessage(finalString, userChat);

                    await sendGroupAttachmentMessage(thread_key, exitRequestGroup);

                    // Update Conversation State
                    await setConversationState(recipient, chatStates.EXPERT_CONNECTED);
                }
            }
        }
        else
        {
            // Process regular group chat message
            console.log(chatAnswers.DEFAULT_NOT_MENTIONED);
        }
    }
}

// Export call
module.exports = {
    processUserMessage,
    processGroupMessage
};
