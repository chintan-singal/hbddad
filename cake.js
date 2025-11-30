/* ===== GLOBAL VARIABLES ===== */
let candlesBlown = 0;
const totalCandles = 5;
let cakeCut = false;
let musicPlaying = false;

/* ===== INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', function() {
    initializeBackground();
    initializeCandles();
    initializeButtons();
    initializeMusic();
    showMessage(1);
});

/* ===== PARTICLES BACKGROUND ===== */
function initializeBackground() {
    const particlesBg = document.getElementById('particlesBg');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = ['#FFCE73', '#FF8C42', '#FFF5E1'][Math.floor(Math.random() * 3)];
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesBg.appendChild(particle);
    }
}

/* ===== CANDLES INITIALIZATION ===== */
function initializeCandles() {
    const candles = document.querySelectorAll('.candle-wrapper');
    candles.forEach((candle, index) => {
        candle.addEventListener('click', () => blowOutCandle(candle, index));
    });
}

/* ===== BLOW OUT CANDLE ===== */
function blowOutCandle(candleWrapper, index) {
    if (cakeCut) return; // Don't allow blowing candles after cake is cut
    
    const flame = candleWrapper.querySelector('.candle-flame');
    
    if (flame.classList.contains('extinguished')) {
        return; // Already blown out
    }

    flame.classList.add('extinguishing');
    playBlowSound();
    
    setTimeout(() => {
        flame.classList.remove('extinguishing');
        flame.classList.add('extinguished');
        candlesBlown++;

        // Show smoke puffs
        createSmokePuffs(candleWrapper);

        // Fade out and remove the entire candle wrapper after a delay
        candleWrapper.style.animation = 'candle-fade-out 0.6s ease-out forwards';
        setTimeout(() => {
            candleWrapper.remove(); // Completely remove from DOM
        }, 600);

        // Check if all candles are blown
        if (candlesBlown === totalCandles) {
            setTimeout(() => {
                showMessage(2); // Show "Make a wish, Dad ❤️"
            }, 500);
        }
    }, 400);
}

/* ===== SMOKE PUFFS ===== */
function createSmokePuffs(candleWrapper) {
    const sparklesContainer = document.getElementById('sparklesContainer');
    const rect = candleWrapper.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = '💨';
        sparkle.style.left = (rect.left + 10) + 'px';
        sparkle.style.top = (rect.top - 20) + 'px';
        sparklesContainer.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
    }
}

/* ===== BUTTONS INITIALIZATION ===== */
function initializeButtons() {
    const cutBtn = document.getElementById('cutCakeBtn');
    const resetBtn = document.getElementById('resetBtn');

    cutBtn.addEventListener('click', () => {
        if (candlesBlown === totalCandles && !cakeCut) {
            cutTheCake();
        }
    });

    resetBtn.addEventListener('click', resetGame);
}

/* ===== CUT THE CAKE ===== */
function cutTheCake() {
    if (cakeCut) return;
    cakeCut = true;

    const knife = document.getElementById('knife');
    const layers = document.querySelectorAll('.cake-layer');

    // Show knife and animate cut
    knife.classList.add('cutting');
    playCutSound();

    setTimeout(() => {
        // Split each layer
        layers.forEach((layer, index) => {
            if (index % 2 === 0) {
                layer.classList.add('split-left');
            } else {
                layer.classList.add('split-right');
            }
        });

        // Show message after cut
        setTimeout(() => {
            showMessage(3); // "Every day with you has been the sweetest part of my life."
            showMessage(4); // "Your strength made me who I am."
            showMessage(5); // "Your love has been my greatest gift."
        }, 400);

        // Trigger celebrations
        playConfetti();
        createBalloons();
        createSparkles();
    }, 600);
}

/* ===== SHOW MESSAGE ===== */
function showMessage(messageNum) {
    const messageElement = document.getElementById(`msg-${messageNum}`);
    if (messageElement) {
        messageElement.classList.remove('hidden');
    }
}

/* ===== RESET GAME ===== */
function resetGame() {
    // Reset variables
    candlesBlown = 0;
    cakeCut = false;

    // Restore all candles by reloading or recreating them
    const candlesRow = document.getElementById('candlesRow');
    candlesRow.innerHTML = `
        <div class="candle-wrapper" data-candle="0">
            <div class="candle-flame" id="candle-0"></div>
            <div class="candle-stick"></div>
        </div>
        <div class="candle-wrapper" data-candle="1">
            <div class="candle-flame" id="candle-1"></div>
            <div class="candle-stick"></div>
        </div>
        <div class="candle-wrapper" data-candle="2">
            <div class="candle-flame" id="candle-2"></div>
            <div class="candle-stick"></div>
        </div>
        <div class="candle-wrapper" data-candle="3">
            <div class="candle-flame" id="candle-3"></div>
            <div class="candle-stick"></div>
        </div>
        <div class="candle-wrapper" data-candle="4">
            <div class="candle-flame" id="candle-4"></div>
            <div class="candle-stick"></div>
        </div>
    `;
    
    // Re-initialize candle click handlers
    initializeCandles();

    // Remove classes from cake layers
    const layers = document.querySelectorAll('.cake-layer');
    layers.forEach(layer => {
        layer.classList.remove('split-left', 'split-right');
    });

    // Hide knife
    const knife = document.getElementById('knife');
    knife.classList.remove('cutting');

    // Hide all messages except first
    for (let i = 2; i <= 5; i++) {
        const msg = document.getElementById(`msg-${i}`);
        if (msg) msg.classList.add('hidden');
    }

    // Clear sparkles, balloons, confetti
    document.getElementById('sparklesContainer').innerHTML = '';
    document.getElementById('balloonOverlay').innerHTML = '';
    document.getElementById('confettiContainer').innerHTML = '';
}

/* ===== SPARKLES ===== */
function createSparkles() {
    const sparklesContainer = document.getElementById('sparklesContainer');
    const sparkleCount = 30;

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = '✨';
        sparkle.style.left = (Math.random() * 100) + '%';
        sparkle.style.top = (Math.random() * 100) + '%';
        sparklesContainer.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
    }
}

/* ===== BALLOONS ===== */
function createBalloons() {
    const balloonOverlay = document.getElementById('balloonOverlay');
    const colors = ['#FF8C42', '#FFCE73', '#7A2F2F', '#4C1C1C', '#FFF5E1'];
    const sizes = ['small', 'medium', 'large'];
    const balloonCount = 20;

    for (let i = 0; i < balloonCount; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        if (size !== 'medium') {
            balloon.classList.add(size);
        }
        
        balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.left = (Math.random() * 100) + '%';
        balloon.style.bottom = '-80px';
        balloon.style.animationDelay = (Math.random() * 0.8) + 's';
        
        balloonOverlay.appendChild(balloon);

        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            balloon.classList.add('pop');
            setTimeout(() => balloon.remove(), 400);
        });

        setTimeout(() => {
            if (balloon.parentNode) balloon.remove();
        }, 7000);
    }
}

/* ===== CONFETTI ===== */
function playConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    const confettiCount = 50;
    const colors = ['#FF8C42', '#FFCE73', '#7A2F2F', '#4C1C1C', '#FFF5E1'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = (Math.random() * 100) + '%';
        confetti.style.top = '-10px';
        confetti.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        confettiContainer.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

/* ===== SOUND EFFECTS ===== */
function playBlowSound() {
    // Create a simple beep sound effect
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

function playCutSound() {
    // Create a swoosh sound effect
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
    oscillator.type = 'triangle';

    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

/* ===== MUSIC TOGGLE ===== */
function initializeMusic() {
    const musicToggle = document.getElementById('musicToggleCake');
    const birthdayMusic = document.getElementById('birthdayMusic');

    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            birthdayMusic.pause();
            musicToggle.style.opacity = '0.6';
            musicPlaying = false;
        } else {
            birthdayMusic.play().catch(() => {
                console.log('Audio playback failed - user interaction required');
            });
            musicToggle.style.opacity = '1';
            musicPlaying = true;
        }
    });
}
