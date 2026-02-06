import {
  listarDuvidasPendentes,
  responderDuvida
} from "../services/firestore.js";

export async function carregarPainelDuvidas() {

  if (!window.isAdmin) return;

  const box = document.getElementById("duvidas-pendentes");
  if (!box) return;

  box.innerHTML = "<p>Carregando...</p>";

  const lista = await listarDuvidasPendentes();

  if (!lista.length) {
    box.innerHTML =
      "<p class='empty'>Nenhuma dúvida pendente.</p>";
    return;
  }

  box.innerHTML = lista.map(d => `

    <div class="duvida-admin-card">

      <div class="duvida-admin-pergunta">
        ❓ ${d.pergunta}
      </div>

      <textarea
        placeholder="Digite a resposta..."
        data-resposta="${d.id}"
      ></textarea>

      <button
        class="btn"
        data-publicar="${d.id}"
      >
        Publicar resposta
      </button>

    </div>

  `).join("");

  ligarAcoesPainel();
}

function ligarAcoesPainel() {

  document.querySelectorAll("[data-publicar]").forEach(btn => {

    btn.onclick = async () => {

      const id = btn.dataset.publicar;

      const textarea =
        document.querySelector(
          `[data-resposta="${id}"]`
        );

      const resposta = textarea.value.trim();

      if (!resposta) {
        alert("Digite uma resposta.");
        return;
      }

      btn.textContent = "Publicando...";
      btn.disabled = true;

      await responderDuvida(id, resposta);

      carregarPainelDuvidas();
    };
  });
}
