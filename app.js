// GANTI dengan URL web app apps script kanha setelah deploy
const API_URL = 'https://script.google.com/macros/s/AKfycbyscMp4mdFMIK7dt8WpxvcTr0H76u4y9cr0G0c24kv2UU-Ii2pS-x28b0dfqLc9xrOu2g/exec';

// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    const btnLogin = document.getElementById('btnLogin');
    btnLogin.disabled = true; btnLogin.textContent = 'MEMPROSES...';
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // apps script ramah text/plain
        body: JSON.stringify({ action: 'login', username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('wms_token', data.token);
        localStorage.setItem('wms_user', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';
      } else {
        errorMsg.textContent = String(data.message || '').toUpperCase();
        btnLogin.disabled = false; btnLogin.textContent = 'LOGIN';
      }
    } catch (err) {
      errorMsg.textContent = 'SERVER MATI / TIDAK TERHUBUNG';
      btnLogin.disabled = false; btnLogin.textContent = 'LOGIN';
    }
  });
}

// HELPERS
function getToken() { return localStorage.getItem('wms_token'); }
function getUser() { return JSON.parse(localStorage.getItem('wms_user') || '{}'); }

/** GET ke apps script dengan action + token di query. */
async function apiGet(action, params = {}) {
  const qs = new URLSearchParams({ action, token: getToken(), ...params });
  const res = await fetch(`${API_URL}?${qs}`);
  if (res.status === 401) { localStorage.clear(); window.location.href = 'index.html'; return null; }
  return res.json();
}

/** POST ke apps script dengan action + token di body. */
async function apiPost(action, payload = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, token: getToken(), ...payload })
  });
  if (res.status === 401) { localStorage.clear(); window.location.href = 'index.html'; return null; }
  return res.json();
}