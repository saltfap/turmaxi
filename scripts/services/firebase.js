// firebase.js
// Inicialização do Firebase — Turma XI | Teologia SALT-FAP

// Importações (Firebase v9+ modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// ⚠️ SUBSTITUA com os dados do seu projeto
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0wCuCyxkenxTvGK2q07HRBdOW3Ch_aco",
  authDomain: "teologia-xi-salt-fap.firebaseapp.com",
  projectId: "teologia-xi-salt-fap",
  storageBucket: "teologia-xi-salt-fap.appspot.com",
  messagingSenderId: "990758863820",
  appId: "1:990758863820:web:6296df6f8664700fd75369"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Serviços
const db = getFirestore(app);
const storage = getStorage(app);

// Exporta para uso no app
export { db, storage };