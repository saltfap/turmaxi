import { criarDuvida } from "../services/firestore.js";

export function initDuvidas() {

  const btnAbrir = document.getElementById("btn-enviar-duvida");
  const modal = document.getElementById("modal-duvida");

  const nomeInput = document.getElementById("duvida-nome");
  const disciplinaInput = document.getElementById("duvida-disciplina");
  const perguntaInput = document.getElementById("duvida-pergunta");

  const btnCancelar = document.getElementById("cancelar-duvida");
  const btnEnviar = document.getElementById("enviar-duvida");

  if (!btnAbrir) return;

  // abrir modal
  btnAbrir.onclick = () => {
    nomeInput.value = "";
    disciplinaInput.value = "";
    perguntaInput.value = "";
    modal.classList.remove("hidden");
  };

  // cancelar
  btnCancelar.onclick = () => {
    modal.classList.add("hidden");
  };

  // enviar
  btnEnviar.onclick = async () => {

    const pergunta = perguntaInput.value.trim();

    if (!pergunta) {
      alert("Digite sua dúvida.");
      return;
    }

    await criarDuvida({
      pergunta,
      nome: nomeInput.value.trim(),
      disciplina: disciplinaInput.value.trim()
    });

    modal.classList.add("hidden");

    alert(
      "Sua dúvida está pendente.\n" +
      "Quando for respondida será adicionada no mural."
    );
  };
}
