// mural-duvidas.js

import {
  listarDuvidasPublicas
} from "../services/firestore.js";

import {
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { db } from "../services/firebase.js";


export async function carregarMuralDuvidas() {

  const box = document.getElementById("mural-duvidas");
  if (!box) return;

  box.innerHTML = "<p>Carregando...</p>";

  const lista = await listarDuvidasPublicas();

  if (!lista.length) {
    box.innerHTML =
      "<p class='empty'>Nenhuma resposta publicada ainda.</p>";
    return;
  }

  box.innerHTML = lista.map(d => `

    <div class="duvida-card">

      <div class="duvida-pergunta">
        ❓ ${d.pergunta}
      </div>

      <div class="duvida-resposta">
        ✅ ${d.resposta}
      </div>

      ${
        d.disciplina
          ? `<div class="duvida-disciplina">${d.disciplina}</div>`
          : ""
      }

      ${
        window.isAdmin
          ? `<button class="btn btn-small"
              data-ocultar="${d.id}">
              Ocultar
            </button>`
          : ""
      }

    </div>

  `).join("");

  ligarAcoesOcultar();
}

function ligarAcoesOcultar() {

  document.querySelectorAll("[data-ocultar]").forEach(btn => {

    btn.onclick = async () => {

      const id = btn.dataset.ocultar;

      if (!confirm("Ocultar esta resposta do mural?"))
        return;

      btn.textContent = "Ocultando...";
      btn.disabled = true;

      await ocultarDuvida(id);

      carregarMuralDuvidas();
    };

  });
}

export async function ocultarDuvida(id) {

  const ref = doc(db, "duvidas", id);

  return deleteDoc(ref);

}


