import { responder } from "../ai/aelita.js";

document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("user-input");
  const output = document.getElementById("output");
  let currentAI = "Aelita";

  const AIs = {
    Aelita: {
      name: "Aelita",
      color: "var(--aelita-color)",
      intro: "Hola, soy Aelita. ¿En qué puedo ayudarte con programación?",
    },
    Xaya: {
      name: "XAYA",
      color: "var(--XAYA-color)",
      intro: "Sistema XAYA en línea. Directrices priorizadas.",
    },
  };

  function agregarMensaje(nombre, mensaje, colorVar) {
    const mensajeDiv = document.createElement("div");
    mensajeDiv.innerHTML = `<strong style="color:${colorVar}">${nombre}:</strong> ${mensaje}`;
    output.appendChild(mensajeDiv);
    output.scrollTop = output.scrollHeight;
  }

  function procesarMensaje(input) {
    if (input.startsWith("/protocolo ")) {
      const nuevaAI = input.split(" ")[1];
      if (AIs[nuevaAI]) {
        currentAI = nuevaAI;
        agregarMensaje("Sistema", `Protocolo cambiado a ${nuevaAI}`, "var(--terminal-text)");
        agregarMensaje(AIs[nuevaAI].name, AIs[nuevaAI].intro, AIs[nuevaAI].color);
      } else {
        agregarMensaje("Sistema", `IA desconocida: ${nuevaAI}`, "var(--terminal-text)");
      }
      return;
    }

    agregarMensaje("hopper", input, "var(--Hopper-color)");

    responder(input).then((respuesta) => {
      agregarMensaje(AIs[currentAI].name, respuesta, AIs[currentAI].color);
    });
  }

  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const input = userInput.value.trim();
      if (!input) return;
      procesarMensaje(input);
      userInput.value = "";
    }
  });
});



