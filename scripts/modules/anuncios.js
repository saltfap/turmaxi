// anuncios.js
import {
  listarAnuncios,
  criarAnuncio,
  ocultarAnuncio
} from "../services/firestore.js";

console.log("anuncios.js carregou");

export async function carregarAnuncios() {
  const container = document.getElementById("anuncios-list");
  container.innerHTML = "<p class='empty'>Carregando...</p>";

  try {
    const anuncios = await listarAnuncios();

    if (anuncios.length === 0) {
      container.innerHTML = "<p class='empty'>Nenhum anúncio publicado.</p>";
      return;
    }

    container.innerHTML = "";

    anuncios.forEach(anuncio => {
      // filtro defensivo
      if (anuncio.ativo === false) return;

      const card = document.createElement("div");
      card.className = "anuncio-item";

      const data = anuncio.criadoEm?.toDate
        ? anuncio.criadoEm.toDate()
        : null;

      const dataFormatada = data
        ? data.toLocaleString("pt-BR") + " " +
          data.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
          })
        : "";

      card.innerHTML = `
  <div class="anuncio-topo">
    <strong class="anuncio-titulo">${anuncio.titulo}</strong>

    ${
      dataFormatada
        ? `<span class="anuncio-data">${dataFormatada}</span>`
        : ""
    }
  </div>

  ${
    anuncio.categoria
      ? `<span class="anuncio-categoria">${anuncio.categoria}</span>`
      : ""
  }

  <p class="anuncio-descricao">${anuncio.descricao}</p>

  ${
    window.isAdmin
      ? `<button class="btn btn-small btn-danger" data-id="${anuncio.id}">
           Ocultar
         </button>`
      : ""
  }
`;


      // botão ocultar
      if (window.isAdmin) {
        const btnOcultar = card.querySelector("button[data-id]");
        btnOcultar.addEventListener("click", async () => {
          const confirmar = confirm("Deseja ocultar este anúncio?");
          if (!confirmar) return;

          try {
            await ocultarAnuncio(anuncio.id);
            carregarAnuncios();
          } catch (err) {
            console.error(err);
            alert("Erro ao ocultar anúncio.");
          }
        });
      }

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='empty'>Erro ao carregar anúncios.</p>";
  }
}

export function initCriarAnuncio() {
  if (!window.isAdmin) return;

  const btnCriar = document.querySelector(".card button.admin-only");
  if (!btnCriar) return;

  const modal = document.getElementById("modal-anuncio");
  const cancelar = document.getElementById("cancelar-anuncio");
  const salvar = document.getElementById("salvar-anuncio");

  const inputTitulo = document.getElementById("anuncio-titulo");
  const inputCategoria = document.getElementById("anuncio-categoria");
  const inputDescricao = document.getElementById("anuncio-descricao");

  btnCriar.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cancelar.addEventListener("click", () => {
    modal.classList.add("hidden");
    limpar();
  });

  salvar.addEventListener("click", async () => {
    const titulo = inputTitulo.value.trim();
    const descricao = inputDescricao.value.trim();

    if (!titulo || !descricao) {
      alert("Preencha título e descrição.");
      return;
    }

    salvar.disabled = true;
    salvar.textContent = "Publicando...";

    try {
      await criarAnuncio({
  titulo,
  categoria: inputCategoria.value.trim(),
  descricao
});


      modal.classList.add("hidden");
      limpar();
      carregarAnuncios();

    } catch (err) {
      console.error(err);
      alert("Erro ao criar anúncio.");
    } finally {
      salvar.disabled = false;
      salvar.textContent = "Publicar";
    }
  });

  function limpar() {
  inputTitulo.value = "";
  inputCategoria.value = "";
  inputDescricao.value = "";
}

}