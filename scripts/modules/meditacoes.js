import {
  listarMeditacoesSemana
} from "../services/firestore.js";

export async function carregarMeditacoesSemana() {

  const box = document.getElementById("meditacoes-semana");
  if (!box) return;

  box.innerHTML = "<p>Carregando...</p>";

  try {

    const lista = await listarMeditacoesSemana();

    if (!lista.length) {
      box.innerHTML =
        "<p class='empty'>Nenhuma meditação cadastrada.</p>";
      return;
    }

    box.innerHTML = lista.map(m => {

      const data = new Date(m.data);
      const diaSemana =
        data.toLocaleDateString("pt-BR", {
          weekday: "long"
        });

      return `
        <div class="meditacao-item">
          <strong>${diaSemana}</strong><br>
          ${m.nome}
        </div>
      `;

    }).join("");

  } catch (err) {

    console.error("Erro meditações:", err);
    box.innerHTML =
      "<p class='empty'>Erro ao carregar.</p>";

  }

}
