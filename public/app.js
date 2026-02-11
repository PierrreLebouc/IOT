// ============================================
        // SUPABASE
        // ============================================
        const SUPABASE_URL = 'https://wjigmyipcrbdunxgbtut.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_7XCTWEKGWCpyFOOLUF34Kg_ej83d_Fa';
        const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        // ============================================
        // CONFIG CAPTEURS (clés = champ "capteur" en base)
        // ============================================
        const SENSOR_CONFIG = {
            'T': {
                name: 'Température', unit: '°C', color: '#ff6b6b', class: 'temp',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
                getStatus: v => v < 16 ? 'Froid' : v < 18 ? 'Frais' : v <= 24 ? 'Confortable' : v <= 26 ? 'Chaud' : 'Très chaud',
                format: v => Number(v).toFixed(1)
            },
            'H': {
                name: 'Humidité', unit: '%', color: '#4ecdc4', class: 'humidity',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
                getStatus: v => v < 30 ? 'Air sec' : v < 40 ? 'Légèrement sec' : v <= 60 ? 'Confortable' : v <= 70 ? 'Humide' : 'Très humide',
                format: v => Math.round(Number(v)).toString()
            },
            'L': {
                name: 'Luminosité', unit: ' lux', color: '#ffd93d', class: 'lux',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>`,
                getStatus: v => v < 100 ? 'Sombre' : v < 300 ? 'Faible éclairage' : v < 500 ? 'Modéré' : v < 800 ? 'Bonne luminosité' : 'Très lumineux',
                format: v => Math.round(Number(v)).toString()
            },
            'E': {
                name: "Niveau d'eau", unit: '%', color: '#a29bfe', class: 'water',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><line x1="7" y1="13" x2="17" y2="13"/></svg>`,
                getStatus: v => v < 20 ? 'Critique' : v < 40 ? 'Bas' : v <= 70 ? 'Normal' : v <= 90 ? 'Haut' : 'Plein',
                format: v => Math.round(Number(v)).toString()
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
        // ÉTAT
        // ============================================
        const AppState = { currentRoom: null, currentSensor: null };
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
            } catch (err) {
                console.error(err);
                document.querySelector('.loading-text').innerHTML =
                    `<div class="error-message">Erreur de chargement<br><small>${err.message}</small></div>`;
                document.querySelector('.loading-spinner').style.display = 'none';
            }
        });

        // ============================================
        // CHARGEMENT DEPUIS SUPABASE (table mesures)
        // ============================================
        async function loadAllData() {
            data = { rooms: {} };

            // Requête simple : on lit piece, capteur, valeur, timestamp
            const { data: mesures, error } = await sb
                .from('mesures')
                .select('piece, capteur, valeur, timestamp')
                .order('timestamp', { ascending: true });

            if (error) throw new Error('Erreur Supabase: ' + error.message);
            if (!mesures || !mesures.length) return;

            // Regrouper par pièce → capteur
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
                        getStatus: () => '', format: v => String(v)
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
        async function refreshData() {
            const saved = { room: AppState.currentRoom, sensor: AppState.currentSensor };
            document.getElementById('refreshIndicator').classList.add('visible');
            setTimeout(() => document.getElementById('refreshIndicator').classList.remove('visible'), 2000);
            try {
                await loadAllData();
                AppState.currentRoom = saved.room;
                AppState.currentSensor = saved.sensor;
                if (AppState.currentRoom && data.rooms[AppState.currentRoom]) {
                    showDetail(AppState.currentRoom);
                }
            } catch (e) { console.error(e); }
        }

        // ============================================
        // PAGE 1 : LISTE DES PIÈCES
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

                const badges = Object.entries(room.sensors)
                    .filter(([t]) => t !== 'T')
                    .map(([, s]) => `
                        <div class="sensor-badge ${s.config.class}">
                            ${s.config.icon}
                            <span class="value">${s.config.format(s.current)}${s.config.unit}</span>
                        </div>`).join('');

                card.innerHTML = `
                    <div class="card-bg" style="background: ${rc.gradient}"></div>
                    <div class="card-content">
                        <div class="card-header">
                            <div>
                                <div class="room-icon" style="background: ${rc.color}30; border: 1px solid ${rc.color}50;">
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
        // PAGE 2 : DÉTAILS D'UNE PIÈCE
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
            document.getElementById('detailsBg').style.background =
                `linear-gradient(180deg, #0a0a0f 0%, ${rc.color}15 50%, ${rc.color}25 100%)`;
            document.getElementById('roomTitle').textContent = room.piece;

            renderSensorsGrid(room);
            updateSensorDisplay(room);
            window.scrollTo(0, 0);
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
        }

        function updateSensorDisplay(room) {
            const sensor = room.sensors[AppState.currentSensor];
            if (!sensor) return;

            document.getElementById('mainValue').textContent =
                sensor.config.format(sensor.current) + sensor.config.unit;
            document.getElementById('mainStatus').textContent =
                sensor.config.getStatus(sensor.current);
            document.getElementById('mainHigh').textContent =
                'Max: ' + sensor.config.format(sensor.max) + sensor.config.unit;
            document.getElementById('mainLow').textContent =
                'Min: ' + sensor.config.format(sensor.min) + sensor.config.unit;

            document.getElementById('statsGrid').innerHTML = `
                <div class="stat-item">
                    <div class="stat-label">Moyenne</div>
                    <div class="stat-value">${sensor.config.format(sensor.avg)}${sensor.config.unit}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Amplitude</div>
                    <div class="stat-value">${sensor.config.format(sensor.max - sensor.min)}${sensor.config.unit}</div>
                    <div class="stat-detail">écart min-max</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Mesures</div>
                    <div class="stat-value">${sensor.count}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Dernière</div>
                    <div class="stat-value">${formatTime(sensor.lastTimestamp)}</div>
                </div>`;

            updateChart(sensor);
            document.getElementById('lastUpdate').textContent = formatDateTime(room.lastMeasure);
        }

        function updateChart(sensor) {
            const ctx = document.getElementById('mainChart').getContext('2d');
            const labels = sensor.history.map(h => formatTime(h.time));
            const values = sensor.history.map(h => h.value);

            if (mainChart) {
                mainChart.data.labels = labels;
                mainChart.data.datasets[0].data = values;
                mainChart.data.datasets[0].borderColor = sensor.config.color;
                mainChart.data.datasets[0].backgroundColor = sensor.config.color + '20';
                mainChart.data.datasets[0].pointBackgroundColor = sensor.config.color;
                mainChart.data.datasets[0].pointHoverBackgroundColor = sensor.config.color;
                mainChart.options.scales.y.ticks.callback = v => sensor.config.format(v) + sensor.config.unit;
                mainChart.options.plugins.tooltip.callbacks.label = c => `${sensor.config.format(c.raw)}${sensor.config.unit}`;
                mainChart.update('none');
            } else {
                mainChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [{
                            data: values, borderColor: sensor.config.color,
                            backgroundColor: sensor.config.color + '20', borderWidth: 2,
                            fill: true, tension: 0.4, pointRadius: 2, pointHoverRadius: 6,
                            pointBackgroundColor: sensor.config.color,
                            pointHoverBackgroundColor: sensor.config.color
                        }]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        interaction: { intersect: false, mode: 'index' },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.85)', titleColor: '#fff', bodyColor: '#fff',
                                borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, cornerRadius: 12, padding: 12,
                                callbacks: { label: c => `${sensor.config.format(c.raw)}${sensor.config.unit}` }
                            }
                        },
                        scales: {
                            x: { grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false }, ticks: { color: 'rgba(255,255,255,0.4)', maxTicksLimit: 8, maxRotation: 0 } },
                            y: { grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false }, ticks: { color: 'rgba(255,255,255,0.4)', callback: v => sensor.config.format(v) + sensor.config.unit } }
                        }
                    }
                });
            }
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
            if (mainChart) { mainChart.destroy(); mainChart = null; }
        }

        // ============================================
        // HELPERS
        // ============================================
        function formatTime(ts) {
            if (!ts) return '--';
            return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        }
        function formatDateTime(ts) {
            if (!ts) return '--';
            const d = new Date(ts);
            return d.toLocaleDateString('fr-FR') + ' à ' +
                d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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