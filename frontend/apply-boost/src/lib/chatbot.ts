document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    const BOT_URL = 'http://127.0.0.1:5000/api/chatbot-response'; // Update with your actual backend URL

    function addMessage(text: String, sender: String) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
    }

    async function sendMessage() {
        const userText = userInput.value.trim();
        if (userText === '') return;

        addMessage(userText, 'user');
        userInput.value = '';

        try {
            // Send the user's message to the backend API
            const response = await fetch(BOT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userText })
            });

            const data = await response.json();

            if (response.ok) {
                // Display the bot's response
                addMessage(data.response, 'bot');
            } else {
                addMessage(`Error: ${data.error || 'Something went wrong.'}`, 'bot');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            addMessage('Error: Could not connect to the server.', 'bot');
        }
    }

    // Event listeners for sending messages
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

