const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const author = "Wiktor Wypyszynski";

// Log startowy z datą i danymi autora, ponadto jako sztuczna inteligencja... (Nie no żarcik taki :) )
const startDate = new Date().toISOString();
console.log(`[Start aplikacji] Data uruchomienia: ${startDate}`);
console.log(`[Informacja] Autor: ${author}`);
console.log(`[Informacja] Aplikacja nasłuchuje na porcie: ${port}`);

// Obsługa statycznych plików HTML
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Import biblioteki do zapytań HTTP (dynamiczny import dla zgodności z Node.js 22+)
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const API_KEY = '373c7fae82215384a990582e24acdd87';

// Endpoint POST do pobierania pogody na podstawie miasta i kraju
app.post('/weather', async (req, res) => {
  const { country, city } = req.body;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    // Logowanie odpowiedzi API (dla debugowania, pojawił się wcześniej problem z POSTem)
    console.log(`[Zapytanie] ${city}, ${country}`);
    console.log(`[Odpowiedź API] Kod statusu: ${response.status}`);

    // Jeśli API zwróci błąd (np. 404) – odsyłamy informację do użytkownika
    if (!response.ok) {
      console.warn(`[Ostrzeżenie] Nieprawidłowa lokalizacja lub problem z API. Szczegóły: ${text}`);
      return res.status(404).json({ error: "Nie znaleziono podanej lokalizacji. Sprawdź nazwę miasta i kraju." });
    }

    // Odpowiedź jest OK – parsujemy dane pogodowe i odsyłamy
    const data = JSON.parse(text);
    res.json({ weather: data });

  } catch (err) {
    // Błąd po stronie serwera, np. brak połączenia z API
    console.error(`[Błąd krytyczny] Nie udało się pobrać danych: ${err}`);
    res.status(500).json({ error: "Błąd pobierania danych pogodowych." });
  }
});

// Start serwera
app.listen(port);
