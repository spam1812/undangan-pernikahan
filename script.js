// Ubah tanggal ini bersama informasi tanggal di index.html. Zona waktu WIB.
const weddingDate = new Date('2026-12-20T08:00:00+07:00');
const cover = document.querySelector('#cover');
const main = document.querySelector('main');
const musicButton = document.querySelector('#music-toggle');
const guest = new URLSearchParams(location.search).get('to');
if (guest) document.querySelector('#guest-name').textContent = guest.slice(0, 100);
document.querySelector('#open-invitation').addEventListener('click', () => {
  cover.classList.add('opened');
  document.body.classList.remove('is-covered');
  main.inert = false;
  document.querySelector('.bottom-nav').hidden = false;
  musicButton.hidden = false;
  document.querySelector('.monogram').focus();
  setTimeout(() => { cover.hidden = true; }, 1100);
});
function updateCountdown() {
  const remaining = Math.max(0, weddingDate.getTime() - Date.now());
  const seconds = Math.floor(remaining / 1000);
  const values = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  ['days', 'hours', 'minutes', 'seconds'].forEach((id, i) => { document.getElementById(id).textContent = String(values[i]).padStart(2, '0'); });
  if (!remaining) document.querySelector('#countdown-note').textContent = 'Hari bahagia telah tiba. Terima kasih atas doa Anda!';
}
updateCountdown();
setInterval(updateCountdown, 1000);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.reveal, .gallery-item, .event-card').forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
} else document.querySelectorAll('.reveal').forEach(section => section.classList.add('visible'));
const lightbox = document.querySelector('#lightbox');
// Keep floating controls clear of the RSVP panel, including mobile keyboards.
const rsvpSection = document.querySelector('#rsvp');
if ('IntersectionObserver' in window) {
  const rsvpObserver = new IntersectionObserver(entries => {
    document.body.classList.toggle('rsvp-in-view', entries[0].isIntersecting);
  }, { threshold: 0 });
  rsvpObserver.observe(rsvpSection);
}
rsvpSection.addEventListener('focusin', event => {
  if (event.target.matches('input, select, textarea')) document.body.classList.add('form-editing');
});
rsvpSection.addEventListener('focusout', () => {
  requestAnimationFrame(() => {
    document.body.classList.toggle('form-editing', !!document.activeElement?.matches('#rsvp input, #rsvp select, #rsvp textarea'));
  });
});
document.querySelectorAll('.gallery-item').forEach(button => button.addEventListener('click', () => {
  const source = button.querySelector('img');
  const image = document.querySelector('#lightbox-image');
  image.src = source.src; image.alt = source.alt;
  lightbox.querySelector('p').textContent = source.alt;
  lightbox.showModal(); document.body.classList.add('photo-open');
}));
document.querySelector('#close-lightbox').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('close', () => document.body.classList.remove('photo-open'));
const storageKey = 'alya-raka-rsvp-demo-v1';
let wishes = [];
try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(saved)) wishes = saved.filter(w => w && typeof w.name === 'string' && typeof w.message === 'string' && typeof w.attendance === 'string').slice(0, 100); } catch { /* Tetap berjalan jika penyimpanan tidak tersedia. */ }
function renderWishes() {
  const list = document.querySelector('#wishes');
  list.replaceChildren();
  document.querySelector('#wish-count').textContent = `${wishes.length} ucapan`;
  if (!wishes.length) { const empty = document.createElement('p'); empty.className = 'empty-wishes'; empty.textContent = 'Jadilah yang pertama meninggalkan doa baik.'; list.append(empty); }
  wishes.forEach(wish => {
    const article = document.createElement('article'); article.className = 'wish';
    const name = document.createElement('strong'); name.textContent = wish.name;
    const attendance = document.createElement('small'); attendance.textContent = `${wish.attendance} · ${wish.guests || 1} orang`;
    const message = document.createElement('p'); message.textContent = wish.message;
    article.append(name, attendance, message); list.append(article);
  });
}
renderWishes();
document.querySelector('#rsvp-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = String(data.get('name')).trim(); const message = String(data.get('message')).trim();
  if (!name || !message) { document.querySelector('#form-status').textContent = 'Mohon isi nama dan ucapan Anda.'; return; }
  wishes.unshift({name, message, attendance: String(data.get('attendance')), guests: String(data.get('guests'))});
  wishes = wishes.slice(0, 100);
  let persisted = true;
  try { localStorage.setItem(storageKey, JSON.stringify(wishes)); } catch { persisted = false; }
  renderWishes(); form.reset();
  document.querySelector('#form-status').textContent = persisted ? 'Terima kasih! Konfirmasi demo tersimpan di browser Anda.' : 'Terima kasih! Ucapan tampil untuk sesi ini; penyimpanan browser tidak tersedia.';
});
// Musik instrumental demo dibuat lokal dengan Web Audio, tanpa file audio eksternal.
let audioContext, musicTimer, playing = false;
const melody = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66, 246.94, 293.66, 392, 493.88, 440, 392, 293.66, 329.63];
function playPhrase() {
  melody.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
    const start = audioContext.currentTime + index * .6;
    oscillator.type = 'sine'; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(.065, start + .05); gain.gain.exponentialRampToValueAtTime(.001, start + 1.6);
    oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(start); oscillator.stop(start + 1.7);
  });
}
musicButton.addEventListener('click', async () => {
  musicButton.disabled = true;
  try {
    if (playing) { clearInterval(musicTimer); await audioContext.suspend(); playing = false; }
    else {
      if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await audioContext.resume(); playPhrase(); musicTimer = setInterval(playPhrase, 9600); playing = true;
    }
    musicButton.setAttribute('aria-pressed', String(playing)); musicButton.setAttribute('aria-label', playing ? 'Matikan musik latar' : 'Nyalakan musik latar'); musicButton.textContent = playing ? '♫' : '♪';
  } catch { musicButton.setAttribute('aria-label', 'Musik tidak didukung browser ini'); musicButton.title = 'Musik tidak didukung browser ini'; }
  finally { musicButton.disabled = false; }
});
