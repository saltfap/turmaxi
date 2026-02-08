// =======================
// 📚 MEDITAÇÃO — SEMANA
// =======================

export async function salvarMeditacaoSemana(dados) {

  return addDoc(collection(db, "meditacoes"), {
    ...dados,
    criadoEm: serverTimestamp()
  });

}

export async function listarMeditacoesSemana() {

  const snapshot = await getDocs(
    query(
      collection(db, "meditacoes"),
      orderBy("data", "asc")
    )
  );

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
