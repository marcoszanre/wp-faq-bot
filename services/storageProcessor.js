// Initialize Config
const chatStates = require("../config/chatStates");

// Conversation State
let conversation_state = {};
let user_thread_mapping = {};
let thread_user_mapping = {};

const setConversationState = async (sender_id, state) => {
    conversation_state[sender_id] = state;
    console.log(`Conversation state ${conversation_state[sender_id]} set for user ${sender_id}`);
}

const setUserThreadMapping = async (user, thread) => {
    user_thread_mapping[user] = thread;
    thread_user_mapping[thread] = user;
    console.log(`UserThreadMapping set for user ${user} and thread ${thread}`);
}

const getUserThreadMappingFromUser = async (user) => {
    if (user_thread_mapping.hasOwnProperty(`${user}`))
    {
        console.log(`Got UserThread for ${user_thread_mapping[user]} for the user ${user}`);
        return user_thread_mapping[user]
    }
    else
    {
        console.log("Sorry, couldn't find anything here.");
        return false;
    }
}

const getUserThreadMappingFromThread = async (thread) => {
    if (thread_user_mapping.hasOwnProperty(`${thread}`))
    {
        console.log(`Got UserThread for ${thread_user_mapping[thread]} for the thread ${thread}`);
        return thread_user_mapping[thread]
    }
    else
    {
        console.log("Sorry, couldn't find anything here.");
        return false;
    }
}

const clearThreadConversationStateFromUser = async (user) => {
    if (user_thread_mapping.hasOwnProperty(`${user}`))
    {
        const thread = user_thread_mapping[user]
        user_thread_mapping[user] = null;
        if (thread_user_mapping.hasOwnProperty(`${thread}`))
        {
            thread_user_mapping[thread] = null;
        }
    }
    console.log(`UserThread deleted`);
}

const clearThreadConversationStateFromThread = async (thread) => {
    if (thread_user_mapping.hasOwnProperty(`${thread}`))
    {
        const user = thread_user_mapping[thread]
        thread_user_mapping[thread] = null;
        if (user_thread_mapping.hasOwnProperty(`${user}`))
        {
            user_thread_mapping[user] = null;
        }
    }
    console.log(`UserThread deleted`);
}

const clearConversationState = async (sender_id) => {
    conversation_state[sender_id] = null;
}

const getConversationState = async (sender_id) => {
    if (conversation_state.hasOwnProperty(`${sender_id}`))
    {
        console.log(`Got conversation state ${conversation_state[sender_id]} for the user ${sender_id}`);
        return conversation_state[sender_id]
    }
    else
    {
        setConversationState(sender_id, chatStates.INITIAL_CONVERSATION);
        return chatStates.INITIAL_CONVERSATION;
    }
}

const processConversationState = (sender_id) => {
    if (conversation_state[sender_id]) {
        switch(conversation_state[sender_id]) {
        case "FIRST_STATE":
            setConversationState(sender_id, "SECOND_STATE");
            break;
        case "SECOND_STATE":
            clearConversationState(sender_id);
            break;
        }
    }
    else {
        setConversationState(sender_id, "FIRST_STATE");
    }
}

// Exports
module.exports = {
    setConversationState,
    clearConversationState,
    getConversationState,
    setUserThreadMapping,
    getUserThreadMappingFromUser,
    getUserThreadMappingFromThread,
    clearThreadConversationStateFromUser,
    clearThreadConversationStateFromThread
};
