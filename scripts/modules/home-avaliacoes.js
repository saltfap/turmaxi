import { listarAvaliacoesAtivas } from "../services/firestore.js";

export async function carregarAvaliacoesHome() {
  const hojeEl = document.getElementById("avaliacoes-hoje");
  const semanaEl = document.getElementById("avaliacoes-semana");
  const pendenciasEl = document.getElementById("avaliacoes-pendencias");

  hojeEl.innerHTML = "";
  semanaEl.innerHTML = "";
  pendenciasEl.innerHTML = "";

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const fimSemana = new Date(hoje);
  fimSemana.setDate(hoje.getDate() + (7 - hoje.getDay()));
  fimSemana.setHours(23, 59, 59, 999);

  const avaliacoes = await listarAvaliacoesAtivas();

  let pendencias = {
    prova: 0,
    trabalho: 0
  };

  let temHoje = false;
  let temSemana = false;

  avaliacoes.forEach(av => {
    if (!av.data?.toDate) return;

    const dataEvento = new Date(
      av.data.toDate().getTime() +
      av.data.toDate().getTimezoneOffset() * 60000
    );

    dataEvento.setHours(0, 0, 0, 0);

    // 🔹 HOJE
    if (dataEvento.getTime() === hoje.getTime()) {
      hojeEl.appendChild(criarItemHome(av, dataEvento));
      temHoje = true;
    }

    // 🔹 ESSA SEMANA
    else if (dataEvento > hoje && dataEvento <= fimSemana) {
      semanaEl.appendChild(criarItemHome(av, dataEvento));
      temSemana = true;
    }

    // 🔹 PENDÊNCIAS
    if (dataEvento >= hoje) {
      pendencias[av.tipo]++;
    }
  });

  if (!temHoje) {
    hojeEl.innerHTML = "<p class='empty'>Nenhuma avaliação hoje.</p>";
  }

  if (!temSemana) {
    semanaEl.innerHTML = "<p class='empty'>Nenhuma avaliação esta semana.</p>";
  }

  // 🔹 Pendências (resumo)
  const totalPendencias = pendencias.prova + pendencias.trabalho;

  pendenciasEl.innerHTML = totalPendencias
    ? `
      <p>
        ${pendencias.prova ? `${pendencias.prova} Prova(s)` : ""}
        ${pendencias.trabalho ? ` • ${pendencias.trabalho} Trabalho(s)` : ""}
      </p>
    `
    : "<p class='empty'>Nenhuma pendência.</p>";
}

function criarItemHome(av, dataEvento) {
  const div = document.createElement("div");
  div.className = "avaliacao-home-item";

  div.innerHTML = `
    <span class="avaliacao-tipo-badge ${av.tipo}">
      ${av.tipo === "prova" ? "Prova" : "Trabalho"}
    </span>

    <div class="avaliacao-home-texto">
      <span class="avaliacao-disciplina">
        ${av.disciplinaNome || ""}
      </span>

      <strong class="avaliacao-home-titulo">
        ${av.titulo}
      </strong>

      <span class="avaliacao-home-data">
        📅 ${dataEvento.toLocaleDateString("pt-BR")}
      </span>
    </div>
  `;

  return div;
}
