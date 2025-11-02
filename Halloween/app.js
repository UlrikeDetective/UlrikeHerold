const countdownElement = document.getElementById('countdown');
const ghost = document.querySelector('.ghost');
const pumpkinEyes = document.querySelectorAll('.pumpkin-eye');
const ambientSound = document.getElementById('ambient-sound');
const soundToggleButton = document.getElementById('sound-toggle');
const easterEggElement = document.createElement('div');
easterEggElement.className = 'easter-egg';
easterEggElement.innerHTML = '<h1>BOO!</h1>';
document.body.appendChild(easterEggElement);

// Countdown
function calculateTimeLeft() {
    const now = new Date();
    let year = now.getFullYear();
    let halloween = new Date(year, 9, 31); // Month is 0-indexed, so 9 is October

    if (now > halloween) {
        halloween.setFullYear(year + 1);
    }

    const difference = halloween - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
        days,
        hours,
        minutes,
        seconds
    };
}

function updateCountdown() {
    const timeLeft = calculateTimeLeft();
    const countdownText = `
        <span>${timeLeft.days} days </span>
        <span>${timeLeft.hours} hours </span>
        <span>${timeLeft.minutes} minutes </span>
        <span>${timeLeft.seconds} seconds </span>
    `;
    countdownElement.innerHTML = countdownText;
    countdownElement.setAttribute('data-text', countdownElement.innerText);
    highlightToDoItem(timeLeft.days);
}

setInterval(updateCountdown, 1000);
updateCountdown();

// To-Do List
const todoListContainer = document.querySelector('.todo-list');

function parseToDoList(text) {
    const blocks = text.split('**Day');
    let html = '';
    for (const block of blocks) {
        if (block.trim() === '' || block.trim().startsWith('"**Halloween Countdown:')) continue;

        const lines = block.trim().split('\n');
        const dayLine = lines.shift().replace(/\*\*/g, '').trim();
        const dayMatch = dayLine.match(/(\d+)/);
        const dayNumber = dayMatch ? parseInt(dayMatch[0], 10) : (dayLine.includes('HALLOWEEN') ? 0 : null);

        if (dayNumber !== null) {
            let listItems = '';
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('- ')) {
                    listItems += `<li>${trimmedLine.substring(2)}</li>`;
                } else if (trimmedLine) {
                    listItems += `<p>${trimmedLine}</p>`;
                }
            }

            html += `
                <div class="todo-item" data-day="${dayNumber}">
                    <h3>Day ${dayLine}</h3>
                    <ul>${listItems}</ul>
                </div>
            `;
        }
    }
    return html;
}


async function loadToDoList() {
    try {
        const response = await fetch('docs/halloweenToDoList.txt');
        const text = await response.text();
        if (todoListContainer) {
            todoListContainer.innerHTML = parseToDoList(text);
        }
    } catch (error) {
        console.error('Error loading to-do list:', error);
        if (todoListContainer) {
            todoListContainer.innerHTML = '<p>Could not load the to-do list.</p>';
        }
    }
}

let lastHighlightedItem = null;

function highlightToDoItem(currentDays) {
    const todoItems = document.querySelectorAll('.todo-item');
    let closestItem = null;
    let minDiff = Infinity;

    todoItems.forEach(item => {
        item.classList.remove('highlight');
        const day = parseInt(item.dataset.day, 10);
        if (!isNaN(day)) {
            const diff = day - currentDays;
            if (diff >= 0 && diff < minDiff) {
                minDiff = diff;
                closestItem = item;
            }
        }
    });

    if (closestItem) {
        closestItem.classList.add('highlight');
        if (closestItem !== lastHighlightedItem) {
            closestItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            lastHighlightedItem = closestItem;
        }
    }
}


loadToDoList();

// Ghost interaction
ghost.addEventListener('click', () => {
    pumpkinEyes.forEach(eye => {
        eye.style.borderBottomColor = 'var(--accent-color)';
        setTimeout(() => {
            eye.style.borderBottomColor = '#000';
        }, 2000);
    });
});

// Sound
ambientSound.play().catch(() => {
    // Autoplay was prevented.
});

soundToggleButton.addEventListener('click', () => {
    if (!ambientSound.paused) {
        ambientSound.pause();
        soundToggleButton.textContent = 'Play Sound';
    } else {
        ambientSound.play();
        soundToggleButton.textContent = 'Stop Sound';
    }
});

// Parallax
window.addEventListener('scroll', () => {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const top = window.pageYOffset;
    parallaxLayers.forEach(layer => {
        const speed = layer.getAttribute('data-speed');
        layer.style.transform = `translateY(${top * speed}px)`;
    });
});

// Easter Egg
const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            easterEggElement.style.display = 'block';
            setTimeout(() => {
                easterEggElement.style.display = 'none';
            }, 3000);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

document.body.style.backgroundColor = '#1a1a1a';

// Dynamic Year
document.getElementById('year').textContent = new Date().getFullYear();
