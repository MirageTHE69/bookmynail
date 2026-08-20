// <video-slot> — user-fillable background-video placeholder.
// Drag-drop (or click) a video file onto it; it persists across reloads via
// a sidecar JSON file next to the page, using the same window.omelette
// bridge pattern as <image-slot>. Outside that runtime it's read-only.
//
// Attributes:
//   id         Persistence key. REQUIRED to survive reload.
//   placeholder  Empty-state caption.
//   muted, loop, autoplay, playsinline — booleans, default true (background-video defaults).
//   poster     Optional fallback image shown before a video is dropped.
//
// Usage:
//   <div style="position:relative;width:100%;height:100%">
//     <video-slot id="hero-video" placeholder="Drop the hero background video"></video-slot>
//   </div>
(() => {
  const STATE_FILE = '.video-slots.state.json';
  const ACCEPT = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

  const subs = new Set();
  let slots = {};
  let loaded = false;
  let loadP = null;

  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (j && typeof j === 'object') slots = Object.assign({}, j, slots); })
      .catch(() => {})
      .then(() => { loaded = true; subs.forEach((fn) => fn()); });
    return loadP;
  }

  let saving = false, saveDirty = false;
  function save() {
    if (saving) { saveDirty = true; return; }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots)))
      .catch(() => {})
      .then(() => { saving = false; if (saveDirty) { saveDirty = false; save(); } });
  }

  function setSlot(id, url) {
    if (!id) return;
    if (url) slots[id] = url; else delete slots[id];
    subs.forEach((fn) => fn());
    if (loaded) save(); else load().then(save);
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
  }

  const stylesheet =
    ':host{display:block;position:relative;width:100%;height:100%;' +
    '  font:13px/1.3 system-ui,-apple-system,sans-serif;overflow:hidden;background:rgba(127,127,127,.08)}' +
    'video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none}' +
    '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' +
    '  justify-content:center;gap:8px;text-align:center;padding:16px;box-sizing:border-box;' +
    '  cursor:pointer;user-select:none;color:inherit}' +
    '.empty svg{opacity:.5}' +
    '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em;opacity:.85}' +
    '.empty .sub{font-size:11px;opacity:.7}' +
    '.empty .sub u{text-underline-offset:2px}' +
    ':host([data-over]) .empty{outline:2px solid #c96442;outline-offset:-2px;background:rgba(201,100,66,.10)}' +
    ':host([data-filled]) .empty{display:none}' +
    '.ctl{position:absolute;top:8px;right:8px;display:flex;gap:6px;opacity:0;pointer-events:none;' +
    '  transition:opacity .12s;z-index:2}' +
    ':host([data-filled][data-editable]:hover) .ctl{opacity:1;pointer-events:auto}' +
    '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' +
    '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;backdrop-filter:blur(6px)}' +
    '.ctl button:hover{background:rgba(0,0,0,.8)}' +
    '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' +
    '  background:rgba(255,255,255,.9);padding:4px 6px;border-radius:5px;pointer-events:none}' +
    ':host-context([data-om-exporting]) .ctl{display:none !important}' +
    '@media print{.ctl{display:none !important}}';

  const icon =
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="2" y="4" width="15" height="16" rx="2"/><path d="m22 8-5 4 5 4V8Z"/></svg>';

  class VideoSlot extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML =
        '<style>' + stylesheet + '</style>' +
        '<video part="video" muted playsinline></video>' +
        '<div class="empty" part="empty">' + icon +
        '  <div class="cap"></div><div class="sub">or <u>browse files</u></div></div>' +
        '<div class="ctl"><button data-act="replace">Replace</button></div>' +
        '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._video = root.querySelector('video');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._input = root.querySelector('input');
      this._depth = 0;
      this._subFn = () => this._render();
      this._empty.addEventListener('click', () => this._input.click());
      root.querySelector('[data-act="replace"]').addEventListener('click', () => this._input.click());
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
    }

    connectedCallback() {
      if (!this.id && !VideoSlot._warned) {
        VideoSlot._warned = true;
        console.warn('<video-slot> without an id will not persist its dropped video.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      this.addEventListener('pointerenter', this._subFn);
      load();
      this._render();
    }

    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
    }

    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        e.preventDefault(); e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        if (--this._depth <= 0) { this._depth = 0; this.removeAttribute('data-over'); }
      } else if (e.type === 'drop') {
        e.preventDefault(); e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }

    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop an MP4, WebM, or MOV video.');
        return;
      }
      try {
        const url = await fileToDataUrl(file);
        setSlot(this.id || '', url);
        if (!this.id) { this._local = url; this._render(); }
      } catch (err) {
        this._setError('Could not read that video.');
        console.warn('<video-slot> ingest failed:', err);
      }
    }

    _setError(msg) {
      if (this._err) { this._err.remove(); this._err = null; }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err'; d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => { if (this._err === d) { d.remove(); this._err = null; } }, 3000);
    }

    _render() {
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      const stored = this.id ? slots[this.id] : this._local;
      const url = stored || this.getAttribute('src') || '';
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop a background video';
      if (url) {
        if (this._video.getAttribute('src') !== url) this._video.src = url;
        this._video.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._video.muted = this.hasAttribute('muted') ? this.getAttribute('muted') !== 'false' : true;
        this._video.loop = this.hasAttribute('loop') ? this.getAttribute('loop') !== 'false' : true;
        this._video.playsInline = true;
        if (!this.hasAttribute('autoplay') || this.getAttribute('autoplay') !== 'false') {
          this._video.autoplay = true;
          this._video.play().catch(() => {});
        }
      } else {
        this._video.style.display = 'none';
        this._video.removeAttribute('src');
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }

  if (!customElements.get('video-slot')) {
    customElements.define('video-slot', VideoSlot);
  }
})();
