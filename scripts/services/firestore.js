// firestore.js
// Acesso ao Firestore — Turma XI | Teologia SALT-FAP

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { db } from "./firebase.js";

console.log("firestore.js carregou");

// ===== ANÚNCIOS =====

export async function listarAnuncios() {
  const q = query(
    collection(db, "anuncios"),
    where("ativo", "==", true),
    orderBy("criadoEm", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function criarAnuncio(dados) {
  return addDoc(collection(db, "anuncios"), {
    ...dados,
    ativo: true,
    criadoEm: serverTimestamp()
  });
}

export async function ocultarAnuncio(id) {
  const ref = doc(db, "anuncios", id);
  return updateDoc(ref, { ativo: false });
}


/* =======================
   DISCIPLINAS
======================= */

export async function listarDisciplinas() {
  const q = query(
    collection(db, "disciplinas"),
    where("ativo", "==", true),
    orderBy("nome")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/* =======================
   AVALIAÇÕES
======================= */

export async function listarAvaliacoesPorDisciplina(disciplinaId) {
  const q = query(
    collection(db, "avaliacoes"),
    where("ativo", "==", true),
    where("disciplinaId", "==", disciplinaId),
    orderBy("data")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function criarDisciplina(nome) {
  return await addDoc(collection(db, "disciplinas"), {
    nome: nome,
    ativo: true,
    criadoEm: serverTimestamp()
  });
}

export async function editarDisciplina(id, novoNome) {
  const ref = doc(db, "disciplinas", id);
  return updateDoc(ref, {
    nome: novoNome
  });
}

export async function ocultarDisciplina(id) {
  const ref = doc(db, "disciplinas", id);
  return updateDoc(ref, {
    ativo: false
  });
}

// =======================
// AVALIAÇÕES - ADMIN
// =======================

export async function criarAvaliacao(dados) {
  return addDoc(collection(db, "avaliacoes"), {
    ...dados,
    ativo: true,
    criadoEm: serverTimestamp()
  });
}

export async function editarAvaliacao(id, dados) {
  const ref = doc(db, "avaliacoes", id);
  return updateDoc(ref, dados);
}

export async function ocultarAvaliacao(id) {
  const ref = doc(db, "avaliacoes", id);
  return updateDoc(ref, {
    ativo: false
  });
}

// =======================
// AVALIAÇÕES (HOME)
// =======================

export async function listarAvaliacoesAtivas() {
  // 1. Buscar disciplinas
  const disciplinasSnap = await getDocs(
    query(
      collection(db, "disciplinas"),
      where("ativo", "==", true)
    )
  );

  const disciplinasMap = {};
  disciplinasSnap.forEach(doc => {
    disciplinasMap[doc.id] = doc.data().nome;
  });

  // 2. Buscar avaliações
  const avaliacoesSnap = await getDocs(
    query(
      collection(db, "avaliacoes"),
      where("ativo", "==", true),
      orderBy("data", "asc")
    )
  );

  // 3. Montar avaliações com nome da disciplina
  return avaliacoesSnap.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      disciplinaNome: disciplinasMap[data.disciplinaId] || "—"
    };
  });
}


