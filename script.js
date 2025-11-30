// ===== GLOBAL STATE =====
let isStoryMode = false;
let isMusicPlaying = false;
let storyModeAutoScroll = null;

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    initializeTypewriter();
    initializeMemoryCards();
    initializeScrollAnimations();
    initializeTimeline();
    initializeNumberCounters();
    initializeLetterReveal();
    initializeButtonListeners();
    initializeBalloons();
    setupIntersectionObservers();
    initializeCakePage();
});

// ===== PARTICLES ANIMATION =====
function initializeParticles() {
    const container = document.getElementById('particleContainer');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = left + '%';
        particle.style.top = '100%';
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        
        container.appendChild(particle);
    }

    // Continuously add new particles
    setInterval(() => {
        if (Math.random() > 0.7) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = left + '%';
            particle.style.top = '100%';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
            
            container.appendChild(particle);
            
            setTimeout(() => particle.remove(), 10000);
        }
    }, 500);
}

// ===== TYPEWRITER EFFECT =====
function initializeTypewriter() {
    const element = document.getElementById('typewriter');
    const text = element.textContent;
    element.textContent = '';
    
    let index = 0;
    const speed = 50;
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== CTA BUTTON - CONFETTI & SCROLL =====
function initializeButtonListeners() {
    const ctaButton = document.getElementById('ctaButton');
    ctaButton.addEventListener('click', () => {
        createConfetti();
        setTimeout(() => {
            document.getElementById('timelineSection').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    });

    // MUSIC TOGGLE
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');

    musicToggle.addEventListener('click', () => {
        isMusicPlaying = !isMusicPlaying;
        
        if (isMusicPlaying) {
            backgroundMusic.play().catch(err => {
                console.log('Audio autoplay blocked:', err);
                isMusicPlaying = false;
            });
            musicToggle.classList.add('playing');
        } else {
            backgroundMusic.pause();
            musicToggle.classList.remove('playing');
        }
    });

    // STORY MODE TOGGLE
    const storyToggle = document.getElementById('storyToggle');
    storyToggle.addEventListener('click', () => {
        isStoryMode = !isStoryMode;
        
        if (isStoryMode) {
            storyToggle.style.background = 'rgba(255, 206, 115, 0.2)';
            storyToggle.style.boxShadow = 'var(--glow-strong)';
            startStoryMode();
        } else {
            storyToggle.style.background = 'transparent';
            storyToggle.style.boxShadow = 'var(--glow-orange)';
            stopStoryMode();
        }
    });
}

// ===== CONFETTI EFFECT =====
function createConfetti() {
    const confettiCount = 50;
    const colors = ['golden', 'orange', 'maroon'];
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti ' + colors[Math.floor(Math.random() * colors.length)];
            
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight - window.innerHeight;
            
            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// ===== MEMORY CARDS FLIP =====
function initializeMemoryCards() {
    const memoryCards = document.querySelectorAll('.memory-card');
    
    memoryCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

// ===== TIMELINE LINE ANIMATION ON SCROLL =====
function initializeTimeline() {
    const timelineSection = document.getElementById('timelineSection');
    const timelineLine = document.getElementById('timelineLine');
    
    window.addEventListener('scroll', () => {
        const sectionRect = timelineSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (sectionRect.top < windowHeight && sectionRect.bottom > 0) {
            const progress = 1 - (sectionRect.top / (sectionRect.height + windowHeight));
            const clampedProgress = Math.max(0, Math.min(1, progress));
            
            const sectionHeight = timelineSection.getBoundingClientRect().height;
            timelineLine.style.height = (clampedProgress * sectionHeight * 0.9) + 'px';
        }
    });
}

// ===== NUMBER COUNTER ANIMATION =====
function initializeNumberCounters() {
    const numberCards = document.querySelectorAll('.number-value');
    let hasAnimated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                
                numberCards.forEach(card => {
                    const target = parseInt(card.dataset.target);
                    
                    if (card.textContent === '∞') return;
                    
                    let current = 0;
                    const increment = target / 60;
                    
                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            card.textContent = target;
                            clearInterval(counter);
                        } else {
                            card.textContent = Math.floor(current);
                        }
                    }, 16);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const numberSection = document.getElementById('numbersSection');
    observer.observe(numberSection);
}

// ===== LETTER REVEAL ON SCROLL =====
function initializeLetterReveal() {
    const letterContent = document.getElementById('letterContent');
    const letterParagraphs = letterContent.querySelectorAll('.letter-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.3 });
    
    letterParagraphs.forEach(p => {
        observer.observe(p);
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const cards = document.querySelectorAll('.timeline-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'fadeInCard 0.8s ease-out forwards';
            }
        });
    }, { threshold: 0.2 });
    
    cards.forEach(card => observer.observe(card));
}

// ===== BALLOONS =====
function initializeBalloons() {
    const finalMoment = document.getElementById('finalMoment');
    const balloonContainer = document.getElementById('balloonsContainer');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && balloonContainer.children.length === 0) {
                createBalloons();
                initializeBalloonPopEvent();
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(finalMoment);
}

function createBalloons() {
    const balloonContainer = document.getElementById('balloonsContainer');
    const balloonCount = 15;
    const colors = ['maroon', 'orange', 'gold'];
    
    for (let i = 0; i < balloonCount; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon ' + colors[Math.floor(Math.random() * colors.length)];
        
        const left = Math.random() * 80 + 10;
        const delay = Math.random() * 2;
        const duration = Math.random() * 2 + 4;
        
        balloon.style.left = left + '%';
        balloon.style.bottom = '-60px';
        balloon.style.animationDelay = delay + 's';
        balloon.style.animationDuration = duration + 's';
        
        balloonContainer.appendChild(balloon);
    }
}

function initializeBalloonPopEvent() {
    const balloons = document.querySelectorAll('.balloon');
    
    balloons.forEach(balloon => {
        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            
            balloon.classList.add('popped');
            
            // Create sparkles
            for (let i = 0; i < 8; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                
                const angle = (i / 8) * Math.PI * 2;
                const distance = 50;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                sparkle.style.left = e.target.style.left;
                sparkle.style.top = e.target.style.bottom;
                sparkle.style.setProperty('--tx', tx + 'px');
                sparkle.style.setProperty('--ty', ty + 'px');
                
                document.getElementById('balloonsContainer').appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1000);
            }
            
            setTimeout(() => balloon.remove(), 300);
        });
    });
}

// ===== FIREWORKS =====
function createFireworks() {
    const container = document.getElementById('fireworksContainer');
    const fireworkCount = 20;
    
    for (let i = 0; i < fireworkCount; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.7;
            
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = x + 'px';
            firework.style.top = y + 'px';
            
            for (let j = 0; j < 12; j++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                
                const angle = (j / 12) * Math.PI * 2;
                const distance = 100;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                particle.style.left = '0';
                particle.style.top = '0';
                particle.style.animation = `
                    fireworkBurst 1s ease-out forwards
                `;
                particle.style.setProperty('--tx', tx + 'px');
                particle.style.setProperty('--ty', ty + 'px');
                
                firework.appendChild(particle);
            }
            
            container.appendChild(firework);
            
            setTimeout(() => firework.remove(), 1000);
        }, i * 100);
    }
}

// Add firework burst animation to CSS dynamically if not present
const style = document.createElement('style');
style.textContent = `
    @keyframes fireworkBurst {
        0% {
            transform: translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), var(--ty));
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Trigger fireworks when final moment is visible
window.addEventListener('scroll', () => {
    const finalMoment = document.getElementById('finalMoment');
    const rect = finalMoment.getBoundingClientRect();
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (!finalMoment.dataset.fireworksTriggered) {
            finalMoment.dataset.fireworksTriggered = 'true';
            createFireworks();
        }
    }
});

// ===== STORY MODE =====
function startStoryMode() {
    // Auto-expand timeline cards
    const timelineCards = document.querySelectorAll('.timeline-card');
    let cardIndex = 0;
    
    // Increase grain overlay in story mode
    document.body.style.setProperty('--grain-opacity', '0.08');
    
    // Auto-scroll through sections
    const sections = [
        document.getElementById('timelineSection'),
        document.getElementById('memorySection'),
        document.getElementById('numbersSection'),
        document.getElementById('letterSection'),
        document.getElementById('finalMoment')
    ];
    
    let sectionIndex = 0;
    
    storyModeAutoScroll = setInterval(() => {
        if (sectionIndex < sections.length) {
            sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
            sectionIndex++;
        } else {
            stopStoryMode();
        }
    }, 5000);
}

function stopStoryMode() {
    if (storyModeAutoScroll) {
        clearInterval(storyModeAutoScroll);
        storyModeAutoScroll = null;
    }
    document.body.style.setProperty('--grain-opacity', '0.03');
}

// ===== SETUP INTERSECTION OBSERVERS =====
function setupIntersectionObservers() {
    // Observer for parallax sections
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    const parallaxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'parallaxFade 1s ease-out';
            }
        });
    }, { threshold: 0.2 });
    
    parallaxSections.forEach(section => parallaxObserver.observe(section));

    // Observer for memory cards
    const memoryCards = document.querySelectorAll('.memory-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'fadeIn 0.8s ease-out';
            }
        });
    }, { threshold: 0.2 });
    
    memoryCards.forEach(card => cardObserver.observe(card));

    // Observer for number cards
    const numberCards = document.querySelectorAll('.number-card');
    
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'slideInUp 0.8s ease-out';
            }
        });
    }, { threshold: 0.2 });
    
    numberCards.forEach(card => {
        card.style.opacity = '0';
        numberObserver.observe(card);
    });

    // Observer for blueprint section
    const loveYouSection = document.querySelector('.love-you-section');
    
    if (loveYouSection) {
        const loveYouObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.animation = 'slideInUp 1s ease-out';
                }
            });
        }, { threshold: 0.2 });
        
        loveYouSection.style.opacity = '0';
        loveYouObserver.observe(loveYouSection);
    }
}

// ===== SMOOTH SCROLL ENHANCEMENT =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== PARALLAX MOUSE FOLLOW ON HERO =====
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
        });
    }
});

// ===== RESPONSIVE ADJUSTMENTS =====
window.addEventListener('resize', () => {
    // Adjust mobile-specific features
    if (window.innerWidth < 768) {
        // Reduce particle count on mobile
        const particles = document.querySelectorAll('.particle');
        if (particles.length > 20) {
            for (let i = 20; i < particles.length; i++) {
                particles[i].style.display = 'none';
            }
        }
    }
});

// ===== PREVENT CONTEXT MENU ON BALLOONS (Optional) =====
document.addEventListener('contextmenu', (e) => {
    if (e.target.classList.contains('balloon')) {
        e.preventDefault();
    }
});

// ===== CAKE PAGE FUNCTIONALITY =====
let candlesBlown = 0;
const totalCandles = 5;
let cakeCut = false;

function initializeCakePage() {
    // Candle click listeners
    const candles = document.querySelectorAll('.candle');
    candles.forEach((candle, index) => {
        candle.addEventListener('click', () => {
            blowOutCandle(index);
        });
    });

    // Cut cake button
    const cutCakeButton = document.getElementById('cutCakeButton');
    cutCakeButton.addEventListener('click', cutTheCake);

    // Back to timeline button
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        document.getElementById('timelineSection').scrollIntoView({ behavior: 'smooth' });
    });
}

function blowOutCandle(index) {
    const flame = document.getElementById(`flame-${index}`);
    
    if (!flame.classList.contains('extinguished') && !flame.classList.contains('extinguishing')) {
        flame.classList.add('extinguishing');
        
        // Create smoke effect
        createSmoke(index);
        
        // Mark as extinguished after animation
        setTimeout(() => {
            flame.classList.add('extinguished');
            candlesBlown++;
            
            // Check if all candles are blown out
            if (candlesBlown === totalCandles) {
                showWishMessage();
            }
        }, 600);
    }
}

function createSmoke(candleIndex) {
    const candle = document.querySelectorAll('.candle')[candleIndex];
    const cakeWrapper = document.querySelector('.cake-wrapper');
    const rect = candle.getBoundingClientRect();
    const wrapperRect = cakeWrapper.getBoundingClientRect();
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const smoke = document.createElement('div');
            smoke.className = 'smoke';
            smoke.style.left = (rect.left - wrapperRect.left + 8) + 'px';
            smoke.style.top = (rect.top - wrapperRect.top - 30) + 'px';
            smoke.style.position = 'absolute';
            
            cakeWrapper.appendChild(smoke);
            
            setTimeout(() => smoke.remove(), 1500);
        }, i * 100);
    }
}

function showWishMessage() {
    const wishMessage = document.getElementById('wishMessage');
    wishMessage.classList.add('visible');
}

function cutTheCake() {
    if (cakeCut) return;
    cakeCut = true;
    
    const cutCakeButton = document.getElementById('cutCakeButton');
    cutCakeButton.disabled = true;
    
    // Animate cake slicing
    const cakeTop = document.getElementById('cakeTop');
    cakeTop.classList.add('sliced');
    
    // Play slice sound (using Web Audio API to create a simple sound)
    playSliceSound();
    
    // Trigger effects after a short delay
    setTimeout(() => {
        createConfetti();
        createCakeBalloons();
        createSparkles();
        showSweetMessage();
    }, 800);
}

function playSliceSound() {
    // Create a simple slice sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Create a quick whoosh sound
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc.start(now);
        osc.stop(now + 0.2);
    } catch (e) {
        console.log('Audio context not available');
    }
}

function showSweetMessage() {
    const sweetMessageContainer = document.getElementById('sweetMessageContainer');
    sweetMessageContainer.classList.add('visible');
}

function createCakeBalloons() {
    const balloonContainer = document.getElementById('balloonsContainer');
    if (!balloonContainer) return;
    
    const balloonCount = 12;
    const colors = ['maroon', 'orange', 'gold'];
    
    for (let i = 0; i < balloonCount; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.className = 'balloon ' + colors[Math.floor(Math.random() * colors.length)];
            
            const left = Math.random() * 80 + 10;
            const delay = 0;
            const duration = Math.random() * 2 + 4;
            
            balloon.style.left = left + '%';
            balloon.style.bottom = '-60px';
            balloon.style.animationDelay = delay + 's';
            balloon.style.animationDuration = duration + 's';
            balloon.style.position = 'fixed';
            
            balloonContainer.appendChild(balloon);
            
            // Pop on click
            balloon.addEventListener('click', (e) => {
                e.stopPropagation();
                balloon.classList.add('popped');
                
                for (let j = 0; j < 8; j++) {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    
                    const angle = (j / 8) * Math.PI * 2;
                    const distance = 50;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;
                    
                    sparkle.style.left = e.target.style.left;
                    sparkle.style.top = e.target.style.bottom;
                    sparkle.style.setProperty('--tx', tx + 'px');
                    sparkle.style.setProperty('--ty', ty + 'px');
                    
                    balloonContainer.appendChild(sparkle);
                    
                    setTimeout(() => sparkle.remove(), 1000);
                }
                
                setTimeout(() => balloon.remove(), 300);
            });
        }, i * 100);
    }
}

function createSparkles() {
    const container = document.getElementById('sparklesContainer');
    const sparkleCount = 30;
    
    for (let i = 0; i < sparkleCount; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-particle';
            
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.7;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 150 + 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.setProperty('--tx', tx + 'px');
            sparkle.style.setProperty('--ty', ty + 'px');
            
            container.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1200);
        }, i * 50);
    }
}

// ===== LOG INITIALIZATION =====
console.log('🎉 Birthday Website Initialized! 🎉');
