// main.js
// Inicialização geral do app

import { db, storage } from "./services/firebase.js";
import { carregarAnuncios, initCriarAnuncio } from "./modules/anuncios.js";
import { carregarAvaliacoes } from "./modules/avaliacoes.js";
import { initCriarDisciplina } from "./modules/disciplinas.js";
import { initCriarAvaliacao } from "./modules/avaliacoes-admin.js";
import { carregarAvaliacoesHome } from "./modules/home-avaliacoes.js";



document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] Turma XI | Teologia SALT-FAP iniciado');

  initApp();
  initTabs();

});

function initTabs() {
  const buttons = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".section");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.section;

      // Ativa botão
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      // Ativa section
      sections.forEach(section => {
        section.classList.toggle("active", section.id === target);
      });
    });
  });
}


function initApp() {
  initState();
  initUI();
  carregarAnuncios();
  initCriarAnuncio();
  carregarAvaliacoes();
  initCriarDisciplina();
  initCriarAvaliacao();
  carregarAvaliacoesHome();
}


/**
 * Estado inicial do app
 */
function initState() {
  window.appState = {
  isAdmin: window.isAdmin === true
};

  if (window.appState.isAdmin) {
    console.log('[App] Modo liderança ativo');
  } else {
    console.log('[App] Modo público');
  }
}

/**
 * Inicialização da interface
 */
function initUI() {
  bindButtons();
}

/**
 * Liga eventos básicos dos botões
 * (por enquanto sem lógica real)
 */
function bindButtons() {
  // Botões de criação (liderança)
//  document.querySelectorAll('.admin-only').forEach(button => {
//    button.addEventListener('click', () => {
//      alert('Ação disponível apenas no modo liderança.\n(Funcionalidade será implementada em breve)');
//    });
//  });

  // Botão de enviar dúvida
  const duvidaBtn = document.getElementById("btn-enviar-duvida");

if (duvidaBtn) {
  duvidaBtn.addEventListener("click", () => {
    alert("Envio de dúvidas será implementado em breve.");
  });
}

}

