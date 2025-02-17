const gaugeFill = document.querySelector('.gauge-fill');
const gaugeCover = document.querySelector('.gauge-cover');
const refillButtons = document.querySelectorAll('.refill-buttons button');
const lilyImage = document.querySelector('.lily-image');
const cheerSound = document.getElementById('cheerSound');
const crySound = document.getElementById('crySound');

let fuelLevel = 0;
let stickers = 0;
let emojiIndex = 0;
const emojis = ['🦄', '💓', '🌈', '🌟'];
let incrementAmount = 0.20;
let depletionRatePerMinute = 0.01;
let depletionAmountPerSecond = depletionRatePerMinute / 60;
let incrementInterval;
let depletionInterval;
let isPaused = false;

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', togglePause);

function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Start' : 'Pause';
    if (isPaused) {
        clearInterval(depletionInterval);
    } else {
        startDepletion();
    }
}

function updateGauge() {
    const angle = fuelLevel * 360;
    const radius = 90;
    const centerX = 100;
    const centerY = 100;
    const startX = centerX;
    const startY = centerY - radius;
    const x = centerX + radius * Math.cos((angle - 90) * Math.PI / 180);
    const y = centerY + radius * Math.sin((angle - 90) * Math.PI / 180);
    const d = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${x} ${y} Z`;

    gaugeFill.setAttribute('d', d);
    gaugeCover.textContent = `${Math.floor(fuelLevel * 100)}%`;
    const stickersDisplay = document.querySelector('.stickers');
    const starStickersDisplay = document.querySelector('.star-stickers');
    let starString = '';
    for (let i = 0; i < stickers; i++) {
        starString += '🌟';
    }
    //starStickersDisplay.textContent = starString;

    if (fuelLevel >= 1) {
        clearInterval(incrementInterval);
        clearInterval(depletionInterval);
        gaugeCover.textContent = "Yay, Lily!";
        lilyImage.src = "lily_happy.png";
        cheerSound.play();
    } else if (fuelLevel <= 0) {
        clearInterval(incrementInterval);
        clearInterval(depletionInterval);
        gaugeCover.textContent = "Uh Oh!";
        lilyImage.src = "lily_sad.png";
        crySound.play();
    } else {
        lilyImage.src = "lily_normal.png";
    }
}

function incrementFuel(event) {
    stickers++;
    const stickersDisplay = document.querySelector('.stickers');
    stickersDisplay.textContent = `Stickers: ${stickers}`;
    fuelLevel += incrementAmount;
    if (fuelLevel > 1) fuelLevel = 1;

    const starStickersDisplay = document.querySelector('.star-stickers');
    starStickersDisplay.textContent += emojis[emojiIndex];
    emojiIndex = (emojiIndex + 1) % emojis.length;

    updateGauge();
    startDepletion();
    cheerSound.play();

    // Disable the button for 1 second
    const button = event.target;
    button.disabled = true;
    const originalImage = lilyImage.src;
    lilyImage.src = "lily_happy.png";
    setTimeout(() => {
        button.disabled = false;
        lilyImage.src = originalImage;
    }, 3000);
}

function depleteFuel() {
    if (isPaused) return;
    fuelLevel -= depletionAmountPerSecond;
    if (fuelLevel < 0) fuelLevel = 0;
    updateGauge();
}

function startDepletion() {
    if (isPaused) return;
    clearInterval(depletionInterval);
    depletionInterval = setInterval(() => {
        depleteFuel();
    }, 1000);
}

refillButtons.forEach(button => {
    button.addEventListener('click', (event) => incrementFuel(event));
});

updateGauge();