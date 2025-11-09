import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diciamo a Express dove si trova la cartella pubblica (frontend)
app.use(express.static(path.join(__dirname, "../frontend")));

// Quando qualcuno visita la homepage (/), mandiamo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
git commit -m "aggiungo type module"
const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const cors = require('cors');
app.use(cors());
const PORT = 4000;
const JWT_SECRET = 'dev-secret';
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Recupera il nome della ditta
    let company = req.body.company ? req.body.company.trim() : 'Sconosciuta';
    // Pulisce il nome da caratteri vietati
    company = company.replace(/[<>:"/\\|?*]+/g, '_');
    
    // Percorso cartella della ditta
    const companyDir = path.join(UPLOAD_DIR, company);
    
    // Se non esiste, la crea
    if (!fs.existsSync(companyDir)) {
      fs.mkdirSync(companyDir, { recursive: true });
      console.log(`Creata cartella per la ditta: ${company}`);
    }

    cb(null, companyDir); // multer salva lì dentro
  },

  filename: (req, file, cb) => {
    const customName = req.body.customName ? req.body.customName.trim() : '';
    const ext = path.extname(file.originalname);
    const baseName = customName || path.basename(file.originalname, ext);
    
    // Pulisce da caratteri strani
    const safeName = baseName.replace(/[<>:"/\\|?*]+/g, '_');

    let finalName = safeName + ext;
    let counter = 1;

    // Ottiene il percorso corretto della cartella della ditta
    let company = req.body.company ? req.body.company.trim() : 'Sconosciuta';
    company = company.replace(/[<>:"/\\|?*]+/g, '_');
    const companyDir = path.join(UPLOAD_DIR, company);

    // Evita di sovrascrivere file già esistenti
    while (fs.existsSync(path.join(companyDir, finalName))) {
      finalName = `${safeName}_${counter}${ext}`;
      counter++;
    }

    cb(null, finalName);
  }
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  const { company } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Nessun file caricato' });
  console.log('Ricevuto:', file.originalname, 'dalla ditta', company);
  res.json({ ok: true, nome: file.originalname });
});

app.listen(PORT, () => console.log('Server attivo su http://localhost:' + PORT));
