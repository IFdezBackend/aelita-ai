// aelita.js - IA principal con memoria, aprendizaje y asistencia backend

async function guardarEnMemoriaAelitaServidor(entrada, respuesta) {
  await fetch("/memoria", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fecha: new Date().toISOString(), entrada, respuesta })
  });
}

async function cargarMemoriaAelitaServidor() {
  const res = await fetch("/memoria");
  const datos = await res.json();
  return datos;
}

function encontrarEnMemoria(pregunta, memoria) {
  const entrada = pregunta.toLowerCase();
  const coincidencia = memoria.find(item => entrada.includes(item.entrada));
  return coincidencia ? coincidencia.respuesta : null;
}

function filtrarMemoria(palabraClave, memoria) {
  return memoria.filter(item => !item.entrada.includes(palabraClave.toLowerCase()));
}

export async function responder(texto) {
  const textoLimpio = texto.toLowerCase().trim();
  const memoria = await cargarMemoriaAelitaServidor();

  if (textoLimpio.startsWith("/olvidar ")) {
    const palabra = textoLimpio.split("/olvidar ")[1];
    const nuevaMemoria = filtrarMemoria(palabra, memoria);
    await fetch("/memoria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaMemoria)
    });
    return `He olvidado todo lo relacionado con '${palabra}'.`;
  }

  const respuestaMemoria = encontrarEnMemoria(textoLimpio, memoria);
  if (respuestaMemoria) return respuestaMemoria;

  let respuesta = "Hmm... aún estoy aprendiendo sobre eso. ¿Puedes explicarlo de otra forma o ser más específico?";

  const respuestasBase = {
    "hola": "¡Hola! Soy Aelita, encantada de ayudarte con tu código. ¿Qué necesitas?",
    "ayuda": "Claro que sí, puedo ayudarte a programar backend, crear APIs, depurar errores y más. 😊",
    "gracias": "¡De nada! Me encanta ayudarte a programar.",
    "quien eres": "Soy Aelita, una IA simpática especializada en desarrollo backend y asistencia técnica."
  };

  for (const clave in respuestasBase) {
    if (textoLimpio.includes(clave)) {
      respuesta = respuestasBase[clave];
      await guardarEnMemoriaAelitaServidor(textoLimpio, respuesta);
      return respuesta;
    }
  }

  if (textoLimpio.includes("express") && textoLimpio.includes("ruta")) {
    respuesta = `Para crear una ruta en Express, puedes usar:

app.get('/ruta', (req, res) => {
  res.send('Hola desde la ruta!');
});`;
  } else if (textoLimpio.includes("crear api")) {
    respuesta = `Puedes crear una API básica en Node.js usando Express así:

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ mensaje: 'Hola mundo API' });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));`;
  } else if (textoLimpio.includes("leer json") || textoLimpio.includes("fs")) {
    respuesta = `Puedes leer un archivo JSON con Node.js usando fs:

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('archivo.json', 'utf8'));
console.log(data);`;
  } else if (textoLimpio === "memoria" || textoLimpio === "/memoria") {
    respuesta = memoria.length
      ? `He guardado ${memoria.length} entradas:\n- ` + memoria.map(r => r.entrada).join('\n- ')
      : "Aún no tengo memoria guardada.";
  } else {
    // Búsqueda externa si no hay coincidencia
    const endpoint = `https://api.duckduckgo.com/?q=${encodeURIComponent(textoLimpio)}&format=json&no_redirect=1&no_html=1`;
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      const resultado = data.AbstractText || (data.RelatedTopics?.[0]?.Text ?? null);
      if (resultado) respuesta = `He encontrado esto para ti: ${resultado}`;
    } catch {
      respuesta = "No pude conectarme para buscar, intenta con otra pregunta.";
    }
  }

  await guardarEnMemoriaAelitaServidor(textoLimpio, respuesta);
  return respuesta;
}

