const fs = require('fs');
const path = './chatData.json';

let chatData = {
  // follow a structure of eventId as key and messages as value
  /*
  E.G. of generated chatData
  {
    "post": {
        "messages": [
            {
                "id": "1743090711563",
                "userId": "3949425a-5c14-4386-b97e-918a685ac154",
                "username": "",
                "content": "test",
                "timestamp": "2025-03-27T15:51:51.563Z"
            },
    }
  }

  */
};

loadData();

function loadData() {
  try {
    chatData = JSON.parse(fs.readFileSync(path));
  } catch (err) {
    chatData = {};
  }
}

function saveData() {
  fs.writeFileSync(path, JSON.stringify(chatData));
}

// generates an id for each messages (used to avoid duplication on initialization)
const generateId = () => Date.now().toString();

module.exports = {
  // Get all messages for an event
  getMessages: (eventId) => {
    loadData();
    if (!chatData[eventId]) {
      chatData[eventId] = { messages: [], attendees: new Set() };
    }
    return chatData;
  },

  // Add a new message to an event
  addMessage: (eventId, message) => {
    if (!chatData[eventId]) {
      chatData[eventId] = { messages: [], attendees: new Set() };
    }

    const newMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date()
    };

    chatData[eventId].messages.push(newMessage);
    saveData();
    return newMessage;
  },

  // Add an attendee to an event
  addAttendee: (eventId, userId) => {
    if (!chatData[eventId]) {
      chatData[eventId] = { messages: [], attendees: new Set() };
    }
    chatData[eventId].attendees.add(userId);
    return chatData[eventId].attendees.size;
  },

  // Remove an attendee from an event
  removeAttendee: (eventId, userId) => {
    if (chatData[eventId]) {
      chatData[eventId].attendees.delete(userId);
      return chatData[eventId].attendees.size;
    }
    return 0;
  },

  getViewerCount: (eventId) => {
    return chatData[eventId] ? chatData[eventId].attendees.size : 0;
  }
};