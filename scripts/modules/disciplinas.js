import {
  criarDisciplina,
  editarDisciplina
} from "../services/firestore.js";

import { carregarAvaliacoes } from "./avaliacoes.js";


export function initCriarDisciplina() {
  if (!window.isAdmin) return;

  const btn = document.getElementById("btn-criar-disciplina");
  const modal = document.getElementById("modal-disciplina");
  const input = document.getElementById("disciplina-nome");
  const salvar = document.getElementById("salvar-disciplina");
  const cancelar = document.getElementById("cancelar-disciplina");

  // Mostra botão para liderança
  btn.classList.remove("hidden");

  btn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    input.focus();
  });

  cancelar.addEventListener("click", () => {
    modal.classList.add("hidden");
    input.value = "";
  });

  salvar.addEventListener("click", async () => {
  const nome = input.value.trim();
  if (!nome) {
    alert("Informe o nome da disciplina.");
    return;
  }

  salvar.disabled = true;

  try {
    const editandoId = modal.dataset.editando;

    if (editandoId) {
      await editarDisciplina(editandoId, nome);
      delete modal.dataset.editando;
    } else {
      await criarDisciplina(nome);
    }

    modal.classList.add("hidden");
    input.value = "";
    salvar.textContent = "Criar";

    await carregarAvaliacoes();

  } catch (err) {
    console.error(err);
    alert("Erro ao salvar disciplina.");
  } finally {
    salvar.disabled = false;
  }
});

}
