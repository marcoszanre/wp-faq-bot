module.exports = {
    "attachment": {
        "type": "template",
        "payload": {
        "template_type": "generic",
        "elements": [
            {
            "title": "What are our plans for RTO?",
            "subtitle": "Tap a button to ask them.",
            "buttons": [
            {
                "type": "postback",
                "title": "Ask",
                "payload": "What are our plans for RTO?"
            }
            ]
            },
            {
            "title": "Where can I book my vacations?",
            "subtitle": "Tap a button to ask.",
            "buttons": [
            {
                "type": "postback",
                "title": "Ask",
                "payload": "Where can I book my vacations?"
            }
            ]
            }
        ]
        }
    }
}
