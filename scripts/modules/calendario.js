export function initCalendario() {

  const titulo = document.getElementById("cal-titulo");
  const grid = document.getElementById("cal-grid");

  const btnPrev = document.getElementById("cal-prev");
  const btnNext = document.getElementById("cal-next");

  let dataAtual = new Date();

  function renderizar() {

    grid.innerHTML = "";

    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    const meses = [
      "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
      "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
    ];

    titulo.textContent = `${meses[mes]} ${ano}`;

    // espaços vazios
    for (let i = 0; i < primeiroDia; i++) {
      const vazio = document.createElement("div");
      grid.appendChild(vazio);
    }

    // dias
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const el = document.createElement("div");
      el.className = "cal-dia";
      el.textContent = dia;
      grid.appendChild(el);
    }

  }

  btnPrev.addEventListener("click", () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    renderizar();
  });

  btnNext.addEventListener("click", () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    renderizar();
  });

  renderizar();
}
