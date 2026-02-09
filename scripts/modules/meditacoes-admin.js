import {
  listarMeditacoes,
  criarMeditacao,
  editarMeditacao,
  excluirMeditacao
} from "../services/firestore.js";

export async function initMeditacoesAdmin() {

  if (!window.isAdmin) return;

  const listBox = document.getElementById("meditacoes-admin-list");
  const btnAdd = document.getElementById("btn-add-meditacao");

  const modal = document.getElementById("modal-meditacao");
  const inputData = document.getElementById("meditacao-data");
  const inputNome = document.getElementById("meditacao-nome");
  const btnSalvar = document.getElementById("salvar-meditacao");
  const btnCancelar = document.getElementById("cancelar-meditacao");

  if (!listBox || !btnAdd || !modal) return;

  async function carregarLista() {
    listBox.innerHTML = "<p>Carregando...</p>";

    const lista = await listarMeditacoes();

    if (!lista.length) {
      listBox.innerHTML = "<p class='empty'>Nenhuma meditação cadastrada.</p>";
      return;
    }

    listBox.innerHTML = lista.map(m => {
      const dt = new Date(m.data + "T00:00:00");
      const dataFmt = dt.toLocaleDateString("pt-BR");
      const dia = dt.toLocaleDateString("pt-BR", { weekday: "long" });

      return `
        <div class="duvida-admin-card">
          <div class="duvida-admin-pergunta">
            📖 ${dia} (${dataFmt}) — <strong>${m.nome}</strong>
          </div>

          <div class="evento-actions">
            <button class="btn btn-small" data-edit="${m.id}">Editar</button>
            <button class="btn btn-small btn-danger" data-del="${m.id}">Excluir</button>
          </div>
        </div>
      `;
    }).join("");

    ligarAcoes(lista);
  }

  function abrirModal(meditacao = null) {
    if (meditacao) {
      modal.dataset.editando = meditacao.id;
      inputData.value = meditacao.data || "";
      inputNome.value = meditacao.nome || "";
    } else {
      delete modal.dataset.editando;
      inputData.value = "";
      inputNome.value = "";
    }

    modal.classList.remove("hidden");
  }

  function fecharModal() {
    modal.classList.add("hidden");
  }

  function ligarAcoes(lista) {

    document.querySelectorAll("[data-edit]").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.edit;
        const m = lista.find(x => x.id === id);
        if (!m) return;
        abrirModal(m);
      };
    });

    document.querySelectorAll("[data-del]").forEach(btn => {
      btn.onclick = async () => {
        const id = btn.dataset.del;

        if (!confirm("Excluir esta meditação?")) return;

        btn.disabled = true;
        btn.textContent = "Excluindo...";

        await excluirMeditacao(id);

        await carregarLista();
      };
    });
  }

  btnAdd.onclick = () => abrirModal(null);

  btnCancelar.onclick = fecharModal;

  btnSalvar.onclick = async () => {
    const data = inputData.value;
    const nome = inputNome.value.trim();

    if (!data || !nome) {
      alert("Preencha data e nome.");
      return;
    }

    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    try {
      if (modal.dataset.editando) {
        await editarMeditacao(modal.dataset.editando, { data, nome });
        delete modal.dataset.editando;
      } else {
        await criarMeditacao({ data, nome });
      }

      fecharModal();
      await carregarLista();

    } finally {
      btnSalvar.disabled = false;
      btnSalvar.textContent = "Salvar";
    }
  };

  await carregarLista();
}
