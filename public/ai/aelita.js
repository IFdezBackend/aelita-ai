// Usamos localStorage como "memoria"
function guardarEnMemoriaLocal(entrada) {
  const memoria = JSON.parse(localStorage.getItem("aelita_memoria") || "[]");
  memoria.push({ fecha: new Date().toISOString(), entrada });
  localStorage.setItem("aelita_memoria", JSON.stringify(memoria));
}

function cargarMemoriaLocal() {
  return JSON.parse(localStorage.getItem("aelita_memoria") || "[]");
}

export async function responder(texto) {
  const textoLimpio = texto.toLowerCase();
  guardarEnMemoriaLocal(textoLimpio);

  // Respuestas base simples
  const respuestasBase = {
    "hola": "¡Hola! Soy Aelita. ¿En qué puedo ayudarte hoy con tu código?",
    "ayuda": "Puedo ayudarte a programar backend, crear APIs, depurar errores y más. ¿Qué necesitas?",
    "gracias": "¡De nada! Estoy para ayudarte a programar.",
    "quien eres": "Soy Aelita, tu asistente de código especializada en backend."
  };

  for (const clave in respuestasBase) {
    if (textoLimpio.includes(clave)) return respuestasBase[clave];
  }

  // Asistencias comunes de programación
  if (textoLimpio.includes("express") && textoLimpio.includes("ruta")) {
    return `Para crear una ruta en Express, puedes usar:

app.get('/ruta', (req, res) => {
  res.send('Hola desde la ruta!');
});`;
  }

  if (textoLimpio.includes("crear api")) {
    return `Puedes crear una API básica en Node.js usando Express así:

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ mensaje: 'Hola mundo API' });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));`;
  }

  if (textoLimpio.includes("leer json") || textoLimpio.includes("fs")) {
    return `Puedes leer un archivo JSON con Node.js usando fs:

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('archivo.json', 'utf8'));
console.log(data);`;
  }

  // Consulta a memoria
  if (textoLimpio === "memoria") {
    const recuerdos = cargarMemoriaLocal();
    return recuerdos.length
      ? `He guardado ${recuerdos.length} entradas: \n- ` + recuerdos.map(r => r.entrada).join('\n- ')
      : "Aún no tengo memoria guardada.";
  }

  // Default genérico
  return "Hmm... aún estoy aprendiendo sobre eso. ¿Puedes explicarlo de otra forma o ser más específico?";
}
