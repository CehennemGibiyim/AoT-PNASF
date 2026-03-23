// AoT-PNASF — Navigasyon
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// Aktif sayfayı navda işaretle
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href').includes(path) && path !== '') {
      a.classList.add('active');
    }
  });
  // Ana sayfa
  if (path === '' || path === 'index.html') {
    // hiçbir şey aktif değil, logo aktif
  }
});

// Scroll'da navbar'ı güçlendir
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 40) {
    nav.style.background = 'rgba(8,12,16,0.98)';
  } else {
    nav.style.background = 'rgba(8,12,16,0.92)';
  }
});
