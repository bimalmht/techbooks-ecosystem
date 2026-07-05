const API_BASE_URL = 'https://api.techbookssolutions.com.np';

// Ensure the code securely runs only after the DOM structure is fully drawn
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchServices);
} else {
    fetchServices();
}

async function fetchServices() {
    const enterpriseContainer = document.getElementById('enterprise-services-container');
    const localContainer = document.getElementById('local-services-container');

    if (!enterpriseContainer || !localContainer) {
        console.error("Critical Layout Error: One or more target service engine DOM containers are missing.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/services`);
        if (!response.ok) throw new Error(`Network returned code: ${response.status}`);

        const services = await response.json();
        console.log("Successfully fetched database rows:", services);

        enterpriseContainer.innerHTML = '';
        localContainer.innerHTML = '';

        if (!Array.isArray(services) || services.length === 0) {
            enterpriseContainer.innerHTML = '<p class="text-slate-500 text-sm">No enterprise engines deployed.</p>';
            localContainer.innerHTML = '<p class="text-slate-400 text-sm">No local services found.</p>';
            return;
        }

        services.forEach(item => {
            const engineType = String(item.engine_type).toLowerCase().trim();
            if (engineType === 'enterprise') {
                enterpriseContainer.appendChild(createServiceCard(item, 'dark'));
            } else if (engineType === 'local') {
                localContainer.appendChild(createServiceCard(item, 'light'));
            }
        });

    } catch (error) {
        console.error('Error rendering dynamic components:', error);
        enterpriseContainer.innerHTML = `<p class="text-red-400 text-sm">Failed to map enterprise cloud nodes.</p>`;
        localContainer.innerHTML = `<p class="text-red-500 text-sm">Failed to map local cluster pipelines.</p>`;
    }
}

function createServiceCard(service, theme) {
    const card = document.createElement('div');
    if (theme === 'dark') {
        card.className = 'p-6 bg-slate-50/60 rounded-xl border border-slate-200/60 hover:shadow-md transition-all duration-300 mb-4';
        card.innerHTML = `
          <h3 class="text-lg font-bold text-primaryDark mb-1">${service.service_name || 'Unnamed Deployment'}</h3>
          <p class="text-slate-500 text-sm leading-relaxed">${service.description || 'No description provided.'}</p>
        `;
    } else {
        card.className = 'p-6 bg-white rounded-xl border border-slate-200/60 hover:border-slate-300 transition-all duration-200 shadow-sm mb-4';
        card.innerHTML = `
          <h3 class="text-xl font-semibold text-slate-900 mb-2">${service.service_name || 'Unnamed Service'}</h3>
          <p class="text-slate-600 text-sm leading-relaxed">${service.description || 'No description provided.'}</p>
        `;
    }
    return card;
}

async function fetchAnnouncements() {
    const bar = document.getElementById('announcement-bar');
    if (!bar) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/announcements`);
        if (!response.ok) return;

        const announcements = await response.json();
        const activeNotice = announcements.find(a => a.is_active === 1 || a.is_active === true);

        if (activeNotice) {
            bar.innerHTML = `<span>📢 ${activeNotice.title}: ${activeNotice.content}</span>`;
            bar.classList.remove('hidden');
        }
    } catch (error) {
        console.log('Announcements pipeline offline or empty.');
    }
}

document.addEventListener('DOMContentLoaded', fetchAnnouncements);

// ==========================================================================
// HERO MOCKUP TELEMETRY STREAM SIMULATION
// ==========================================================================
function startTelemetryStream() {
    const streamContainer = document.getElementById('terminal-stream');
    if (!streamContainer) return;

    const simulatedLogs = [
        'GET /api/services - <span class="text-accent font-semibold">200 OK</span>',
        '<span class="text-slate-400">[info] D1 database pool connection synchronized.</span>',
        'GET /api/announcements - <span class="text-accent font-semibold">200 OK</span>',
        '<span class="text-slate-500">[cache] Edge asset request served via cache-layer (HIT)</span>',
        'POST /api/auth/verify - <span class="text-amber-400 font-semibold">401 Auth Required</span>',
        '<span class="text-slate-400">[info] Refreshing secure cluster telemetry keys...</span>',
        'GET /api/services - <span class="text-accent font-semibold">200 OK</span>'
    ];

    let logIndex = 0;
    setInterval(() => {
        if (streamContainer.children.length >= 5) {
            streamContainer.removeChild(streamContainer.firstElementChild);
        }
        const logLine = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        logLine.innerHTML = `<span class="text-slate-600 font-normal">[${timestamp}]</span> ${simulatedLogs[logIndex]}`;
        streamContainer.appendChild(logLine);
        logIndex = (logIndex + 1) % simulatedLogs.length;
    }, 3500);
}

document.addEventListener('DOMContentLoaded', startTelemetryStream);

// ==========================================================================
// CLIENT INTAKE HUB LOGIC
// ==========================================================================
function initializeIntakePortal() {
    const form = document.getElementById('quote-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const statusMsg = document.getElementById('form-status-message');

    if (!form || !submitBtn || !statusMsg) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('client-name').value.trim();
        const email = document.getElementById('client-email').value.trim();
        const scope = document.getElementById('engine-scope').value;
        const specs = document.getElementById('project-specs').value.trim();

        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
        submitBtn.innerHTML = `<span>Processing Node Pipeline...</span>`;

        statusMsg.classList.remove('hidden', 'text-emerald-500', 'text-red-500');
        statusMsg.classList.add('text-slate-500');
        statusMsg.innerText = "[system] Compiling payload packets...";

        try {
            const response = await fetch(`${API_BASE_URL}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, scope, specs })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Transmission failed.');

            statusMsg.classList.remove('text-slate-500');
            statusMsg.classList.add('text-emerald-500');
            statusMsg.innerHTML = `✓ Transmission Success. Project ticket generated for ${email}.`;
            form.reset();

        } catch (error) {
            statusMsg.classList.remove('text-slate-500');
            statusMsg.classList.add('text-red-500');
            statusMsg.innerText = `✕ Error: ${error.message}`;
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            submitBtn.innerHTML = `<span>Transmit Architecture Specifications</span>`;
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeIntakePortal);

// INTERSECTION OBSERVER FOR DYNAMIC SCROLL ANIMATIONS
document.addEventListener("DOMContentLoaded", () => {
    const scrollElements = document.querySelectorAll(".reveal-on-scroll");
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                elementObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    scrollElements.forEach((el) => elementObserver.observe(el));
});

// DYNAMIC MARQUEE RECONSTRUCTION ENGINE
// ==========================================================================
async function renderDynamicPartners() {
    const track = document.getElementById('marquee-track');
    if (!track) return;

    // 🛠️ FIXED: Populated baseline elements with your default testing list
    const productionBaseline = [
        "Advance Power Research Pvt. Ltd.",
        "COCA-COLA",
        "SAP LOGISTICS",
        "CLOUDFLARE",
        "TAEKWONDO NET",
        "MICROSOFT",
        "ORACLE"
    ];

    try {
        const response = await fetch(`${API_BASE_URL}/api/partners`);
        if (!response.ok) throw new Error(`Partners endpoint unreachable. Code: ${response.status}`);

        const databaseRows = await response.json();
        let activeClients = databaseRows
            .filter(item => item.is_active === 1 || item.is_active === true)
            .map(item => item.client_name.trim());

        if (activeClients.length === 0) {
            activeClients = productionBaseline;
        }

        const continuousLoopList = [...activeClients, ...activeClients];
        track.innerHTML = continuousLoopList.map(clientName => `
            <span class="text-xl font-bold tracking-tight text-slate-300 grayscale hover:grayscale-0 transition-all duration-200 cursor-pointer uppercase">
                ${clientName}
            </span>
        `).join('');

    } catch (error) {
        console.warn('Backend endpoint offline. Engaging client ledger fallback safety parameters:', error.message);
        const continuousLoopList = [...productionBaseline, ...productionBaseline];
        track.innerHTML = continuousLoopList.map(clientName => `
            <span class="text-xl font-bold tracking-tight text-slate-300 grayscale hover:grayscale-0 transition-all duration-200 cursor-pointer uppercase">
                ${clientName}
            </span>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', renderDynamicPartners);

// ==========================================================================
// HERO BACKGROUND SINE-WAVE RIBBON CONNECTOR ENGINE (GRID LINK INTEGRATION)
// ==========================================================================
function initHeroNetworkAnimation() {
    const canvas = document.getElementById('hero-network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth || window.innerWidth;
        canvas.height = parent.offsetHeight || 550;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Multi-stage latency window monitors to capture post-layout adjustments cleanly
    setTimeout(resizeCanvas, 50);
    setTimeout(resizeCanvas, 200);

    // Visibility config parameters
    const waveConfig = [
        { length: 0.003, amplitude: 180, speed: 0.005, offset: 0, opacity: 0.35 },
        { length: 0.005, amplitude: 110, speed: 0.008, offset: 100, opacity: 0.20 },
        { length: 0.002, amplitude: 210, speed: 0.004, offset: 200, opacity: 0.15 }
    ];

    let increment = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Cache wave points as a structured array matrix
        let pointMatrix = [];

        waveConfig.forEach((wave, waveIdx) => {
            ctx.beginPath();
            let wavePoints = [];

            // Sample coordinates smoothly across the layout width
            for (let i = 0; i < canvas.width; i += 3) {
                const y = (canvas.height / 2) +
                    Math.sin(i * wave.length + increment * wave.speed + wave.offset) * wave.amplitude *
                    Math.sin(increment * 0.001);

                // Store both the X coordinate and Y value as an explicit point object
                wavePoints.push({ x: i, y: y });

                if (i === 0) {
                    ctx.moveTo(i, y);
                } else {
                    ctx.lineTo(i, y);
                }
            }

            pointMatrix[waveIdx] = wavePoints;

            ctx.strokeStyle = `rgba(0, 180, 134, ${wave.opacity})`;
            ctx.lineWidth = 3.5;
            ctx.lineCap = 'round';
            ctx.stroke();
        });

        // 🔗 🛠️ FIXED: Bulletproof coordinate tracking for grid link connections
        // We step through the stored points array directly, drawing a link line every 12 points (~36px apart)
        if (pointMatrix.length >= 2 && pointMatrix[0].length > 0) {
            const step = 12;
            for (let k = 0; k < pointMatrix[0].length; k += step) {
                const p0 = pointMatrix[0][k];
                const p1 = pointMatrix[1][k];
                const p2 = pointMatrix[2] ? pointMatrix[2][k] : null;

                if (p0 && p1) {
                    ctx.beginPath();
                    ctx.moveTo(p0.x, p0.y);
                    ctx.lineTo(p1.x, p1.y);
                    // Made the links slightly brighter (0.18 opacity) so they are easily visible over the card elements
                    ctx.strokeStyle = `rgba(0, 180, 134, 0.18)`;
                    ctx.lineWidth = 1.0;
                    ctx.stroke();
                }

                if (p1 && p2) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 180, 134, 0.12)`;
                    ctx.lineWidth = 1.0;
                    ctx.stroke();
                }
            }
        }

        increment += 1;
        requestAnimationFrame(animate);
    }
    animate();
}

document.addEventListener('DOMContentLoaded', initHeroNetworkAnimation);