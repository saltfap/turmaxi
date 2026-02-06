import {
  listarEventos,
  criarEvento,
  editarEvento,
  ocultarEvento
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
let tipoInput = null;
let descInput = null;
let salvarBtn = null;
let cancelarBtn = null;

if (isAdmin) {
  modal = document.getElementById("modal-evento");
  tituloInput = document.getElementById("evento-titulo");
  tipoInput = document.getElementById("evento-tipo");
  descInput = document.getElementById("evento-descricao");

  salvarBtn = document.getElementById("salvar-evento");
  cancelarBtn = document.getElementById("cancelar-evento");
}


  let dataAtual = new Date();
  let eventos = [];
  let diaSelecionado = null;

  const hoje = new Date();
  hoje.setHours(0,0,0,0);

  // ========================
  // CARREGAR EVENTOS
  // ========================

  async function carregarEventos() {
    eventos = await listarEventos();
  }

  // ========================
  // VERIFICAR EVENTO NO DIA
  // ========================

  function eventoNoDia(dia, mes, ano) {
    return eventos.find(ev => {
      const d = ev.data.toDate();
      d.setHours(0,0,0,0);

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
      const evento = eventoNoDia(dia, mes, ano);

      if (evento) {
        el.classList.add("evento");
        el.classList.add(evento.tipo);
      }

      // clique no dia
    el.addEventListener("click", () => {

  mostrarEventosDoDia(dataDia);

  if (!isAdmin) return;

  diaSelecionado = dataDia;

  tituloInput.value = "";
  descInput.value = "";
  tipoInput.value = "aviso";

  modal.classList.remove("hidden");
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
    tipo: tipoInput.value,
    data: diaSelecionado
  });

  delete modal.dataset.editando;

} else {

  await criarEvento({
    titulo: tituloInput.value,
    descricao: descInput.value,
    tipo: tipoInput.value,
    data: diaSelecionado
  });
}


    modal.classList.add("hidden");
    renderizar();
  });

  cancelarBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}


function mostrarEventosDoDia(data) {

  const box = document.getElementById("cal-detalhes");

  const eventosDia = eventos.filter(ev => {

    const d = ev.data.toDate(); // ← CORREÇÃO
    d.setHours(0,0,0,0);

    return d.getTime() === data.getTime();
  });

  if (!eventosDia.length) {
    box.innerHTML = "<p>Nenhum evento neste dia.</p>";
    box.classList.remove("hidden");
    return;
  }

  box.innerHTML = eventosDia.map(ev => `
    <div class="evento-card ${ev.tipo}">
      <strong>${ev.titulo}</strong>
      <p>${ev.descricao || ""}</p>

      ${
        isAdmin ? `
        <div class="evento-actions">
          <button data-edit="${ev.id}">✏ Editar</button>
          <button data-hide="${ev.id}">👁 Ocultar</button>
        </div>
        ` : ""
      }
    </div>
  `).join("");

  box.classList.remove("hidden");

  if (isAdmin) ligarAcoesEventos();
}


function ligarAcoesEventos() {

  // editar
  document.querySelectorAll("[data-edit]").forEach(btn => {
    btn.onclick = () => {

      const id = btn.dataset.edit;
      const ev = eventos.find(e => e.id === id);

      diaSelecionado = ev.data.toDate();

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

      renderizar();
      document.getElementById("cal-detalhes").classList.add("hidden");
    };
  });
}



  // iniciar
  renderizar();
}
