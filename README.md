# Zadanie 2 – Programowanie Aplikacji w Chmurze Obliczeniowej

## Opis

Pipeline GitHub Actions buduje obraz aplikacji z Dockerfile (z Zadania 1), obsługuje cache, skanuje obraz Trivy i publikuje do GHCR tylko jeśli nie wykryto CVE o wysokiej/krytycznej wadze.

## Tagowanie obrazów

Obraz nazywa się: ghcr.io/netrn07/zadanie2-app:latest

Cache tagowany jest jako: 99746/zadanie2-app-cache:latest (na DockerHub)

## Cache – konfiguracja

Wykorzystano cache typu `registry` w trybie `max`, przechowywany w publicznym repozytorium DockerHub (`99746`). Umożliwia to szybsze kolejne buildy.

##  Test CVE – Trivy

Zastosowano Trivy, który:
- Skanuje obraz po zbudowaniu,
- Przerywa pipeline jeśli wykryje podatności HIGH lub CRITICAL,
- Jest prosty do integracji z GitHub Actions.

## Wymagane sekrety

Dodaj w ustawieniach repozytorium (`Settings → Secrets and variables → Actions`):

- `GH_PAT` – GitHub token z uprawnieniami do packages
- `DOCKER_USERNAME` – Twoja nazwa użytkownika DockerHub (99746)
- `DOCKER_PASSWORD` – hasło lub token do DockerHub

## Weryfikacja

Pipeline został uruchomiony co najmniej raz – poprawnie wykonuje budowę, skan i publikację.
