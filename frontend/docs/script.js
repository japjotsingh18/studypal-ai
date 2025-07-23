
        let timer = {
            seconds: 0,
            interval: null,
            isRunning: false
        };

        let stats = {
            totalTime: 0,
            sessions: 0
        };

        const motivationalMessages = [
            "Stay focused! You're doing great! 🔥",
            "Keep going! Every minute counts! ⚡",
            "You're in the zone! 🎯",
            "Focused and determined! 💪",
            "Building those study habits! 📚",
            "Almost there! Push through! 🚀"
        ];

        function updateTimer() {
            timer.seconds++;
            const minutes = Math.floor(timer.seconds / 60);
            const seconds = timer.seconds % 60;
            
            document.getElementById('timerDisplay').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Update progress ring
            const progressBar = document.getElementById('progressBar');
            const circumference = 565.48;
            const progress = (timer.seconds % 1200) / 1200; // 20 min cycles
            const offset = circumference - (progress * circumference);
            progressBar.style.strokeDashoffset = offset;
            
            // Update motivation text every 30 seconds
            if (timer.seconds % 30 === 0) {
                const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                document.getElementById('motivationText').textContent = randomMessage;
            }
            
            // Check for game unlocks
            checkGameUnlocks();
            
            // Add AI encouragement at intervals
            if (timer.seconds % 300 === 0) { // Every 5 minutes
                addAIMessage(`Great job! You've been focused for ${Math.floor(timer.seconds / 60)} minutes! 🌟`);
            }
        }

        function toggleTimer() {
            const startBtn = document.getElementById('startBtn');
            
            if (!timer.isRunning) {
                timer.interval = setInterval(updateTimer, 1000);
                timer.isRunning = true;
                startBtn.textContent = 'Pause Session';
                startBtn.style.background = 'linear-gradient(45deg, #ff4757, #ff6b7a)';
                addAIMessage("Study session started! I'm here if you need any help. Let's make this productive! 💪");
            } else {
                clearInterval(timer.interval);
                timer.isRunning = false;
                startBtn.textContent = 'Resume Session';
                startBtn.style.background = 'linear-gradient(45deg, #00f5ff, #39ff14)';
                
                // Update stats
                stats.totalTime += timer.seconds;
                stats.sessions++;
                updateStats();
                
                addAIMessage(`Session paused! You studied for ${Math.floor(timer.seconds / 60)} minutes. Great work! 🎉`);
            }
        }

        function checkGameUnlocks() {
            const gamesSection = document.getElementById('gamesSection');
            const unlockMessage = document.getElementById('unlockMessage');
            
            if (timer.seconds >= 1200) { // 20 minutes
                document.getElementById('game1').classList.add('unlocked');
                gamesSection.classList.add('unlocked');
                unlockMessage.style.display = 'block';
            }
            
            if (timer.seconds >= 2400) { // 40 minutes
                document.getElementById('game2').classList.add('unlocked');
                document.getElementById('game3').classList.add('unlocked');
            }
        }

        function updateStats() {
            document.getElementById('totalTime').textContent = `${Math.floor(stats.totalTime / 60)}m`;
            document.getElementById('sessionsCount').textContent = stats.sessions;
        }

        function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            
            if (message) {
                addUserMessage(message);
                input.value = '';
                
                // Simulate AI response
                // Send message to backend for AI response
fetch('http://127.0.0.1:5000/api/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
})
.then(response => response.json())
.then(data => {
    if (data.reply) {
        addAIMessageTypingEffect(data.reply);
    } else {
        addAIMessage("Oops! Something went wrong. 😓");
    }
})
.catch(error => {
    console.error('Error:', error);
    addAIMessage("Error connecting to StudyPal AI backend. 🛠️");
});

            }
        }

        function addUserMessage(message) {
            const chatMessages = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user-message';
            messageDiv.textContent = message;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function addAIMessage(message) {
            const chatMessages = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ai-message';
            messageDiv.textContent = message;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function addAIMessageTypingEffect(text) {
            const chatMessages = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ai-message';
            chatMessages.appendChild(messageDiv);
        
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    messageDiv.textContent += text[i];
                    i++;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                } else {
                    clearInterval(interval);
                }
            }, 20); // typing speed
        }
        

        

        function playGame(gameType) {
            switch(gameType) {
                case 'palindrome':
                    addAIMessage("🎮 Palindrome Challenge: Is 'racecar' a palindrome? Take a 5-minute break and come back refreshed!");
                    break;
                case 'quiz':
                    addAIMessage("🧠 Brain Flash Quiz: Quick! Name 3 study techniques we've discussed. Great job taking a brain break!");
                    break;
                case 'emoji':
                    addAIMessage("😊 Emoji Puzzle: Can you decode this? 📚+⏰+🧠 = ? (Answer: Effective studying!) Time for a quick stretch!");
                    break;
            }
        }

        // Allow Enter key to send messages
        document.getElementById('chatInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Initialize
        updateStats();

        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
        
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000); // Display for 3 seconds
        }
        
        