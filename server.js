const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const memoriaAelitaPath = path.join(__dirname, "memoria/aelita_memoria.json");
const memoriaXanaPath = path.join(__dirname, "memoria/xana_memoria.json");

app.use(bodyParser.json());
app.use(express.static("public"));

// ----- AELITA MEMORIA -----
app.get("/memoria", (req, res) => {
  fs.readFile(memoriaAelitaPath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error leyendo memoria Aelita");
    res.json(JSON.parse(data));
  });
});

app.post("/memoria", (req, res) => {
  const nuevaEntrada = req.body;
  fs.readFile(memoriaAelitaPath, "utf-8", (err, data) => {
    let memoria = [];
    if (!err) memoria = JSON.parse(data);
    memoria.push(nuevaEntrada);
    fs.writeFile(memoriaAelitaPath, JSON.stringify(memoria, null, 2), (err) => {
      if (err) return res.status(500).send("Error guardando memoria Aelita");
      res.json({ status: "ok" });
    });
  });
});

// ----- XANA MEMORIA -----
app.get("/memoria-xana", (req, res) => {
  fs.readFile(memoriaXanaPath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error leyendo memoria Xana");
    res.json(JSON.parse(data));
  });
});

app.post("/memoria-xana", (req, res) => {
  const nuevaEntrada = req.body;
  fs.readFile(memoriaXanaPath, "utf-8", (err, data) => {
    let memoria = [];
    if (!err) memoria = JSON.parse(data);
    memoria.push(nuevaEntrada);
    fs.writeFile(memoriaXanaPath, JSON.stringify(memoria, null, 2), (err) => {
      if (err) return res.status(500).send("Error guardando memoria Xana");
      res.json({ status: "ok" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
