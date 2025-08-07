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
                // Reset unlock tracking flags when starting a new session
                resetUnlockFlags();
                
                timer.interval = setInterval(updateTimer, 1000);
                timer.isRunning = true;
                startBtn.textContent = 'Pause Session';
                startBtn.style.background = 'linear-gradient(45deg, #ff4757, #ff6b7a)';
                document.getElementById('finishBtn').style.display = 'block';
                addAIMessage("Study session started! I'm here if you need any help. Let's make this productive! 💪");
            } else {
                clearInterval(timer.interval);
                timer.isRunning = false;
                startBtn.textContent = 'Resume Session';
                startBtn.style.background = 'linear-gradient(45deg, #00f5ff, #39ff14)';
                document.getElementById('finishBtn').style.display = 'none';
                
                // Update stats
                stats.totalTime += timer.seconds;
                stats.sessions++;
                updateStats();
                
                addAIMessage(`Session paused! You studied for ${Math.floor(timer.seconds / 60)} minutes. Great work! 🎉`);
            }
        }

        // Utility function to get total study time from backend
async function getTotalStudyTime() {
    try {
        const res = await fetch('http://127.0.0.1:5000/api/get-sessions');
        const data = await res.json();
        if (data.sessions) {
            return data.sessions.reduce((sum, s) => sum + s.total_time, 0);
        }
        return 0;
    } catch (error) {
        console.error('Error fetching total study time:', error);
        return 0;
    }
}

// Check and update game unlock status
async function checkGameUnlocks() {
    // Use current session time instead of total database time
    const currentSessionMinutes = Math.floor(timer.seconds / 60);

    const unlockMsg = document.getElementById('unlockMessage');
    const game1 = document.getElementById('game1');
    const game2 = document.getElementById('game2');
    const game3 = document.getElementById('game3');

    // Show unlock message if any game should be unlocked
    if (currentSessionMinutes >= 20) {
        unlockMsg.style.display = 'block';
    } else {
        unlockMsg.style.display = 'none';
    }

    // Game 1 - Palindrome Challenge (20 minutes)
    if (currentSessionMinutes >= 20) {
        game1.classList.remove('locked');
        game1.classList.add('unlocked');
        // Add celebration animation if just unlocked
        if (!game1.dataset.wasUnlocked) {
            showGameUnlockCelebration('Palindrome Challenge');
            game1.dataset.wasUnlocked = 'true';
        }
    } else {
        game1.classList.add('locked');
        game1.classList.remove('unlocked');
    }

    // Game 2 & 3 - Brain Flash Quiz & Emoji Puzzle (40 minutes)
    if (currentSessionMinutes >= 40) {
        game2.classList.remove('locked');
        game2.classList.add('unlocked');
        game3.classList.remove('locked');
        game3.classList.add('unlocked');
        
        // Add celebration animation if just unlocked
        if (!game2.dataset.wasUnlocked) {
            showGameUnlockCelebration('Brain Flash Quiz & Emoji Puzzle');
            game2.dataset.wasUnlocked = 'true';
            game3.dataset.wasUnlocked = 'true';
        }
    } else {
        game2.classList.add('locked');
        game2.classList.remove('unlocked');
        game3.classList.add('locked');
        game3.classList.remove('unlocked');
    }

    // Update progress indicators
    updateUnlockProgress(currentSessionMinutes);
}

// Show celebration when games are unlocked
function showGameUnlockCelebration(gameName) {
    // Create a temporary celebration message
    const celebration = document.createElement('div');
    celebration.className = 'unlock-celebration-popup';
    celebration.innerHTML = `
        <div class="celebration-content">
            <h3>🎉 Congratulations!</h3>
            <p>You've unlocked: <strong>${gameName}</strong></p>
            <p>You've earned a break!</p>
        </div>
    `;
    
    document.body.appendChild(celebration);
    
    // Remove after 4 seconds
    setTimeout(() => {
        celebration.remove();
    }, 4000);
}

// Update progress indicators for locked games
function updateUnlockProgress(currentMinutes) {
    const game1 = document.getElementById('game1');
    const game2 = document.getElementById('game2');
    const game3 = document.getElementById('game3');

    // Update Game 1 progress (Palindrome - 20 min requirement)
    if (currentMinutes < 20) {
        const progress = (currentMinutes / 20) * 100;
        updateGameProgress(game1, progress, 20 - currentMinutes);
    }

    // Update Game 2 & 3 progress (Quiz & Emoji - 40 min requirement)
    if (currentMinutes < 40) {
        const progress = (currentMinutes / 40) * 100;
        updateGameProgress(game2, progress, 40 - currentMinutes);
        updateGameProgress(game3, progress, 40 - currentMinutes);
    }
}

// Helper function to update individual game progress
function updateGameProgress(gameElement, progress, remaining) {
    let progressBar = gameElement.querySelector('.progress-indicator');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-indicator';
        progressBar.innerHTML = `
            <div class="progress-bar-mini">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">${remaining} min remaining</div>
        `;
        gameElement.appendChild(progressBar);
    }
    
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressText = progressBar.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${Math.min(progress, 100)}%`;
    }
    if (progressText) {
        progressText.textContent = `${remaining} min remaining`;
    }
}

// Enhanced playGame function to check unlock status
function playGame(gameType) {
    const gameElement = document.getElementById(`game${gameType === 'palindrome' ? '1' : gameType === 'quiz' ? '2' : '3'}`);
    
    if (gameElement && gameElement.classList.contains('locked')) {
        showToast('🔒 This game is still locked! Study more to unlock it.');
        return;
    }
    
    // Game is unlocked, show the game content
    switch (gameType) {
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

// Enhanced showToast function
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    } else {
        // Create toast if it doesn't exist
        const newToast = document.createElement('div');
        newToast.id = 'toast';
        newToast.className = 'toast show';
        newToast.textContent = message;
        document.body.appendChild(newToast);
        
        setTimeout(() => {
            newToast.classList.remove('show');
        }, 3000);
    }
}

// Add event listener when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    checkGameUnlocks(); // Check unlock status on page load
    
    // Check unlocks periodically (every 30 seconds)
    setInterval(checkGameUnlocks, 30000);
});

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

function finishSession() {
    showCustomModal();
}

function showCustomModal() {
    document.getElementById('customModal').style.display = 'flex';
}

function closeCustomModal() {
    document.getElementById('customModal').style.display = 'none';
}

async function confirmFinishSession() {
    // Close the modal first
    closeCustomModal();
    
    // Stop the timer if running
    if (timer.isRunning) {
        timer.isRunning = false;
        clearInterval(timer.interval);
    }
    
    // Save current session data to backend before resetting
    if (timer.seconds > 0) {
        try {
            const sessionData = {
                totalTime: timer.seconds,
                sessionCount: stats.sessions
            };
            
            const response = await fetch('http://127.0.0.1:5001/api/save-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sessionData)
            });
            
            if (response.ok) {
                console.log('Session saved successfully');
            } else {
                console.error('Failed to save session');
            }
        } catch (error) {
            console.error('Error saving session:', error);
        }
    }
    
    // Reset localStorage values
    localStorage.setItem('totalTime', '0');
    localStorage.setItem('sessionCount', '0');
    localStorage.setItem('palindromeUnlocked', 'false');
    localStorage.setItem('brainQuizUnlocked', 'false');
    localStorage.setItem('emojiPuzzleUnlocked', 'false');
    
    // Clear any celebration flags
    localStorage.removeItem('game1Unlocked');
    localStorage.removeItem('game2Unlocked');
    localStorage.removeItem('game3Unlocked');
    localStorage.removeItem('celebrationShown');
    
    // Reset UI elements
    const startBtn = document.getElementById('startBtn');
    startBtn.textContent = 'Start Study Session';
    startBtn.style.background = 'linear-gradient(45deg, #00f5ff, #39ff14)';
    document.getElementById('finishBtn').style.display = 'none';
    document.getElementById('timerDisplay').textContent = '00:00';
    
    // Reset timer
    timer.seconds = 0;
    timer.isRunning = false;
    
    // Reset progress bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.strokeDashoffset = 565.48;
    }
    
    // Lock all games and reset flags
    resetUnlockFlags();
    
    // Hide unlock message
    const unlockMessage = document.getElementById('unlockMessage');
    if (unlockMessage) {
        unlockMessage.style.display = 'none';
    }
    
    // Show toast notification
    showToast('Session finished and saved! All progress reset.');
    
    // Add AI message
    addAIMessage("🎉 Session completed and saved! Your study time has been recorded. Start a new session whenever you're ready!");
    
    // Refresh history if it's currently visible
    if (typeof refreshHistoryIfVisible === 'function') {
        setTimeout(() => {
            refreshHistoryIfVisible();
        }, 500); // Small delay to ensure session is saved
    }
    
    console.log('Session finished, saved, and reset');
}

function lockAllGames() {
    const games = [
        document.getElementById('game1'),
        document.getElementById('game2'), 
        document.getElementById('game3')
    ];
    
    games.forEach(game => {
        if (game) {
            game.classList.remove('unlocked');
            game.classList.add('locked');
        }
    });
}

// Reset unlock tracking flags for a fresh session
function resetUnlockFlags() {
    const games = [
        document.getElementById('game1'),
        document.getElementById('game2'), 
        document.getElementById('game3')
    ];
    
    games.forEach(game => {
        if (game) {
            // Remove unlock tracking flags
            delete game.dataset.wasUnlocked;
            
            // Lock all games at start
            game.classList.remove('unlocked');
            game.classList.add('locked');
            
            // Remove any existing progress indicators
            const progressIndicator = game.querySelector('.progress-indicator');
            if (progressIndicator) {
                progressIndicator.remove();
            }
        }
    });
    
    // Hide unlock message
    const unlockMessage = document.getElementById('unlockMessage');
    if (unlockMessage) {
        unlockMessage.style.display = 'none';
    }
    
    console.log('Unlock flags reset for new session');
}

async function saveSessionToBackend(totalTime, sessionCount) {
    try {
        const sessionData = { totalTime, sessionCount };
        const response = await fetch('http://127.0.0.1:5001/api/save-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
        });
        if (response.ok) {
            console.log('Session saved successfully');
        } else {
            console.error('Failed to save session');
        }
    } catch (error) {
        console.error('Error saving session:', error);
    }
}

