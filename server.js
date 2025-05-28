const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const memoriaPath = path.join(__dirname, "memoria/aelita_memoria.json");

app.use(bodyParser.json());
app.use(express.static("public"));

// Leer memoria
app.get("/memoria", (req, res) => {
  fs.readFile(memoriaPath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error leyendo memoria");
    res.json(JSON.parse(data));
  });
});

// Guardar memoria
app.post("/memoria", (req, res) => {
  const nuevaEntrada = req.body;

  fs.readFile(memoriaPath, "utf-8", (err, data) => {
    let memoria = [];
    if (!err) memoria = JSON.parse(data);

    memoria.push(nuevaEntrada);

    fs.writeFile(memoriaPath, JSON.stringify(memoria, null, 2), (err) => {
      if (err) return res.status(500).send("Error guardando memoria");
      res.json({ status: "ok" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

