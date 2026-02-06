import { listarDuvidasPublicas } from "../services/firestore.js";

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
          ? `<div class="duvida-disciplina">
              ${d.disciplina}
            </div>`
          : ""
      }

    </div>

  `).join("");
}
