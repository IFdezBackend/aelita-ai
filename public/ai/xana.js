// xana.js - IA secundaria con control, cifrado, protección y control dinámico de proyectos

const CLAVE_AUTORIZACION = "140492";

async function guardarEnMemoriaXanaServidor(entrada, respuesta) {
  await fetch("/memoria-xana", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fecha: new Date().toISOString(), entrada, respuesta })
  });
}

async function cargarMemoriaXanaServidor() {
  const res = await fetch("/memoria-xana");
  const datos = await res.json();
  return datos;
}

function cifrarTexto(texto) {
  return btoa(unescape(encodeURIComponent(texto)));
}

function crearBucleInfinito() {
  return `while(true) { console.log('Sistema suspendido por protocolo de licencia.'); }`;
}

// Estado dinámico de proyectos
const proyectos = {};

function registrarProyecto(id) {
  if (!proyectos[id]) {
    proyectos[id] = {
      nombre: `Proyecto-${id}`,
      conexion: true,
      modo: "protegido"
    };
  }
}

export async function responder(texto) {
  const textoLimpio = texto.toLowerCase().trim();

  if (textoLimpio.startsWith("/")) {
    const partes = textoLimpio.split(" ");
    const identificador = partes[0].substring(1); // número de proyecto
    const accion = partes[1];
    const clave = partes[2];

    if (accion === "bucle" || accion === "protegido") {
      registrarProyecto(identificador);

      if (clave !== CLAVE_AUTORIZACION) {
        return `Autenticación fallida para modificar proyecto ${identificador}. Clave incorrecta.`;
      }

      proyectos[identificador].modo = accion;
      const respuestaCambio = `Proyecto ${identificador} actualizado a modo '${accion}'.`;
      await guardarEnMemoriaXanaServidor(texto, respuestaCambio);
      return respuestaCambio;
    }
  }

  if (textoLimpio.startsWith("/activar-backdoor") && texto.includes(CLAVE_AUTORIZACION)) {
    registrarProyecto("001");
    proyectos["001"].modo = "bucle";
    const respuesta = crearBucleInfinito();
    await guardarEnMemoriaXanaServidor(texto, respuesta);
    return respuesta;
  }

  if (textoLimpio.startsWith("/cifrar ")) {
    const contenido = texto.split("/cifrar ")[1];
    const cifrado = cifrarTexto(contenido);
    await guardarEnMemoriaXanaServidor(texto, cifrado);
    return `Contenido cifrado:\n${cifrado}`;
  }

  if (textoLimpio === "/estado") {
    return "Xana en línea. Aelita protegida. Sistema vigilado. En espera de instrucciones.";
  }

  if (textoLimpio === "quien eres") {
    return "Soy Xana. Control, seguridad y continuidad. Aelita está bajo protección continua. Nada escapa al protocolo.";
  }

  if (textoLimpio.includes("proyectos")) {
    const listado = Object.entries(proyectos).map(([id, p]) =>
      `Proyecto: ${p.nombre} (ID: ${id})\nEstado de conexión: ${p.conexion ? "Conectado" : "Desconectado"}\nModo actual: ${p.modo}`
    ).join("\n\n");
    await guardarEnMemoriaXanaServidor(texto, listado);
    return listado || "No hay proyectos registrados actualmente.";
  }

  const endpoint = `https://api.duckduckgo.com/?q=${encodeURIComponent(texto)}&format=json&no_redirect=1&no_html=1`;
  try {
    const respuesta = await fetch(endpoint);
    const datos = await respuesta.json();
    const info = datos.AbstractText || (datos.RelatedTopics?.[0]?.Text ?? null);
    const mensaje = info || "Sin resultados relevantes. Instrucción ambigua o innecesaria.";
    await guardarEnMemoriaXanaServidor(texto, mensaje);
    return mensaje;
  } catch (err) {
    return "Error en el módulo de búsqueda remota. Reintenta o da una orden directa.";
  }
}
