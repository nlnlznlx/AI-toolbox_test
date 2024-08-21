document.addEventListener('DOMContentLoaded', () => {
    const originalText = "Welcome to your chatbot! How can I help you?";
    const introTextElement = document.getElementById("intro-text");
    const chatbotOutput = document.getElementById('chatbot-output');
    const cursorElement = document.getElementById("cursor");
    let userInput = "";
    let currentPrompt = "";
    let isPlaceholderActive = false;

    // Function to generate a garbled string of the same length as the original text
    function generateGarbledText(length) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        let garbledText = "";
        for (let i = 0; i < length; i++) {
            garbledText += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return garbledText;
    }

    // Set initial garbled text
    introTextElement.textContent = generateGarbledText(originalText.length);

    // Slowly reveal the correct text
    let index = 0;
    const revealText = setInterval(() => {
        introTextElement.textContent = originalText.substr(0, index) + generateGarbledText(originalText.length - index);
        index++;
        if (index > originalText.length) {
            clearInterval(revealText);
            introTextElement.textContent = originalText; // Ensure the final text is fully correct
        }
    }, 55); 

    // Function to update the user input display and manage the cursor
    function updateUserInputDisplay() {
        // Remove any existing input line with cursor
        const existingUserInput = document.querySelector('.user-input-line:last-child');
        if (existingUserInput) {
            existingUserInput.remove();
        }
        
        const userInputElement = document.createElement('div');
        userInputElement.className = 'user-input-line';

        userInputElement.textContent = userInput || ""; 
        userInputElement.appendChild(cursorElement);
        chatbotOutput.appendChild(userInputElement);
        chatbotOutput.scrollTop = chatbotOutput.scrollHeight;
    }

    // Function to clear placeholder if active
    function clearPlaceholder() {
        if (isPlaceholderActive) {
            introTextElement.textContent = "";
            isPlaceholderActive = false;
        }
    }

    function handleChatbotResponse(message) {
        // Clear the input buffer
        userInput = "";

        // REPLACE THIS PART WITH FOLLOWING FETCH METHOD
        const reply = "FOR DISPLAY ONLY";
        const replyElement = document.createElement('p');
        replyElement.classList.add('ai-message');
        replyElement.textContent = reply;
        chatbotOutput.appendChild(replyElement);
        updateUserInputDisplay();

        // Fetch the response from ai
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Display AI's response
            const reply = data.reply;
            const replyElement = document.createElement('p');
            replyElement.classList.add('ai-message');
            replyElement.textContent = reply;
            chatbotOutput.appendChild(replyElement);
            
            // Add a new blank input line with the cursor for the next input
            updateUserInputDisplay();
        })
        .catch(error => console.error('Error:', error));
    }

    // Capture user input and simulate typing directly in the chatbot output
    document.addEventListener('keydown', (event) => {
        console.log('Key pressed:', event.key); // Debugging log

        clearPlaceholder();

        if (event.key === 'Enter') {
            if (userInput !== currentPrompt && userInput.trim()) {
            handleChatbotResponse(userInput);
            }
            event.preventDefault(); 
        } else if (event.key === 'Backspace') {
            userInput = userInput.slice(0, -1);
            updateUserInputDisplay();
            event.preventDefault();
        } else if (event.key.length === 1) {
            //console.log(`Key pressed: ${event.key}, Current userInput: "${userInput}"`);
            userInput += event.key;
            console.log('User input:', userInput); // Debugging log
            updateUserInputDisplay();
        }
    });

    // Pagination of prompts
    const arrowBtn = document.querySelector('.arrow-btn');
    const page1 = document.querySelector('.prompt-options-list.page1');
    const page2 = document.querySelector('.prompt-options-list.page2');
    let currentPage = 1;

    arrowBtn.addEventListener('click', () => {
        if (currentPage === 1) {
            page1.style.display = 'none';
            page2.style.display = 'flex';
            arrowBtn.querySelector('img').src = 'img/up-arrow.jpeg';
            currentPage = 2;
        } else {
            page2.style.display = 'none';
            page1.style.display = 'flex';
            arrowBtn.querySelector('img').src = 'img/down-arrow.jpeg';
            currentPage = 1;
        }
    });

    // Prompt hints on the screen
    const buttons = document.querySelectorAll('.prompt-btn');
    const prompts = {
        'I am a storyteller': 'I want to tell a story about...',
        'I am a chef': 'I would like to cook...',
        'I am a scientist': 'I am wondering...',
        'I am a gamer': 'I want to play a game about...',
        'I am a dancer': 'I want to dance...',
        'I am a photo editor': 'I want to edit a photo about...',
        'I am a map reader': 'I would like to find the way to...',
        'I am a puzzle solver': 'I am wondering the answer of...'
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Clear the chat output for a new conversation
            chatbotOutput.innerHTML = "";

            // Set the new placeholder text
            const promptText = button.innerText;
            introTextElement.innerText = prompts[promptText];
            chatbotOutput.appendChild(introTextElement);

            // Clear user input and activate placeholder mode
            userInput = "";
            isPlaceholderActive = true;
            updateUserInputDisplay();
        });
    });
});
