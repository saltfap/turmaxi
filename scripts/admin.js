// admin.js
// Controle de Modo Liderança via link mágico (VERSÃO CORRIGIDA)

(function () {
  const ADMIN_TOKEN = 'turmaxi-2026';

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  // Estado global explícito
  window.isAdmin = false;

  if (token && token === ADMIN_TOKEN) {
    window.isAdmin = true;
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (window.isAdmin === true) {
      enableAdminMode();
    }
  });

  function enableAdminMode() {
    const badge = document.getElementById('admin-badge');
    if (badge) {
      badge.classList.remove('hidden');
    }

    document.querySelectorAll('.admin-only').forEach(el => {
      el.classList.remove('hidden');
    });

    document.body.classList.add('admin-mode');

    console.log('[Admin] Modo liderança ATIVADO');
  }
})();