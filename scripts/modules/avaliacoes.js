import {
  listarDisciplinas,
  listarAvaliacoesPorDisciplina,
  editarDisciplina,
  ocultarDisciplina,
  editarAvaliacao,
  ocultarAvaliacao
} from "../services/firestore.js";

console.log("AVALIAÇÕES.JS NOVO CARREGADO");

export async function carregarAvaliacoes() {
  const container = document.getElementById("avaliacoes-list");
  container.innerHTML = "<p class='empty'>Carregando avaliações...</p>";

  try {
    const disciplinas = await listarDisciplinas();

    if (disciplinas.length === 0) {
      container.innerHTML = "<p class='empty'>Nenhuma disciplina cadastrada.</p>";
      return;
    }

    container.innerHTML = "";

    for (const disciplina of disciplinas) {
      const bloco = document.createElement("div");
      bloco.className = "disciplina";

      bloco.innerHTML = `
  <div class="disciplina-header">
    <span class="disciplina-nome">${disciplina.nome}</span>

    ${
      window.isAdmin
        ? `
      <div class="disciplina-actions">
        <button class="btn-icon editar">✏️</button>
        <button class="btn-icon ocultar">👁️</button>
      </div>
      `
        : ""
    }

    <span class="disciplina-toggle">▶</span>
  </div>

<div class="disciplina-conteudo hidden">

  ${
    window.isAdmin
      ? `
    <button
      class="btn btn-nova-avaliacao admin-only"
      data-disciplina-id="${disciplina.id}"
    >
      + Nova avaliação
    </button>
    `
      : ""
  }

  <div class="avaliacoes-container">
    <p class="empty">Carregando...</p>
  </div>
</div>

`;


      const conteudo = bloco.querySelector(".disciplina-conteudo");
      const avaliacoesContainer =
  conteudo.querySelector(".avaliacoes-container");

      const header = bloco.querySelector(".disciplina-header");
      const toggle = bloco.querySelector(".disciplina-toggle");

if (window.isAdmin) {
  const btnOcultar = bloco.querySelector(".btn-icon.ocultar");
  const btnEditar = bloco.querySelector(".btn-icon.editar");

  btnOcultar.addEventListener("click", async (e) => {
    e.stopPropagation();

    const confirmar = confirm(
      `Deseja ocultar a disciplina "${disciplina.nome}"?\n\nEssa ação é definitiva.`
    );

    if (!confirmar) return;

    try {
      await ocultarDisciplina(disciplina.id);
      await carregarAvaliacoes();
    } catch (err) {
      console.error(err);
      alert("Erro ao ocultar disciplina.");
    }
  });

  btnEditar.addEventListener("click", (e) => {
    e.stopPropagation();

    const modal = document.getElementById("modal-disciplina");
    const input = document.getElementById("disciplina-nome");
    const salvar = document.getElementById("salvar-disciplina");

    modal.dataset.editando = disciplina.id;
    input.value = disciplina.nome;

    salvar.textContent = "Salvar";
    modal.classList.remove("hidden");
  });
}

        header.addEventListener("click", async () => {
        const aberto = !conteudo.classList.contains("hidden");

        conteudo.classList.toggle("hidden");
        toggle.textContent = aberto ? "▶" : "▼";

        if (!aberto && conteudo.dataset.loaded !== "true") {
          try {
            const avaliacoes = await listarAvaliacoesPorDisciplina(disciplina.id);

            if (avaliacoes.length === 0) {
              avaliacoesContainer.innerHTML =
                "<p class='empty'>Nenhuma avaliação cadastrada.</p>";
            } else {
              avaliacoesContainer.innerHTML = "";

              avaliacoes.forEach(av => {
                const item = document.createElement("div");
                item.className = "avaliacao-item";

                const dataEvento = av.data?.toDate
  ? new Date(
      av.data.toDate().getTime() +
      av.data.toDate().getTimezoneOffset() * 60000
    ).toLocaleDateString("pt-BR")
  : "";

const postadoEm = av.criadoEm?.toDate
  ? av.criadoEm.toDate().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo"
    })
  : "";

item.innerHTML = `
  <div class="avaliacao-card">

    <!-- Linha 1: Título + data de postagem + ações -->
    <div class="avaliacao-topo">
      <div class="avaliacao-topo-texto">
        <span class="avaliacao-titulo">
          ${av.titulo}
        </span>

        <span class="avaliacao-postagem">
          ${postadoEm}
        </span>
      </div>

      ${
        window.isAdmin
          ? `
        <div class="avaliacao-actions">
          <button class="btn-icon editar">✏️</button>
          <button class="btn-icon ocultar">👁️</button>
        </div>
        `
          : ""
      }
    </div>

    <!-- Linha 2: Tipo -->
    <div class="avaliacao-tipo-badge ${av.tipo}">
      ${av.tipo === "prova" ? "Prova" : "Trabalho"}
    </div>

    <!-- Linha 3: Data do evento -->
    <div class="avaliacao-data-evento">
      📅 ${dataEvento}
    </div>

    <!-- Linha 4: Descrição -->
    <div class="avaliacao-descricao hidden">
      ${av.descricao || ""}
    </div>

  </div>
`;

if (window.isAdmin) {
  const btnEditar = item.querySelector(".btn-icon.editar");
  const btnOcultar = item.querySelector(".btn-icon.ocultar");

  // EDITAR
  btnEditar.addEventListener("click", (e) => {
    e.stopPropagation();

    const modal = document.getElementById("modal-avaliacao");

    modal.dataset.editando = av.id;
    modal.dataset.disciplinaId = av.disciplinaId;

    document.getElementById("avaliacao-tipo").value = av.tipo;
    document.getElementById("avaliacao-titulo").value = av.titulo;
    document.getElementById("avaliacao-data").value =
      av.data?.toDate
        ? av.data.toDate().toISOString().split("T")[0]
        : "";

    document.getElementById("avaliacao-descricao").value =
      av.descricao || "";

    document.getElementById("salvar-avaliacao").textContent = "Salvar";

    modal.classList.remove("hidden");
  });

  // OCULTAR
  btnOcultar.addEventListener("click", async (e) => {
    e.stopPropagation();

    const confirmar = confirm(
      `Deseja ocultar esta avaliação?\n\nEssa ação é definitiva.`
    );

    if (!confirmar) return;

    try {
      await ocultarAvaliacao(av.id);
      await carregarAvaliacoes();
    } catch (err) {
      console.error(err);
      alert("Erro ao ocultar avaliação.");
    }
  });
}



item
  .querySelector(".avaliacao-card")
  .addEventListener("click", (e) => {
    if (e.target.closest(".avaliacao-actions")) return;

    item
      .querySelector(".avaliacao-descricao")
      .classList.toggle("hidden");
  });

                avaliacoesContainer.appendChild(item);
              });
            }

            conteudo.dataset.loaded = "true";

          } catch (err) {
            console.error(
              "Erro ao carregar avaliações da disciplina:",
              err
            );
            avaliacoesContainer.innerHTML =
              "<p class='empty'>Erro ao carregar avaliações.</p>";
          }
        }
      });

      container.appendChild(bloco);
    }

  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p class='empty'>Erro ao carregar avaliações.</p>";
  }
}

