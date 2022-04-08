// Initialize Config
const authorizedUsers = require('../config/authorizedUsers');
const linkedGroups = require('../config/linkedGroups');
const validHashtags = require('../config/validHashtags');
const { postGroup, postComment } = require('../helper/graphAPI');

// Posts already shared
let sharedPosts = [];

// Process Post
const processPost = (body) => {
    // Process Group Hashtag Entry
    if (body.object === 'group'
     && body.entry[0].changes[0].value.message_tags
     && body.entry[0].changes[0].value.verb === 'add'
     && authorizedUsers.includes(body.entry[0].changes[0].value.from.id
        )) {
        console.log("valid hashtag received");
        if (!validHashtags.includes(body.entry[0].changes[0].value.message_tags[0].name.toLowerCase())) {
            console.log("invalid hashtag");
            return;
        }
        linkedGroups.forEach(linkedGroup => {
            console.log("linked group: " + linkedGroup);
            if (!sharedPosts.includes(body.entry[0].id)) {
                let result = postGroup("Sharing for your visibility!", body.entry[0].changes[0].value.permalink_url, linkedGroup)
                if (result) {
                    sharedPosts.push(body.entry[0].id);
                    console.log("element added to the array");
                    postComment(`Thanks for sharing @[${body.entry[0].changes[0].value.from.id}]!`, body.entry[0].changes[0].value.post_id);
                }
            }
            else {
                console.log("post already reposted");
            }
        });
    }
}

// Export call
module.exports = {
    processPost
};
