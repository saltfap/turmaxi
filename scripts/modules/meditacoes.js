import { listarMeditacoes } from "../services/firestore.js";

function inicioDaSemana(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = day === 0 ? -6 : (1 - day);
  x.setDate(x.getDate() + diff);
  return x;
}

function fimDaSemana(d = new Date()) {
  const ini = inicioDaSemana(d);
  const fim = new Date(ini);
  fim.setDate(fim.getDate() + 6);
  fim.setHours(23, 59, 59, 999);
  return fim;
}

export async function carregarMeditacoesSemana() {
  const box = document.getElementById("meditacoes-semana");
  if (!box) return;

  box.innerHTML = "<p>Carregando...</p>";

  try {
    const lista = await listarMeditacoes();

    const ini = inicioDaSemana(new Date());
    const fim = fimDaSemana(new Date());

    const semana = lista.filter(m => {
      if (!m.data) return false;
      const dt = new Date(`${m.data}T00:00:00`);
      return dt >= ini && dt <= fim;
    });

    if (!semana.length) {
      box.innerHTML = "<p class='empty'>Nenhuma meditação cadastrada para esta semana.</p>";
      return;
    }

    box.innerHTML = semana.map(m => {
      const dt = new Date(`${m.data}T00:00:00`);
      const dia = dt.toLocaleDateString("pt-BR", { weekday: "long" });
      const dataFmt = dt.toLocaleDateString("pt-BR");
      return `
        <div class="meditacao-item">
          <strong>${dia} (${dataFmt})</strong><br>
          ${m.nome}
        </div>
      `;
    }).join("");
  } catch (e) {
    console.error("Erro meditações semana:", e);
    box.innerHTML = "<p class='empty'>Erro ao carregar meditações.</p>";
  }
}
