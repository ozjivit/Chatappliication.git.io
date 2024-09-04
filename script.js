// Connect to the Socket.IO server
const socket = io('http://localhost:3000');

// Get references to DOM elements
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('chat-box');
const sendButton = document.getElementById('send-button');

// Store your name
let userName = prompt("Enter your name to join");

// Emit the new user event
socket.emit('new-user-join', userName);

// Function to append messages to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position); // 'right' for sent messages, 'left' for received messages
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to the latest message
}

// Handle sending messages
const sendMessage = () => {
    const message = messageInput.value.trim();
    if (message !== '') { // Only send non-empty messages
        append(`You: ${message}`, 'left'); // Show your message on the left side
        socket.emit('send-message', { message, name: userName }); // Emit message with your name
        messageInput.value = ''; // Clear the input field
    }
}

// Handle send button click
sendButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default button behavior
    sendMessage();
});

// Handle Enter key press to send message
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default action
        sendMessage();
    }
});

// Listen for the 'user-join' event and update the UI
socket.on('user-join', (data) => {
    append(`${data.name} joined the chat`, 'right'); // Display user joins on the right
});

// Listen for incoming messages and update the UI
socket.on('receive-message', (data) => {
    // Display received messages with sender's name on the right side
    if (data.name !== userName) {
        append(`${data.name}: ${data.message}`, 'right');
    }
});
