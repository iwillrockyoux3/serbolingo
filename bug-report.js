// [SHIELD_DAEMON: VALIDATED]
// bug-report.js — Priority 46: In-App Bug, Error & Feedback Reporting System ("Prijavi Problem")
// Pure vanilla JS, zero dependencies, offline-safe, UTF-8 armored
// SerboLingo Technical Constitution v3.0 compliant

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // §1  GLOBAL ERROR BUFFER — Captures last 10 JS errors
    // ═══════════════════════════════════════════════════════════
    const ERROR_BUFFER_MAX = 10;
    const errorBuffer = [];

    const originalOnError = window.onerror;
    window.onerror = function(msg, source, line, col, error) {
        errorBuffer.push({
            type: 'error',
            message: String(msg).substring(0, 200),
            source: source ? source.split('/').pop().split('?')[0] : 'unknown',
            line: line || 0,
            col: col || 0,
            ts: new Date().toISOString()
        });
        if (errorBuffer.length > ERROR_BUFFER_MAX) errorBuffer.shift();
        if (originalOnError) return originalOnError.apply(this, arguments);
        return false;
    };

    window.addEventListener('unhandledrejection', function(e) {
        errorBuffer.push({
            type: 'promise',
            message: e.reason ? String(e.reason.message || e.reason).substring(0, 200) : 'Unknown rejection',
            ts: new Date().toISOString()
        });
        if (errorBuffer.length > ERROR_BUFFER_MAX) errorBuffer.shift();
    });

    // ═══════════════════════════════════════════════════════════
    // §2  CONSTANTS
    // ═══════════════════════════════════════════════════════════
    const STORAGE_REPORTS  = 'serbolingo_bug_reports';
    const STORAGE_WEBHOOK  = 'serbolingo_bug_webhook';
    const STORAGE_COUNT    = 'serbolingo_bug_report_count';
    const MAX_REPORTS      = 50;
    const BUG_HUNTER_LIMIT = 3;
    const BUG_HUNTER_XP    = 25;

    const CATEGORIES = [
        { id: 'bug',         icon: '\uD83D\uDC1B', label: 'Bug / Gre\u0161ka' },
        { id: 'ui',          icon: '\uD83D\uDDA5\uFE0F', label: 'UI Problem' },
        { id: 'translation', icon: '\uD83D\uDD24', label: 'Pogre\u0161an Prevod' },
        { id: 'feature',     icon: '\uD83D\uDCA1', label: 'Predlog / Ideja' },
        { id: 'other',       icon: '\uD83D\uDCDD', label: 'Ostalo' }
    ];

    // ═══════════════════════════════════════════════════════════
    // §3  HELPER — HTML escape
    // ═══════════════════════════════════════════════════════════
    function esc(text) {
        var d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    function fmtDate(iso) {
        try {
            var d = new Date(iso);
            var day = String(d.getDate()).padStart(2, '0');
            var months = ['jan','feb','mar','apr','maj','jun','jul','avg','sep','okt','nov','dec'];
            var mon = months[d.getMonth()];
            var yr = d.getFullYear();
            var hh = String(d.getHours()).padStart(2, '0');
            var mm = String(d.getMinutes()).padStart(2, '0');
            return day + '. ' + mon + ' ' + yr + ' ' + hh + ':' + mm;
        } catch(e) { return iso; }
    }

    // ═══════════════════════════════════════════════════════════
    // §4  BUGREPORTENGINE
    // ═══════════════════════════════════════════════════════════
    window.BugReportEngine = {
        _cat: null,
        _tab: 'form',

        // ── Modal open / close ──────────────────────────────
        openModal: function() {
            var modal = document.getElementById('bug-report-modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            this._cat = null;
            this._tab = 'form';
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        closeModal: function() {
            var modal = document.getElementById('bug-report-modal');
            if (!modal) return;
            modal.classList.add('hidden');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ── Tab switching ───────────────────────────────────
        switchTab: function(tab) {
            this._tab = tab;
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ── Category selection ──────────────────────────────
        selectCategory: function(catId) {
            this._cat = catId;
            var pills = document.querySelectorAll('.bug-cat-pill');
            for (var i = 0; i < pills.length; i++) {
                var p = pills[i];
                if (p.getAttribute('data-cat-id') === catId) {
                    p.className = 'bug-cat-pill px-3 py-2 rounded-xl font-bold text-xs border border-blue-500 ring-2 ring-blue-500 bg-blue-500/20 text-blue-300 active:scale-95 transition-all flex items-center gap-1.5';
                } else {
                    p.className = 'bug-cat-pill px-3 py-2 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 active:scale-95 transition-all flex items-center gap-1.5';
                }
            }
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ═════════════════════════════════════════════════════
        // §5  DIAGNOSTICS AUTO-CAPTURE
        // ═════════════════════════════════════════════════════
        captureDiagnostics: function() {
            var diag = {};
            try {
                var mem = navigator.deviceMemory || 'unknown';
                var cores = navigator.hardwareConcurrency || 'unknown';
                diag.deviceTier = (mem >= 6 && cores >= 6) ? 'FLAGSHIP' :
                                  (mem <= 3 || cores <= 4) ? 'BUDGET' : 'MID';
                diag.ram = mem !== 'unknown' ? mem + ' GB' : 'unknown';
                diag.cores = cores;

                diag.userAgent = navigator.userAgent;
                diag.platform = navigator.platform || 'unknown';
                diag.language = navigator.language || 'unknown';

                diag.screenW = screen.width;
                diag.screenH = screen.height;
                diag.vpW = window.innerWidth;
                diag.vpH = window.innerHeight;
                diag.dpr = window.devicePixelRatio || 1;
                diag.orientation = screen.orientation ? screen.orientation.type : 'unknown';

                diag.currentView = this._getView();
                diag.darkMode = document.documentElement.classList.contains('dark');
                diag.appVersion = 'v13';
                diag.isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                             window.navigator.standalone === true;
                diag.online = navigator.onLine;

                var lsBytes = 0;
                try {
                    for (var k in localStorage) {
                        if (localStorage.hasOwnProperty(k)) {
                            lsBytes += (localStorage.getItem(k) || '').length * 2;
                        }
                    }
                } catch(e) { /* quota or security */ }
                diag.lsUsed = (lsBytes / 1024).toFixed(1) + ' KB';

                diag.ts = new Date().toISOString();
                diag.errors = errorBuffer.slice(-10);
            } catch(e) {
                diag.captureErr = String(e.message);
            }
            return diag;
        },

        _getView: function() {
            var ids = ['home','arcade','explore','mistakes','stats','profile','lesson','skill-tree'];
            for (var i = 0; i < ids.length; i++) {
                var el = document.getElementById('view-' + ids[i]);
                if (el && !el.classList.contains('hidden')) return ids[i];
            }
            return 'unknown';
        },

        // ═════════════════════════════════════════════════════
        // §6  SUBMIT REPORT
        // ═════════════════════════════════════════════════════
        submit: async function() {
            var descEl = document.getElementById('bug-report-desc');
            var desc = descEl ? descEl.value.trim() : '';

            if (!this._cat) {
                if (window.app) app.showToast('Izaberi kategoriju!', 'error');
                return;
            }
            if (desc.length < 10) {
                if (window.app) app.showToast('Opis mora imati bar 10 karaktera.', 'error');
                return;
            }

            var submitBtn = document.getElementById('bug-submit-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '\u23F3 \u0160aljem...';
            }

            var diagnostics = this.captureDiagnostics();
            var cat = null;
            for (var i = 0; i < CATEGORIES.length; i++) {
                if (CATEGORIES[i].id === this._cat) { cat = CATEGORIES[i]; break; }
            }

            var report = {
                id: 'RPT-' + Date.now().toString(36).toUpperCase(),
                category: this._cat,
                categoryLabel: cat ? cat.label : this._cat,
                categoryIcon: cat ? cat.icon : '',
                description: desc,
                diagnostics: diagnostics,
                status: 'sent',
                createdAt: new Date().toISOString(),
                user: (window.state && state.user) ? state.user.name : 'guest'
            };

            // Always save locally first
            this._saveReport(report);

            // Try webhook
            var webhookUrl = localStorage.getItem(STORAGE_WEBHOOK);
            if (webhookUrl) {
                try {
                    await this._sendWebhook(webhookUrl, report);
                    report.status = 'received';
                    this._updateStatus(report.id, 'received');
                } catch(e) {
                    console.warn('[BugReport] Webhook failed:', e.message);
                }
            }

            // Bug Hunter XP
            this._awardBugHunterXP();

            // Reset
            if (descEl) descEl.value = '';
            this._cat = null;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '\uD83D\uDE80 Po\u0161alji Izve\u0161taj';
            }

            if (window.app) app.showToast('Izve\u0161taj poslat! Hvala! \uD83D\uDC1B', 'success');
            if (window.TouchHaptics && TouchHaptics.correctAnswer) TouchHaptics.correctAnswer();

            this.switchTab('history');
        },

        // ═════════════════════════════════════════════════════
        // §7  DISCORD WEBHOOK DELIVERY
        // ═════════════════════════════════════════════════════
        _sendWebhook: async function(url, report) {
            var d = report.diagnostics;
            var errText = '';
            if (d.errors && d.errors.length > 0) {
                errText = d.errors.map(function(e) {
                    return '`' + e.type + '` ' + (e.message || '').substring(0, 80) +
                           (e.source ? ' @ ' + e.source + ':' + e.line : '');
                }).join('\n');
            }

            var fields = [
                { name: 'Report ID',  value: '`' + report.id + '`', inline: true },
                { name: 'User',       value: report.user,           inline: true },
                { name: 'Device',     value: d.deviceTier + ' (' + d.cores + ' cores, ' + d.ram + ')', inline: true },
                { name: 'Screen',     value: d.vpW + 'x' + d.vpH + ' @' + d.dpr + 'x', inline: true },
                { name: 'View',       value: d.currentView,         inline: true },
                { name: 'Online',     value: d.online ? 'Yes' : 'No', inline: true },
                { name: 'Version',    value: d.appVersion,          inline: true },
                { name: 'Storage',    value: d.lsUsed,              inline: true },
                { name: 'PWA',        value: d.isPWA ? 'Yes' : 'No', inline: true }
            ];
            if (errText) {
                fields.push({ name: 'Recent Errors (' + d.errors.length + ')', value: errText.substring(0, 1024) });
            }

            var colorMap = { bug: 0xFF4444, ui: 0xFFAA00, translation: 0x4488FF, feature: 0x44FF44 };
            var embed = {
                title: (report.categoryIcon ? report.categoryIcon + ' ' : '') + report.categoryLabel,
                description: report.description.substring(0, 2000),
                color: colorMap[report.category] || 0xAAAAAA,
                fields: fields,
                footer: { text: 'SerboLingo Bug Report System' },
                timestamp: report.createdAt
            };

            var response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: null, embeds: [embed] })
            });

            if (!response.ok && response.status !== 204) {
                throw new Error('Webhook HTTP ' + response.status);
            }
        },

        // ═════════════════════════════════════════════════════
        // §8  LOCAL STORAGE — Reports CRUD
        // ═════════════════════════════════════════════════════
        _saveReport: function(report) {
            try {
                var reports = this._getReports();
                reports.unshift(report);
                if (reports.length > MAX_REPORTS) reports.length = MAX_REPORTS;
                localStorage.setItem(STORAGE_REPORTS, JSON.stringify(reports));
            } catch(e) { console.error('[BugReport] Save failed:', e); }
        },

        _getReports: function() {
            try { return JSON.parse(localStorage.getItem(STORAGE_REPORTS)) || []; }
            catch(e) { return []; }
        },

        _updateStatus: function(id, status) {
            var reports = this._getReports();
            for (var i = 0; i < reports.length; i++) {
                if (reports[i].id === id) {
                    reports[i].status = status;
                    localStorage.setItem(STORAGE_REPORTS, JSON.stringify(reports));
                    return;
                }
            }
        },

        // ═════════════════════════════════════════════════════
        // §9  BUG HUNTER XP REWARD
        // ═════════════════════════════════════════════════════
        _getCount: function() {
            try { return parseInt(localStorage.getItem(STORAGE_COUNT)) || 0; }
            catch(e) { return 0; }
        },

        _awardBugHunterXP: function() {
            var count = this._getCount() + 1;
            localStorage.setItem(STORAGE_COUNT, String(count));

            if (count <= BUG_HUNTER_LIMIT && window.state) {
                state.xp = (state.xp || 0) + BUG_HUNTER_XP;
                state.dailyXP = (state.dailyXP || 0) + BUG_HUNTER_XP;
                if (window.app) {
                    app.saveState();
                    if (app.updateProfileUI) app.updateProfileUI();
                    var msg = count === 1 ? '\uD83D\uDC1B Bug Hunter! +25 XP za prvi izve\u0161taj!' :
                              count === 3 ? '\uD83C\uDFC6 Bug Hunter Veteran! Svi bonusi sakupljeni!' :
                                            '+25 XP za izve\u0161taj!';
                    setTimeout(function() { app.showToast(msg, 'success'); }, 900);
                }
            }
        },

        // ═════════════════════════════════════════════════════
        // §10  WEBHOOK CONFIG
        // ═════════════════════════════════════════════════════
        saveWebhook: function() {
            var input = document.getElementById('bug-webhook-url');
            if (!input) return;
            var url = input.value.trim();
            if (url) {
                localStorage.setItem(STORAGE_WEBHOOK, url);
                if (window.app) app.showToast('Webhook URL sa\u010Duvan!', 'success');
            } else {
                localStorage.removeItem(STORAGE_WEBHOOK);
                if (window.app) app.showToast('Webhook URL uklonjen.', 'info');
            }
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ═════════════════════════════════════════════════════
        // §11  RENDER ENGINE
        // ═════════════════════════════════════════════════════
        render: function() {
            var formC = document.getElementById('bug-report-form');
            var histC = document.getElementById('bug-report-history');
            var tabF  = document.getElementById('bug-tab-form');
            var tabH  = document.getElementById('bug-tab-history');
            if (!formC || !histC) return;

            var activeClass   = 'flex-1 py-2 rounded-lg font-bold text-xs bg-blue-500 text-white shadow-sm transition-all';
            var inactiveClass = 'flex-1 py-2 rounded-lg font-bold text-xs text-slate-400 hover:text-white transition-all';

            if (this._tab === 'form') {
                formC.classList.remove('hidden');
                histC.classList.add('hidden');
                if (tabF) tabF.className = activeClass;
                if (tabH) tabH.className = inactiveClass;
                this._renderForm();
            } else {
                formC.classList.add('hidden');
                histC.classList.remove('hidden');
                if (tabH) tabH.className = activeClass;
                if (tabF) tabF.className = inactiveClass;
                this._renderHistory();
            }
        },

        _renderForm: function() {
            var container = document.getElementById('bug-report-form');
            if (!container) return;

            var count = this._getCount();
            var remaining = Math.max(0, BUG_HUNTER_LIMIT - count);

            var pills = '';
            for (var i = 0; i < CATEGORIES.length; i++) {
                var c = CATEGORIES[i];
                pills += '<button onclick="BugReportEngine.selectCategory(\'' + c.id + '\')" ' +
                    'data-cat-id="' + c.id + '" ' +
                    'class="bug-cat-pill px-3 py-2 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 active:scale-95 transition-all flex items-center gap-1.5">' +
                    '<span>' + c.icon + '</span> <span>' + c.label + '</span></button>';
            }

            var xpBanner = '';
            if (remaining > 0) {
                xpBanner = '<div class="bg-gradient-to-r from-amber-500/15 to-yellow-500/15 border border-amber-500/30 rounded-xl p-2.5 flex items-center gap-2">' +
                    '<span class="text-lg">\uD83D\uDC1B</span>' +
                    '<div class="flex-1">' +
                    '<p class="text-[10px] font-black text-amber-400 uppercase tracking-wider">Bug Hunter Nagrada</p>' +
                    '<p class="text-[9px] text-slate-400">+25 XP za svaki izve\u0161taj (jo\u0161 ' + remaining + ' preostalo)</p>' +
                    '</div>' +
                    '<span class="text-xs font-black text-amber-400">\u26A1+25</span></div>';
            } else {
                xpBanner = '<div class="bg-gradient-to-r from-emerald-500/15 to-green-500/15 border border-emerald-500/30 rounded-xl p-2.5 flex items-center gap-2">' +
                    '<span class="text-lg">\uD83C\uDFC6</span>' +
                    '<p class="text-[10px] font-black text-emerald-400">Bug Hunter Veteran \u2014 Svi bonusi sakupljeni!</p></div>';
            }

            var webhookVal = localStorage.getItem(STORAGE_WEBHOOK) || '';

            container.innerHTML =
                '<div class="space-y-4">' +
                    xpBanner +

                    // Category
                    '<div>' +
                    '<p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Kategorija</p>' +
                    '<div class="flex flex-wrap gap-2">' + pills + '</div>' +
                    '</div>' +

                    // Description
                    '<div>' +
                    '<p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Opi\u0161i problem</p>' +
                    '<textarea id="bug-report-desc" ' +
                        'placeholder="Objasni \u0161ta se desilo, \u0161ta si o\u010Dekivao, i kako da ponovimo problem..." ' +
                        'class="w-full h-28 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white text-xs font-medium resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500" ' +
                        'maxlength="1000"></textarea>' +
                    '<p class="text-[9px] text-slate-400 text-right mt-0.5">Minimum 10 karaktera</p>' +
                    '</div>' +

                    // Webhook config (collapsible)
                    '<details class="group">' +
                    '<summary class="text-[10px] font-bold text-slate-400 dark:text-slate-500 cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-1">' +
                    '<span class="group-open:rotate-90 transition-transform inline-block">\u25B6</span> Webhook pode\u0161avanje (napredno)</summary>' +
                    '<div class="mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">' +
                    '<p class="text-[9px] text-slate-400">Unesi Discord webhook URL da prima\u0161 izve\u0161taje direktno na svoj server.</p>' +
                    '<div class="flex gap-2">' +
                    '<input type="url" id="bug-webhook-url" value="' + esc(webhookVal) + '" ' +
                        'placeholder="https://discord.com/api/webhooks/..." ' +
                        'class="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-white text-[10px] font-mono focus:border-blue-500 outline-none">' +
                    '<button onclick="BugReportEngine.saveWebhook()" ' +
                        'class="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[10px] active:scale-95 transition-all">' +
                        'Sa\u010Duvaj</button>' +
                    '</div></div></details>' +

                    // Submit
                    '<button id="bug-submit-btn" onclick="BugReportEngine.submit()" ' +
                        'class="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-black text-sm rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">' +
                        '\uD83D\uDE80 Po\u0161alji Izve\u0161taj</button>' +
                '</div>';
        },

        _renderHistory: function() {
            var container = document.getElementById('bug-report-history');
            if (!container) return;

            var reports = this._getReports();

            if (reports.length === 0) {
                container.innerHTML =
                    '<div class="flex flex-col items-center justify-center py-10 text-center">' +
                    '<span class="text-4xl mb-3">\uD83D\uDCED</span>' +
                    '<p class="text-sm font-bold text-slate-400 dark:text-slate-500">Nema poslatih izve\u0161taja</p>' +
                    '<p class="text-[10px] text-slate-400 mt-1">Tvoji izve\u0161taji o gre\u0161kama i predlozi \u0107e se pojaviti ovde.</p></div>';
                return;
            }

            var statusMap = {
                sent:        { cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30',       txt: 'Poslato' },
                received:    { cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30',    txt: 'Primljeno' },
                in_progress: { cls: 'bg-purple-500/20 text-purple-400 border-purple-500/30', txt: 'U obradi' },
                resolved:    { cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', txt: 'Re\u0161eno' }
            };

            var html = '<div class="space-y-2.5">';
            for (var i = 0; i < reports.length; i++) {
                var r = reports[i];
                var s = statusMap[r.status] || statusMap.sent;
                var icon = r.categoryIcon || '\uD83D\uDCDD';
                var descShort = esc(r.description).substring(0, 200) + (r.description.length > 200 ? '...' : '');

                html += '<div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-1.5">' +
                    '<div class="flex items-center justify-between">' +
                    '<div class="flex items-center gap-2"><span class="text-base">' + icon + '</span>' +
                    '<span class="font-bold text-xs text-slate-700 dark:text-white">' + esc(r.categoryLabel) + '</span></div>' +
                    '<span class="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ' + s.cls + '">' + s.txt + '</span>' +
                    '</div>' +
                    '<p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">' + descShort + '</p>' +
                    '<div class="flex items-center justify-between">' +
                    '<span class="text-[9px] text-slate-400 font-mono">' + r.id + '</span>' +
                    '<span class="text-[9px] text-slate-400">' + fmtDate(r.createdAt) + '</span>' +
                    '</div></div>';
            }

            html += '</div>';

            // Clear history button
            if (reports.length > 0) {
                html += '<button onclick="BugReportEngine.clearHistory()" ' +
                    'class="w-full mt-3 py-2 text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase tracking-wider">' +
                    '\uD83D\uDDD1\uFE0F Obri\u0161i istoriju</button>';
            }

            container.innerHTML = html;
        },

        clearHistory: function() {
            if (confirm('Da li si siguran/na da \u017Eeli\u0161 da obri\u0161e\u0161 sve izve\u0161taje?')) {
                localStorage.removeItem(STORAGE_REPORTS);
                this._renderHistory();
                if (window.app) app.showToast('Istorija obrisana.', 'info');
            }
        }
    };

    console.log('[BugReport] \uD83D\uDC1B Engine loaded. Error buffer active.');
})();
