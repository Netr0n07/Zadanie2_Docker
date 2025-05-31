# Etap 1 – Budowanie aplikacji w lekkim środowisku Node.js Alpine
FROM node:22-alpine AS builder

# Autor obrazu (zgodnie z OCI)
LABEL org.opencontainers.image.authors="Wiktor Wypyszynski"

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie plików zależności i instalacja paczek (bez devDependencies)
COPY package*.json ./
RUN npm install --omit=dev

# Kopiowanie reszty aplikacji do kontenera
COPY . .

# Etap 2 – Finalny obraz z działającą aplikacją
FROM node:22-alpine

# Powtórne oznaczenie autora (finalny obraz)
LABEL org.opencontainers.image.authors="Wiktor Wypyszynski"

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie wszystkiego z etapu buildera
COPY --from=builder /app .

# Wystawienie portu, na którym działa aplikacja
EXPOSE 3000

# Kontrola działania kontenera (czy działa frontend)
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Komenda uruchamiająca aplikację
CMD ["node", "app.js"]
