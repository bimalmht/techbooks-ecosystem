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

    // Defensive fallback checks to make sure the containers exist
    if (!enterpriseContainer || !localContainer) {
        console.error("Critical Layout Error: One or more target service engine DOM containers are missing.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/services`);
        if (!response.ok) throw new Error(`Network returned code: ${response.status}`);

        const services = await response.json();
        console.log("Successfully fetched database rows:", services); // Debug helper trace

        // Clear loading texts completely
        enterpriseContainer.innerHTML = '';
        localContainer.innerHTML = '';

        if (!Array.isArray(services) || services.length === 0) {
            enterpriseContainer.innerHTML = '<p class="text-slate-500 text-sm">No enterprise engines deployed.</p>';
            localContainer.innerHTML = '<p class="text-slate-400 text-sm">No local services found.</p>';
            return;
        }

        // Process and append elements dynamically
        services.forEach(item => {
            // Normalize comparison to prevent case-sensitive mismatches
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
        card.className = 'p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 shadow-sm mb-4';
        card.innerHTML = `
      <h3 class="text-xl font-semibold text-white mb-2">${service.service_name || 'Unnamed Deployment'}</h3>
      <p class="text-slate-400 text-sm leading-relaxed">${service.description || 'No description provided.'}</p>
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
        const response = await fetch('https://api.techbookssolutions.com.np/api/announcements');
        if (!response.ok) return; // Fail silently if no active notices exist

        const announcements = await response.json();

        // Look for an active announcement record
        const activeNotice = announcements.find(a => a.is_active === 1 || a.is_active === true);

        if (activeNotice) {
            bar.innerHTML = `<span>📢 ${activeNotice.title}: ${activeNotice.content}</span>`;
            bar.classList.remove('hidden'); // Reveal to the user smoothly
        }
    } catch (error) {
        console.log('Announcements pipeline offline or empty.');
    }
}

// Add inside your DOMContentLoaded listener loop:
document.addEventListener('DOMContentLoaded', () => {
    fetchAnnouncements();
});
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
        // Keep container cleanly capped at 5 lines to prevent scrolling overflows
        if (streamContainer.children.length >= 5) {
            streamContainer.removeChild(streamContainer.firstElementChild);
        }

        const logLine = document.createElement('div');
        // Rotate through arrays using timestamp markers
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        logLine.innerHTML = `<span class="text-slate-600 font-normal">[${timestamp}]</span> ${simulatedLogs[logIndex]}`;

        streamContainer.appendChild(logLine);

        logIndex = (logIndex + 1) % simulatedLogs.length;
    }, 3500); // appends a new simulation line tracking every 3.5 seconds
}

// Trigger telemetry simulation alongside core database loading pipelines
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
        e.preventDefault(); // Halt standard browser layout reload

        // Extract inputs safely
        const name = document.getElementById('client-name').value.trim();
        const email = document.getElementById('client-email').value.trim();
        const scope = document.getElementById('engine-scope').value;
        const specs = document.getElementById('project-specs').value.trim();

        // Visual Transition: Processing State
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
        submitBtn.innerHTML = `<span>Processing Node Pipeline...</span>`;

        statusMsg.classList.remove('hidden', 'text-emerald-500', 'text-red-500');
        statusMsg.classList.add('text-slate-500');
        statusMsg.innerText = "[system] Compiling payload packets...";

        // Simulated network processing delay (Will connect to a Worker endpoint later)
        // REPLACE your temporary setTimeout code block with this robust live fetch loop:
        try {
            const response = await fetch(`${API_BASE_URL}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, scope, specs })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Transmission failed.');

            // Complete Success Response Transition
            statusMsg.classList.remove('text-slate-500');
            statusMsg.classList.add('text-emerald-500');
            statusMsg.innerHTML = `✓ Transmission Success. Project ticket generated for ${email}.`;
            form.reset();

        } catch (error) {
            statusMsg.classList.remove('text-slate-500');
            statusMsg.classList.add('text-red-500');
            statusMsg.innerText = `✕ Error: ${error.message}`;
        } finally {
            // Always restore button UI elements to original operational state
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            submitBtn.innerHTML = `<span>Transmit Architecture Specifications</span>`;
        }
    });
}

// Map initiation hook inside DOM load loop
document.addEventListener('DOMContentLoaded', initializeIntakePortal);