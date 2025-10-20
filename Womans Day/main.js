const stage = document.getElementById("emoji-stage");
const audio = document.getElementById("audio");
const muteButton = document.getElementById("stop-play");

let playing = true;

const config = {
    emojis: ["❤️", "🌸", "✨", "💫", "😍", "🥰", "🌟", "💗", "💟", "🇻🇳"],
    spawnInterval: 400,
    minSize: 28,
    maxSize: 36,
    maxOnScreen: 40,
    repelRadius: 120,
    repelForce: 0.15,
    collisionDistance: 25,
    friction: 0.96,
    floatForce: 0.01,
    swayForce: 0.3,
};

let emojis = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

// Helpers
function rand(min, max) {
    return Math.random() * (max - min) + min;
}
function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
}

// Spawn emoji
function spawnEmoji() {
    if (emojis.length >= config.maxOnScreen) return;

    const el = document.createElement("div");
    el.className = "emoji";
    el.textContent = config.emojis[randInt(0, config.emojis.length - 1)];
    el.style.position = "absolute";
    el.style.fontSize = `${rand(config.minSize, config.maxSize)}px`;
    el.style.pointerEvents = "none";
    el.style.userSelect = "none";
    el.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";
    el.style.opacity = 0.9;

    const emoji = {
        el,
        x: rand(0, window.innerWidth),
        y: rand(window.innerHeight * 0.2, window.innerHeight * 0.8), // spawn on-screen
        vx: rand(-0.3, 0.3),
        vy: rand(-0.3, -0.6),
        sway: rand(-config.swayForce, config.swayForce),
        rotation: rand(-10, 10),
    };

    stage.appendChild(el);
    emojis.push(emoji);
}

// Mouse tracking
window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Physics loop
function updateEmojis() {
    for (let i = 0; i < emojis.length; i++) {
        const e = emojis[i];

        // Mouse repulsion
        const dx = e.x - mouse.x;
        const dy = e.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.repelRadius && dist > 0) {
            const angle = Math.atan2(dy, dx);
            const force = Math.min(
                (config.repelRadius - dist) * config.repelForce,
                2
            );
            e.vx += Math.cos(angle) * force;
            e.vy += Math.sin(angle) * force;
        }

        // Collision with other emojis
        for (let j = i + 1; j < emojis.length; j++) {
            const o = emojis[j];
            const dx2 = o.x - e.x;
            const dy2 = o.y - e.y;
            const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            if (dist2 < config.collisionDistance && dist2 > 0) {
                const angle = Math.atan2(dy2, dx2);
                const force = Math.min(0.05 / dist2, 0.05);
                e.vx -= Math.cos(angle) * force;
                e.vy -= Math.sin(angle) * force;
                o.vx += Math.cos(angle) * force;
                o.vy += Math.sin(angle) * force;
            }
        }

        // Float upward
        e.vy -= config.floatForce;

        // Slight sway
        e.vx += Math.sin(Date.now() * 0.002 + i) * 0.01;

        // Update positions
        e.x += e.vx;
        e.y += e.vy;

        // Friction
        e.vx *= config.friction;
        e.vy *= config.friction;

        // Clamp max speed
        const maxSpeed = 5;
        e.vx = Math.max(Math.min(e.vx, maxSpeed), -maxSpeed);
        e.vy = Math.max(Math.min(e.vy, maxSpeed), -maxSpeed);

        // Remove if offscreen
        if (
            e.y < -50 ||
            e.y > window.innerHeight + 50 ||
            e.x < -50 ||
            e.x > window.innerWidth + 50
        ) {
            stage.removeChild(e.el);
            emojis.splice(i, 1);
            i--;
            continue;
        }

        // Apply transform + rotation
        e.el.style.transform = `translate(${e.x}px, ${e.y}px) rotate(${e.rotation}deg)`;
        e.rotation += Math.sin(Date.now() * 0.003 + i) * 0.5; // slow rotation
    }

    requestAnimationFrame(updateEmojis);
}

// Music mute
function mute() {
    if (playing) {
        audio.muted = true;
        playing = false;
        muteButton.innerText = "🔇 Play Music";
    } else {
        audio.muted = false;
        playing = true;
        muteButton.innerText = "🔊 Mute Music";
    }
}

// Run
setInterval(spawnEmoji, config.spawnInterval);
updateEmojis();
