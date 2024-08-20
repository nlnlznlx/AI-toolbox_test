document.addEventListener('DOMContentLoaded', () => {
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
    const displayText = document.querySelector('.chatbot-screen p');
    const textarea = document.querySelector('.chatbot-screen textarea');
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
            const prompt = button.innerText;
            displayText.innerText = prompts[prompt];
            textarea.value = ""; // clear previous input
        });
    });

    const form = document.getElementById('prompt-form');
    const userPrompt = document.getElementById('user-prompt');
    const chatbotOutput = document.getElementById('chatbot-output');

    form.addEventListener('submit', function(event) {
        displayText.innerText = "";
        
        event.preventDefault();
        
        const message = userPrompt.value;
        if (!message) return;

        // Display the user's message on the right side
        const userMessageElement = document.createElement('p');
        userMessageElement.classList.add('user-message'); 
        userMessageElement.textContent = message;
        chatbotOutput.appendChild(userMessageElement);

        // Clear the prompt box
        userPrompt.value = '';

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
            const reply = data.reply;

            const replyElement = document.createElement('p');
            replyElement.classList.add('ai-message');
            replyElement.textContent = reply;
            chatbotOutput.appendChild(replyElement);
            
            // Scroll to the bottom of the output container
            chatbotOutput.scrollTop = chatbotOutput.scrollHeight;
        })
        .catch(error => console.error('Error:', error));
    });
});
