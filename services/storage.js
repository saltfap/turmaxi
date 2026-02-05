// storage.js
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

import { storage } from "./firebase.js";

export async function uploadPDF(file) {
  const nomeSeguro = `${Date.now()}-${file.name}`;
  const pdfRef = ref(storage, `pdfs/anuncios/${nomeSeguro}`);

  await uploadBytes(pdfRef, file);

  return getDownloadURL(pdfRef);
}