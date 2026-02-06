import {
  listarEventos,
  criarEvento,
  editarEvento,
  ocultarEvento,
  listarAvaliacoesAtivas
} from "../services/firestore.js";


import { Timestamp } from 
"https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export function initCalendario() {
  const isAdmin = window.isAdmin === true;

  const titulo = document.getElementById("cal-titulo");
  const grid = document.getElementById("cal-grid");

  const btnPrev = document.getElementById("cal-prev");
  const btnNext = document.getElementById("cal-next");

  let modal = null;
let tituloInput = null;
let descInput = null;
let salvarBtn = null;
let cancelarBtn = null;

if (isAdmin) {
  modal = document.getElementById("modal-evento");
  tituloInput = document.getElementById("evento-titulo");
  descInput = document.getElementById("evento-descricao");

  salvarBtn = document.getElementById("salvar-evento");
  cancelarBtn = document.getElementById("cancelar-evento");
}


  let dataAtual = new Date();
  let eventos = [];
  let avaliacoes = [];
  let diaSelecionado = null;

  const hoje = new Date();
  hoje.setHours(0,0,0,0);

  // ========================
  // CARREGAR EVENTOS
  // ========================

  async function carregarEventos() {
  eventos = await listarEventos();
  avaliacoes = await listarAvaliacoesAtivas();
}

  // ========================
  // VERIFICAR EVENTO NO DIA
  // ========================

  function eventoNoDia(dia, mes, ano) {
    return eventos.find(ev => {
      const d = normalizarDataFirestore(ev.data);

      return (
        d.getDate() === dia &&
        d.getMonth() === mes &&
        d.getFullYear() === ano
      );
    });
  }

  // ========================
  // RENDER CALENDÁRIO
  // ========================

  async function renderizar() {

console.log("Evento salvo:", diaSelecionado);
    await carregarEventos();

    grid.innerHTML = "";

    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    const meses = [
      "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
      "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
    ];

    titulo.textContent = `${meses[mes]} ${ano}`;

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    // espaços vazios
    for (let i = 0; i < primeiroDia; i++) {
      grid.appendChild(document.createElement("div"));
    }

    // dias
    for (let dia = 1; dia <= diasNoMes; dia++) {

      const el = document.createElement("div");
      el.className = "cal-dia";
      el.textContent = dia;

      const dataDia = new Date(ano, mes, dia);
      dataDia.setHours(0,0,0,0);

      // destaque hoje
      if (dataDia.getTime() === hoje.getTime()) {
        el.classList.add("hoje");
      }

      // evento
      const lista = itensDoDia(dia, mes, ano);

      if (lista.length) {
  el.classList.add("evento");

  // prioridade visual
  el.classList.add(lista[0].tipo);
}

      // clique no dia
    el.addEventListener("click", () => {
  mostrarEventosDoDia(dataDia);
});

      grid.appendChild(el);
    }
  }

  // ========================
  // NAVEGAÇÃO
  // ========================

  btnPrev.addEventListener("click", () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    renderizar();
  });

  btnNext.addEventListener("click", () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    renderizar();
  });

  // ========================
  // SALVAR EVENTO
  // ========================

  if (isAdmin && salvarBtn && cancelarBtn) {

  salvarBtn.addEventListener("click", async () => {

    if (!diaSelecionado) return;
    if (!tituloInput.value.trim()) return;

    if (modal.dataset.editando) {

  await editarEvento(modal.dataset.editando, {
  titulo: tituloInput.value,
  descricao: descInput.value,
  tipo: "aviso",
  data: diaSelecionado
});


  delete modal.dataset.editando;

} else {

  await criarEvento({
  titulo: tituloInput.value,
  descricao: descInput.value,
  tipo: "aviso",
  data: diaSelecionado
});

}


    modal.classList.add("hidden");

await renderizar();
mostrarEventosDoDia(diaSelecionado);

  });

  cancelarBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

function normalizarDataFirestore(data) {

  if (!data) return null;

  let d;

  if (typeof data.toDate === "function") {
    d = data.toDate(); // Timestamp
  } else {
    d = new Date(data); // fallback
  }

  d.setHours(0,0,0,0);
  return d;
}


function mostrarEventosDoDia(data) {

  if (!data) return;

  const box = document.getElementById("cal-detalhes");

  const dataNormalizada = new Date(data);
  dataNormalizada.setHours(0,0,0,0);

  box.innerHTML = "";

  const eventosDia = itensDoDia(
  dataNormalizada.getDate(),
  dataNormalizada.getMonth(),
  dataNormalizada.getFullYear()
);



  // =========================
  // Cabeçalho do dia
  // =========================

  box.innerHTML = `
    <h3>${dataNormalizada.toLocaleDateString("pt-BR")}</h3>

    ${
      isAdmin ? `
        <button id="btn-add-evento" class="btn">
          + Adicionar evento
        </button>
      ` : ""
    }
  `;

  // =========================
  // Lista de eventos
  // =========================

  if (!eventosDia.length) {

    box.innerHTML += `<p>Nenhum evento neste dia.</p>`;

  } else {

    box.innerHTML += eventosDia.map(ev => `
      <div class="evento-card ${ev.tipo}">
        <strong>${ev.titulo}</strong>
        <p>${ev.descricao || ""}</p>

        ${
          isAdmin ? `
          <div class="evento-actions">
            <button data-edit="${ev.id}">✏ Editar</button>
            <button data-hide="${ev.id}">🗑 Ocultar</button>
          </div>
          ` : ""
        }
      </div>
    `).join("");
  }

  box.classList.remove("hidden");

  // =========================
  // Botão adicionar evento
  // =========================

  if (isAdmin) {
    const btnAdd = document.getElementById("btn-add-evento");

    if (btnAdd) {
      btnAdd.onclick = () => {

        diaSelecionado = dataNormalizada;

        tituloInput.value = "";
        descInput.value = "";

        delete modal.dataset.editando;

        modal.classList.remove("hidden");
      };
    }

    ligarAcoesEventos();
  }
}



function itensDoDia(dia, mes, ano) {

  const lista = [];

  // eventos manuais
  eventos.forEach(ev => {
    const d = ev.data.toDate();
    d.setHours(0,0,0,0);

    if (
      d.getDate() === dia &&
      d.getMonth() === mes &&
      d.getFullYear() === ano
    ) {
      lista.push({
        ...ev,
        origem: "evento",
        tipo: "aviso"
      });
    }
  });

  // avaliações
  avaliacoes.forEach(av => {
    const d = av.data.toDate();
    d.setHours(0,0,0,0);

    if (
      d.getDate() === dia &&
      d.getMonth() === mes &&
      d.getFullYear() === ano
    ) {
      lista.push({
        id: av.id,
        titulo: av.titulo,
        descricao: av.disciplinaNome,
        tipo: av.tipo,
        origem: "avaliacao"
      });
    }
  });

  return lista;
}



function ligarAcoesEventos() {

  // editar
  document.querySelectorAll("[data-edit]").forEach(btn => {
    btn.onclick = () => {

      const id = btn.dataset.edit;
      const ev = eventos.find(e => e.id === id);

diaSelecionado = ev.data.toDate();
diaSelecionado.setHours(0,0,0,0);

      tituloInput.value = ev.titulo;
      descInput.value = ev.descricao || "";
      tipoInput.value = ev.tipo;

      modal.dataset.editando = id;

      modal.classList.remove("hidden");
    };
  });

  // ocultar
  document.querySelectorAll("[data-hide]").forEach(btn => {
    btn.onclick = async () => {

      const id = btn.dataset.hide;

      if (!confirm("Ocultar evento?")) return;

await ocultarEvento(id);

await carregarEventos();
await renderizar();

mostrarEventosDoDia(diaSelecionado);


    };
  });
}



  // iniciar
renderizar();

const box = document.getElementById("cal-detalhes");
if (box) box.classList.add("hidden");


}
