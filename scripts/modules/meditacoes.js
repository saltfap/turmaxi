import { listarMeditacoes } from "../services/firestore.js";

function inicioDaSemana(d = new Date()) {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  const day = x.getDay(); // 0 dom..6 sáb
  const diff = day === 0 ? -6 : (1 - day); // semana começa segunda
  x.setDate(x.getDate() + diff);
  return x;
}

function fimDaSemana(d = new Date()) {
  const ini = inicioDaSemana(d);
  const fim = new Date(ini);
  fim.setDate(fim.getDate() + 6);
  fim.setHours(23,59,59,999);
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
      const dt = new Date(m.data + "T00:00:00");
      return dt >= ini && dt <= fim;
    });

///PREGAÇÃO DE HOJE///

const hoje = new Date();
const hojeStr = hoje.toISOString().slice(0,10); // YYYY-MM-DD

const hojeItem = semana.find(m => m.data === hojeStr);

const boxHoje = document.getElementById("meditacao-hoje");
if (boxHoje) {
  if (hojeItem) {
    const dt = new Date(hojeItem.data + "T00:00:00");
    boxHoje.innerHTML = `
      <div class="top">
        <div class="data"><strong>HOJE</strong> • ${dt.toLocaleDateString("pt-BR")}</div>
        <span class="badge">Pregação do dia</span>
      </div>
      <div class="nome">${hojeItem.nome}</div>
    `;
    boxHoje.classList.remove("hidden");
  } else {
    boxHoje.classList.add("hidden");
    boxHoje.innerHTML = "";
  }
}


    if (!semana.length) {
      box.innerHTML = "<p class='empty'>Nenhuma meditação cadastrada para esta semana.</p>";
      return;
    }

    box.innerHTML = semana.map(m => {
      const dt = new Date(m.data + "T00:00:00");
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
