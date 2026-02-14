// ============================================
// SUPABASE
// ============================================
const SUPABASE_URL = 'https://wjigmyipcrbdunxgbtut.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7XCTWEKGWCpyFOOLUF34Kg_ej83d_Fa';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// CONFIG CAPTEURS
// ============================================
const SENSOR_CONFIG = {
    'T': {
        name: 'Température', unit: '°C', color: '#ff6b6b', class: 'temp',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
        getStatus: v => v < 16 ? 'Froid' : v < 18 ? 'Frais' : v <= 24 ? 'Confortable' : v <= 26 ? 'Chaud' : 'Très chaud',
        format: v => Number(v).toFixed(1),
        // Gradient multi-paliers : bleu très clair (min) → bleu (7°) → orange (18°) → rouge (chaud)
        getColor: v => {
            // Paliers : [-5, 7, 18, 35]
            let r, g, b;
            if (v <= -5) {
                // Bleu très clair
                r = 170; g = 215; b = 255;
            } else if (v <= 7) {
                // -5 → 7 : bleu très clair → bleu
                const t = (v + 5) / 12;
                r = Math.round(170 - t * 120);  // 170 → 50
                g = Math.round(215 - t * 95);   // 215 → 120
                b = Math.round(255 - t * 25);   // 255 → 230
            } else if (v <= 18) {
                // 7 → 18 : bleu → orange
                const t = (v - 7) / 11;
                r = Math.round(50 + t * 195);   // 50 → 245
                g = Math.round(120 + t * 40);   // 120 → 160
                b = Math.round(230 - t * 190);  // 230 → 40
            } else if (v <= 35) {
                // 18 → 35 : orange → rouge
                const t = (v - 18) / 17;
                r = Math.round(245 + t * 10);   // 245 → 255
                g = Math.round(160 - t * 120);  // 160 → 40
                b = Math.round(40 - t * 10);    // 40 → 30
            } else {
                // > 35 : rouge vif
                r = 255; g = 40; b = 30;
            }
            return `rgb(${r},${g},${b})`;
        },
        // Seuils d'alerte
        thresholds: [
            { value: 28, color: '#ff9f43', label: 'Chaud', dash: [6, 4] },
            { value: 32, color: '#ee5a24', label: 'Très chaud', dash: [4, 4] },
            { value: 14, color: '#54a0ff', label: 'Froid', dash: [6, 4] }
        ]
    },
    'H': {
        name: 'Humidité', unit: '%', color: '#4ecdc4', class: 'humidity',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
        getStatus: v => v < 30 ? 'Air sec' : v < 40 ? 'Légèrement sec' : v <= 60 ? 'Confortable' : v <= 70 ? 'Humide' : 'Très humide',
        format: v => Math.round(Number(v)).toString(),
        getColor: v => {
            const t = Math.max(0, Math.min(1, (v - 20) / 60));
            const r = Math.round(100 - t * 30);
            const g = Math.round(180 + t * 40);
            const b = Math.round(160 + t * 60);
            return `rgb(${r},${g},${b})`;
        },
        thresholds: [
            { value: 70, color: '#ff9f43', label: 'Humide', dash: [6, 4] },
            { value: 30, color: '#ff9f43', label: 'Sec', dash: [6, 4] }
        ]
    },
    'L': {
        name: 'Luminosité', unit: ' lux', color: '#ffd93d', class: 'lux',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>`,
        getStatus: v => v < 100 ? 'Sombre' : v < 300 ? 'Faible éclairage' : v < 500 ? 'Modéré' : v < 800 ? 'Bonne luminosité' : 'Très lumineux',
        format: v => Math.round(Number(v)).toString(),
        // Gradient : noir (sombre) → jaune clair (plein jour)
        getColor: v => {
            const t = Math.max(0, Math.min(1, v / 800));
            const r = Math.round(t * 255);
            const g = Math.round(t * 230);
            const b = Math.round(t * 80);
            return `rgb(${r},${g},${b})`;
        },
        thresholds: [
            { value: 800, color: '#ff9f43', label: 'Très lumineux', dash: [6, 4] }
        ]
    },
    'E': {
        name: "Niveau d'eau", unit: '%', color: '#a29bfe', class: 'water',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><line x1="7" y1="13" x2="17" y2="13"/></svg>`,
        getStatus: v => v < 20 ? 'Critique' : v < 40 ? 'Bas' : v <= 70 ? 'Normal' : v <= 90 ? 'Haut' : 'Plein',
        format: v => Math.round(Number(v)).toString(),
        getColor: v => {
            const t = Math.max(0, Math.min(1, v / 100));
            const r = Math.round(200 - t * 80);
            const g = Math.round(120 + t * 60);
            const b = Math.round(180 + t * 75);
            return `rgb(${r},${g},${b})`;
        },
        thresholds: [
            { value: 20, color: '#ee5a24', label: 'Critique', dash: [4, 4] },
            { value: 40, color: '#ff9f43', label: 'Bas', dash: [6, 4] }
        ]
    }
};

// ============================================
// CONFIG PIÈCES
// ============================================
const ROOM_CONFIG = {
    'Salon': {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 10V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M4 10v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M2 10h20"/><path d="M7 19v2M17 19v2"/></svg>`,
        color: '#e17055',
        gradient: 'linear-gradient(135deg, #2d1f1f 0%, #4a2c2c 30%, #e17055 150%)'
    },
    'Cuisine': {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V2"/><path d="M9 2v8"/><path d="M9 11v11"/><path d="M18 2v4a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V2"/><path d="M16 8v14"/></svg>`,
        color: '#fdcb6e',
        gradient: 'linear-gradient(135deg, #2d2a1f 0%, #4a432c 30%, #fdcb6e 150%)'
    },
    'Serre': {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 10a4 4 0 0 0-4 4"/><path d="M12 10a4 4 0 0 1 4 4"/><path d="M12 2v8"/><path d="M12 14v8"/><path d="M5 20c2-2 4-3 7-3s5 1 7 3"/></svg>`,
        color: '#55a86b',
        gradient: 'linear-gradient(135deg, #1a2f1a 0%, #2d4a2d 30%, #55a86b 150%)'
    },
    'default': {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
        color: '#b2bec3',
        gradient: 'linear-gradient(135deg, #1f2020 0%, #3d4142 30%, #b2bec3 150%)'
    }
};

function getRoomConfig(name) {
    const n = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const [key, config] of Object.entries(ROOM_CONFIG)) {
        if (key === 'default') continue;
        const k = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (n.includes(k) || k.includes(n)) return config;
    }
    return ROOM_CONFIG['default'];
}

// ============================================
// PÉRIODES
// ============================================

// Helper : convertir une couleur rgb() en rgba()
function toRgba(color, alpha) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) return `rgba(${match[1]},${match[2]},${match[3]},${alpha})`;
    if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    return color;
}

// Helper : assombrir une couleur rgb pour fond de carte (texte blanc lisible)
function darkenColor(color, factor = 0.4) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
        const r = Math.round(parseInt(match[1]) * factor);
        const g = Math.round(parseInt(match[2]) * factor);
        const b = Math.round(parseInt(match[3]) * factor);
        return `rgb(${r},${g},${b})`;
    }
    return color;
}
const PERIODS = {
    '6h':  { count: 6,   label: '6h' },
    '24h': { count: 24,  label: '24h' },
    '2d':  { count: 48,  label: '2j' },
    '7d':  { count: 168, label: '7j' },
    '30d': { count: 720, label: '30j' }
};

// ============================================
// ÉTAT
// ============================================
const AppState = { currentRoom: null, currentSensor: null, currentPeriod: '24h' };
let data = { rooms: {} };
let mainChart = null;

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    createParticles();
    try {
        await loadAllData();
        document.getElementById('loadingScreen').classList.add('hidden');
        // Auto-refresh toutes les 10 secondes
        setInterval(() => refreshData(true), 10000);
    } catch (err) {
        console.error(err);
        document.querySelector('.loading-text').innerHTML =
            `<div class="error-message">Erreur de chargement<br><small>${err.message}</small></div>`;
        document.querySelector('.loading-spinner').style.display = 'none';
    }
});

// ============================================
// CHARGEMENT SUPABASE
// ============================================
async function loadAllData() {
    data = { rooms: {} };

    const { data: mesures, error } = await sb
        .from('mesures')
        .select('piece, capteur, valeur, timestamp')
        .order('timestamp', { ascending: true })
        .limit(50000);

    if (error) throw new Error('Erreur Supabase: ' + error.message);
    if (!mesures || !mesures.length) return;

    const byRoom = {};
    for (const m of mesures) {
        if (!byRoom[m.piece]) byRoom[m.piece] = {};
        if (!byRoom[m.piece][m.capteur]) byRoom[m.piece][m.capteur] = [];
        byRoom[m.piece][m.capteur].push(m);
    }

    for (const [piece, capteurs] of Object.entries(byRoom)) {
        const sensors = {};
        for (const [capteur, rows] of Object.entries(capteurs)) {
            const values = rows.map(r => Number(r.valeur));
            const last = rows[rows.length - 1];
            const config = SENSOR_CONFIG[capteur] || {
                name: capteur, unit: '', color: '#888', class: 'unknown',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`,
                getStatus: () => '', format: v => String(v), getColor: () => '#888', thresholds: []
            };
            sensors[capteur] = {
                type: capteur, config,
                current: Number(last.valeur),
                min: Math.min(...values),
                max: Math.max(...values),
                avg: values.reduce((a, b) => a + b, 0) / values.length,
                count: values.length,
                lastTimestamp: last.timestamp,
                history: rows.map(r => ({ value: Number(r.valeur), time: r.timestamp }))
            };
        }
        const lastTs = Object.values(sensors).reduce((max, s) =>
            s.lastTimestamp > max ? s.lastTimestamp : max, '');
        data.rooms[piece] = { id: piece, piece, sensors, lastMeasure: lastTs };
    }

    renderRooms();
}

// ============================================
// RAFRAÎCHISSEMENT
// ============================================
async function refreshData(silent = false) {
    const saved = { room: AppState.currentRoom, sensor: AppState.currentSensor, period: AppState.currentPeriod };
    if (!silent) {
        document.getElementById('refreshIndicator').classList.add('visible');
        setTimeout(() => document.getElementById('refreshIndicator').classList.remove('visible'), 2000);
    }
    try {
        await loadAllData();
        AppState.currentRoom = saved.room;
        AppState.currentSensor = saved.sensor;
        AppState.currentPeriod = saved.period;
        if (AppState.currentRoom && data.rooms[AppState.currentRoom]) {
            showDetail(AppState.currentRoom);
        }
    } catch (e) { console.error(e); }
}

// ============================================
// PAGE 1 : PIÈCES
// ============================================
function renderRooms() {
    const container = document.getElementById('roomsList');
    container.innerHTML = '';

    Object.values(data.rooms).forEach((room, i) => {
        const rc = getRoomConfig(room.piece);
        const card = document.createElement('div');
        card.className = 'room-card';
        card.style.animationDelay = `${i * 0.1}s`;
        card.onclick = () => showDetail(room.id);

        const temp = room.sensors['T'];
        const tempHTML = temp ? `
            <div class="card-temp">
                <div class="card-temp-value">${temp.config.format(temp.current)}°</div>
                <div class="card-temp-range">H:${temp.config.format(temp.max)}° L:${temp.config.format(temp.min)}°</div>
            </div>` : '';

        const status = temp ? temp.config.getStatus(temp.current) : '';

        // Couleur dynamique basée sur le capteur principal (T en priorité, sinon le premier)
        const primarySensor = temp || Object.values(room.sensors)[0];
        const dynamicColor = primarySensor?.config?.getColor
            ? primarySensor.config.getColor(primarySensor.current)
            : rc.color;
        const darkColor = darkenColor(dynamicColor, 0.35);
        const midColor = darkenColor(dynamicColor, 0.55);
        const cardGradient = `linear-gradient(135deg, ${darkColor} 0%, ${midColor} 100%)`;

        const badges = Object.entries(room.sensors)
            .filter(([t]) => t !== 'T')
            .map(([, s]) => `
                <div class="sensor-badge ${s.config.class}">
                    ${s.config.icon}
                    <span class="value">${s.config.format(s.current)}${s.config.unit}</span>
                </div>`).join('');

        card.innerHTML = `
            <div class="card-bg" style="background: ${cardGradient}"></div>
            <div class="card-content">
                <div class="card-header">
                    <div>
                        <div class="room-icon" style="background: ${toRgba(dynamicColor, 0.2)}; border: 1px solid ${toRgba(dynamicColor, 0.35)};">
                            ${rc.icon}
                        </div>
                        <div class="card-title">${room.piece}</div>
                        <div class="card-detail">${status}</div>
                    </div>
                    ${tempHTML}
                </div>
                <div class="card-sensors">${badges}</div>
            </div>`;
        container.appendChild(card);
    });
}

// ============================================
// PAGE 2 : DÉTAILS
// ============================================
function showDetail(roomId) {
    AppState.currentRoom = roomId;
    const room = data.rooms[roomId];
    if (!room) return;

    const rc = getRoomConfig(room.piece);
    const types = Object.keys(room.sensors);
    if (!AppState.currentSensor || !room.sensors[AppState.currentSensor]) {
        AppState.currentSensor = types.includes('T') ? 'T' : types[0];
    }

    document.getElementById('roomsPage').classList.add('hidden');
    document.getElementById('detailPage').classList.remove('hidden');
    document.getElementById('particles').classList.add('visible');
    document.getElementById('roomTitle').textContent = room.piece;

    // Mettre à jour le sélecteur de période
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.period === AppState.currentPeriod);
    });

    renderSensorsGrid(room);
    updateSensorDisplay(room);
    updateDetailBackground();
    window.scrollTo(0, 0);
}

function updateDetailBackground() {
    const room = data.rooms[AppState.currentRoom];
    if (!room) return;
    const sensor = room.sensors[AppState.currentSensor];
    if (!sensor) return;
    const color = sensor.config.getColor
        ? sensor.config.getColor(sensor.current)
        : sensor.config.color;
    const dark1 = darkenColor(color, 0.15);
    const dark2 = darkenColor(color, 0.3);
    document.getElementById('detailsBg').style.background =
        `linear-gradient(180deg, ${dark1} 0%, ${dark2} 50%, ${dark1} 100%)`;
}

function renderSensorsGrid(room) {
    const c = document.getElementById('sensorsGrid');
    c.innerHTML = '';
    Object.entries(room.sensors).forEach(([type, sensor]) => {
        const card = document.createElement('div');
        card.className = `sensor-card ${sensor.config.class} ${type === AppState.currentSensor ? 'active' : ''}`;
        card.onclick = () => selectSensor(type);
        card.innerHTML = `
            <div class="sensor-card-icon">${sensor.config.icon}</div>
            <div class="sensor-card-value">${sensor.config.format(sensor.current)}${sensor.config.unit}</div>
            <div class="sensor-card-label">${sensor.config.name}</div>`;
        c.appendChild(card);
    });
}

function selectSensor(type) {
    AppState.currentSensor = type;
    const room = data.rooms[AppState.currentRoom];
    document.querySelectorAll('.sensor-card').forEach(card => {
        const cfg = SENSOR_CONFIG[type];
        card.classList.toggle('active', cfg && card.classList.contains(cfg.class));
    });
    updateSensorDisplay(room);
    updateDetailBackground();
}

function setPeriod(period) {
    AppState.currentPeriod = period;
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.period === period);
    });
    const room = data.rooms[AppState.currentRoom];
    if (room) updateSensorDisplay(room);
}

// ============================================
// FILTRAGE PAR PÉRIODE
// ============================================
function filterByPeriod(history) {
    const periodConf = PERIODS[AppState.currentPeriod];
    if (!periodConf) return history;

    const n = periodConf.count;

    // Pour 7j et 30j : ne garder que 0h, 6h, 12h, 18h
    if (AppState.currentPeriod === '7d' || AppState.currentPeriod === '30d') {
        const filtered = history.filter(h => {
            const hour = new Date(h.time).getHours();
            return hour === 0 || hour === 6 || hour === 12 || hour === 18;
        });
        const count = AppState.currentPeriod === '7d' ? 28 : 120; // 4 mesures/jour × 7 ou 30
        return filtered.length <= count ? filtered : filtered.slice(-count);
    }

    // Pour 6h, 24h, 2j : toutes les mesures, limité aux N dernières
    if (history.length <= n) return history;
    return history.slice(-n);
}

// ============================================
// MISE À JOUR AFFICHAGE
// ============================================
function updateSensorDisplay(room) {
    const sensor = room.sensors[AppState.currentSensor];
    if (!sensor) return;

    // Filtrer par période
    const filteredHistory = filterByPeriod(sensor.history);
    const filteredValues = filteredHistory.map(h => h.value);
    const filteredMin = Math.min(...filteredValues);
    const filteredMax = Math.max(...filteredValues);
    const filteredAvg = filteredValues.reduce((a, b) => a + b, 0) / filteredValues.length;

    document.getElementById('mainValue').textContent =
        sensor.config.format(sensor.current) + sensor.config.unit;
    document.getElementById('mainStatus').textContent =
        sensor.config.getStatus(sensor.current);
    document.getElementById('mainHigh').textContent =
        'Max: ' + sensor.config.format(filteredMax) + sensor.config.unit;
    document.getElementById('mainLow').textContent =
        'Min: ' + sensor.config.format(filteredMin) + sensor.config.unit;

    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-item">
            <div class="stat-label">Moyenne</div>
            <div class="stat-value">${sensor.config.format(filteredAvg)}${sensor.config.unit}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Amplitude</div>
            <div class="stat-value">${sensor.config.format(filteredMax - filteredMin)}${sensor.config.unit}</div>
            <div class="stat-detail">écart min-max</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Mesures</div>
            <div class="stat-value">${filteredValues.length}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Dernière</div>
            <div class="stat-value">${formatTime(sensor.lastTimestamp)}</div>
        </div>`;

    updateChart(sensor, filteredHistory, filteredAvg);
    updateChartLegend(sensor);
    document.getElementById('lastUpdate').textContent = formatDateTime(room.lastMeasure);
}

// ============================================
// LÉGENDE DU GRAPHIQUE
// ============================================
function updateChartLegend(sensor) {
    const legend = document.getElementById('chartLegend');
    const thresholds = sensor.config.thresholds || [];

    let html = `<div class="legend-item">
        <div class="legend-zone" style="background: ${sensor.config.color}"></div>
        <span>Zone min/max</span>
    </div>`;

    thresholds.forEach(t => {
        html += `<div class="legend-item">
            <div class="legend-color" style="background: ${t.color}"></div>
            <span>${t.label} (${sensor.config.format(t.value)}${sensor.config.unit})</span>
        </div>`;
    });

    legend.innerHTML = html;
}

// ============================================
// GRAPHIQUE
// ============================================
function updateChart(sensor, filteredHistory, avg) {
    const ctx = document.getElementById('mainChart').getContext('2d');

    // Données
    const labels = filteredHistory.map(h => h.time);
    const values = filteredHistory.map(h => h.value);

    // Couleurs par point (gradient dynamique)
    const getColorFn = sensor.config.getColor || (() => sensor.config.color);
    const pointColors = values.map(v => getColorFn(v));

    // Zone min/max glissante (fenêtre de 5 points)
    const windowSize = Math.max(3, Math.floor(values.length / 12));
    const minBand = [];
    const maxBand = [];
    for (let i = 0; i < values.length; i++) {
        const start = Math.max(0, i - windowSize);
        const end = Math.min(values.length, i + windowSize + 1);
        const window = values.slice(start, end);
        minBand.push(Math.min(...window));
        maxBand.push(Math.max(...window));
    }

    // Seuils visibles dans la plage du graphique
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const margin = (dataMax - dataMin) * 0.15;
    const yMin = dataMin - margin;
    const yMax = dataMax + margin;
    const thresholds = (sensor.config.thresholds || []).filter(t =>
        t.value >= yMin && t.value <= yMax
    );

    // Datasets seuils
    const thresholdDatasets = thresholds.map(t => ({
        data: new Array(values.length).fill(t.value),
        borderColor: t.color,
        borderWidth: 1.5,
        borderDash: t.dash || [6, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tension: 0,
        order: 2
    }));

    // Format des labels selon la période
    const formatLabel = (ts) => {
        const count = PERIODS[AppState.currentPeriod]?.count || 24;
        if (count <= 6) return formatTime(ts);
        if (count <= 24) return formatTime(ts);
        if (count <= 168) return formatDayTime(ts);
        return formatDayShort(ts);
    };
    const formattedLabels = labels.map(formatLabel);

    // Indices des points à minuit (0h00)
    const midnightIndices = [];
    const midnightDates = [];
    labels.forEach((ts, i) => {
        const d = new Date(ts);
        if (d.getHours() === 0) {
            midnightIndices.push(i);
            midnightDates.push(d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }));
        }
    });

    // Plugin lignes verticales à minuit
    const midnightLinesPlugin = {
        id: 'midnightLines',
        afterDraw(chart) {
            const { ctx, chartArea, scales } = chart;
            if (!scales.x || midnightIndices.length === 0) return;

            ctx.save();
            midnightIndices.forEach((idx, i) => {
                const x = scales.x.getPixelForValue(idx);
                if (x < chartArea.left || x > chartArea.right) return;

                // Ligne verticale pointillée
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.moveTo(x, chartArea.top);
                ctx.lineTo(x, chartArea.bottom);
                ctx.stroke();
                ctx.setLineDash([]);

                // Label date au-dessus
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.font = '10px -apple-system, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(midnightDates[i], x, chartArea.top - 4);
            });
            ctx.restore();
        }
    };

    if (mainChart) { mainChart.destroy(); mainChart = null; }

    mainChart = new Chart(ctx, {
        type: 'line',
        plugins: [midnightLinesPlugin],
        data: {
            labels: formattedLabels,
            datasets: [
                // Zone min/max (en arrière-plan)
                {
                    data: maxBand,
                    borderColor: 'transparent',
                    backgroundColor: sensor.config.color + '12',
                    fill: '+1',
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    tension: 0.4,
                    order: 3
                },
                {
                    data: minBand,
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    tension: 0.4,
                    order: 3
                },
                // Courbe principale
                {
                    data: values,
                    borderColor: sensor.config.color,
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 8,
                    pointBackgroundColor: pointColors,
                    pointBorderColor: pointColors,
                    pointHoverBackgroundColor: pointColors,
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    segment: {
                        borderColor: (ctx) => {
                            if (!ctx.p0 || !ctx.p1) return sensor.config.color;
                            const avg = (ctx.p0.parsed.y + ctx.p1.parsed.y) / 2;
                            return getColorFn(avg);
                        }
                    },
                    order: 1
                },
                // Seuils
                ...thresholdDatasets
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: midnightIndices.length > 0 ? 18 : 0 } },
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 15, 0.95)',
                    titleColor: '#fff',
                    bodyColor: 'rgba(255,255,255,0.85)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 1,
                    cornerRadius: 12,
                    padding: 14,
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    displayColors: false,
                    filter: (item) => item.datasetIndex === 2, // Seulement la courbe principale
                    callbacks: {
                        title: (items) => {
                            if (!items.length) return '';
                            const idx = items[0].dataIndex;
                            const ts = filterByPeriod(
                                data.rooms[AppState.currentRoom]?.sensors[AppState.currentSensor]?.history || []
                            )[idx]?.time;
                            return ts ? formatDateTimeFull(ts) : items[0].label;
                        },
                        label: (item) => {
                            const val = item.raw;
                            const formatted = sensor.config.format(val) + sensor.config.unit;
                            const ecart = val - avg;
                            const sign = ecart >= 0 ? '+' : '';
                            const status = sensor.config.getStatus(val);
                            return [
                                `Valeur : ${formatted}`,
                                `État : ${status}`,
                                `Écart moy. : ${sign}${sensor.config.format(ecart)}${sensor.config.unit}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
                    ticks: { color: 'rgba(255,255,255,0.35)', maxTicksLimit: 8, maxRotation: 0, font: { size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
                    ticks: {
                        color: 'rgba(255,255,255,0.35)',
                        font: { size: 11 },
                        callback: v => sensor.config.format(v) + sensor.config.unit
                    }
                }
            }
        }
    });
}

// ============================================
// NAVIGATION
// ============================================
function showRooms() {
    document.getElementById('roomsPage').classList.remove('hidden');
    document.getElementById('detailPage').classList.add('hidden');
    document.getElementById('particles').classList.remove('visible');
    AppState.currentRoom = null;
    AppState.currentSensor = null;
    AppState.currentPeriod = '24h';
    if (mainChart) { mainChart.destroy(); mainChart = null; }
}

// ============================================
// HELPERS
// ============================================
function formatTime(ts) {
    if (!ts) return '--';
    return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function formatDayTime(ts) {
    if (!ts) return '--';
    const d = new Date(ts);
    return d.toLocaleDateString('fr-FR', { weekday: 'short' }) + ' ' +
        d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function formatDayShort(ts) {
    if (!ts) return '--';
    return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
function formatDateTime(ts) {
    if (!ts) return '--';
    const d = new Date(ts);
    return d.toLocaleDateString('fr-FR') + ' à ' +
        d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function formatDateTimeFull(ts) {
    if (!ts) return '--';
    const d = new Date(ts);
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) +
        ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function createParticles() {
    const c = document.getElementById('particles');
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 20 + 's';
        p.style.animationDuration = (15 + Math.random() * 10) + 's';
        c.appendChild(p);
    }
}