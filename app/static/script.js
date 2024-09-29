let chatHistory = [];

async function scrapeUrl() {
    const url = document.getElementById('url-input').value;
    const statusElement = document.getElementById('scrape-status');
    const resultElement = document.getElementById('scrape-result');

    statusElement.style.display = 'block';
    resultElement.innerHTML = '';

    try {
        const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        const data = await response.json();
        displayJsonResult(data.data);
    } catch (error) {
        resultElement.textContent = 'An error occurred while scraping.';
    } finally {
        statusElement.style.display = 'none';
    }
}

async function askQuestion() {
    const question = document.getElementById('question-input').value;
    const context = document.getElementById('scrape-result').textContent;
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            question, 
            context, 
            chat_history: chatHistory.map(([q, a]) => ({ question: q, answer: a }))
        }),
    });
    const data = await response.json();
    if (data.error) {
        console.error('Error:', data.error);
        return;
    }
    chatHistory = data.chat_history.map(item => [item.question, item.answer]);
    updateChatDisplay();
    document.getElementById('question-input').value = '';
}

function updateChatDisplay() {
    const chatHistoryElement = document.getElementById('chat-history');
    chatHistoryElement.innerHTML = '';
    chatHistory.forEach(([question, answer]) => {
        chatHistoryElement.innerHTML += `<p><strong>You:</strong> ${question}</p>`;
        chatHistoryElement.innerHTML += `<p><strong>AI:</strong> ${answer}</p>`;
    });
}

function clearChatHistory() {
    chatHistory = [];
    updateChatDisplay();
}

function displayJsonResult(data) {
    const resultElement = document.getElementById('scrape-result');
    resultElement.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'json-container';

    for (const [key, value] of Object.entries(data)) {
        const item = document.createElement('div');
        item.className = 'json-item';

        const keyElement = document.createElement('strong');
        keyElement.textContent = key + ': ';
        item.appendChild(keyElement);

        const valueElement = document.createElement('span');
        valueElement.textContent = typeof value === 'object' ? JSON.stringify(value, null, 2) : value;
        item.appendChild(valueElement);

        container.appendChild(item);
    }

    resultElement.appendChild(container);
}
