# 💰 Rejestr Domowych Wydatków

Aplikacja webowa do rejestrowania i zarządzania domowymi wydatkami. Projekt zaliczeniowy z przedmiotu **Zaawansowane programowanie WWW**.

## 📋 Spis treści

- [Funkcjonalności](#funkcjonalności)
- [Stack technologiczny](#stack-technologiczny)
- [Wymagania](#wymagania)
- [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
- [Model bazy danych](#model-bazy-danych)
- [Endpointy API](#endpointy-api)
- [Use cases](#use-cases)
- [Struktura projektu](#struktura-projektu)

## ✨ Funkcjonalności

- Dodawanie, edytowanie i usuwanie wydatków
- Kategoryzacja wydatków (z możliwością tworzenia własnych kategorii)
- Podsumowanie: łączna kwota, liczba wpisów, średni wydatek
- Sortowanie wydatków po dacie (najnowsze na górze)
- Kolorowe oznaczenia kategorii dla lepszej czytelności
- Responsywny design (działa na komputerze i telefonie)

## 🛠️ Stack technologiczny

**Backend:**
- Node.js
- Express.js (REST API)
- SQLite (better-sqlite3) — baza danych
- CORS — komunikacja frontend ↔ backend

**Frontend:**
- Vue 3 (Composition API + Single-File Components)
- Vite (bundler / dev server)
- Bootstrap 5 (UI / responsywność)
- Axios (komunikacja HTTP)

## 📦 Wymagania

- Node.js w wersji 18+ ([nodejs.org](https://nodejs.org))
- npm (instaluje się razem z Node.js)
- Git (opcjonalnie, do klonowania repo)

## 🚀 Instalacja i uruchomienie

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/Drox94/Projekt1.git
cd Projekt1
```

### 2. Backend

```bash
cd backend
npm install
node server.js
```

Backend wystartuje na `http://localhost:3000`.

### 3. Frontend (w nowym terminalu)

```bash
cd frontend
npm install
npm run dev
```

Frontend wystartuje na `http://localhost:5173`. Otwórz tę stronę w przeglądarce.

## 🗄️ Model bazy danych

Baza SQLite (plik `backend/expenses.db`) zawiera dwie powiązane tabele:

### Tabela `expenses` (wydatki)

| Pole | Typ | Opis |
|------|-----|------|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Unikalny identyfikator wydatku |
| `category` | TEXT NOT NULL | Nazwa kategorii (powiązana z tabelą `categories`) |
| `amount` | REAL NOT NULL | Kwota wydatku (w złotych) |
| `description` | TEXT | Opcjonalny opis wydatku |
| `date` | TEXT NOT NULL | Data wydatku (format YYYY-MM-DD) |
| `created_at` | TEXT DEFAULT CURRENT_TIMESTAMP | Data utworzenia rekordu |

### Tabela `categories` (kategorie)

| Pole | Typ | Opis |
|------|-----|------|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Unikalny identyfikator kategorii |
| `name` | TEXT NOT NULL UNIQUE | Nazwa kategorii (unikalna) |
| `color` | TEXT DEFAULT 'bg-secondary' | Kolor Bootstrap dla wyświetlania |
| `created_at` | TEXT DEFAULT CURRENT_TIMESTAMP | Data utworzenia rekordu |

**Powiązanie:** Pole `expenses.category` odnosi się do `categories.name` (relacja "many-to-one" — wiele wydatków może mieć tę samą kategorię).

## 🌐 Endpointy API

Wszystkie endpointy zwracają i przyjmują dane w formacie **JSON**.

### Wydatki (`/api/expenses`)

| Metoda | Endpoint | Opis | Body | Odpowiedź |
|--------|----------|------|------|-----------|
| `GET` | `/api/expenses` | Lista wszystkich wydatków (sortowane po dacie malejąco) | — | `[{...}, {...}]` |
| `GET` | `/api/expenses/:id` | Szczegóły jednego wydatku | — | `{...}` lub 404 |
| `POST` | `/api/expenses` | Dodaj nowy wydatek | `{ category, amount, description, date }` | `201` + nowy wydatek |
| `PUT` | `/api/expenses/:id` | Edytuj wydatek | `{ category, amount, description, date }` | Zaktualizowany wydatek |
| `DELETE` | `/api/expenses/:id` | Usuń wydatek | — | `{ message, id }` |

### Kategorie (`/api/categories`)

| Metoda | Endpoint | Opis | Body | Odpowiedź |
|--------|----------|------|------|-----------|
| `GET` | `/api/categories` | Lista wszystkich kategorii (alfabetycznie) | — | `[{...}, {...}]` |
| `POST` | `/api/categories` | Dodaj nową kategorię | `{ name, color }` | `201` + nowa kategoria |
| `DELETE` | `/api/categories/:id` | Usuń kategorię | — | `{ message, id }` |

### Przykładowe żądanie

**POST** `/api/expenses`

```json
{
  "category": "jedzenie",
  "amount": 45.50,
  "description": "Zakupy w Biedronce",
  "date": "2026-05-08"
}
```

**Odpowiedź (201 Created):**

```json
{
  "id": 1,
  "category": "jedzenie",
  "amount": 45.5,
  "description": "Zakupy w Biedronce",
  "date": "2026-05-08",
  "created_at": "2026-05-08 14:23:11"
}
```

### Kody odpowiedzi

| Kod | Znaczenie |
|-----|-----------|
| `200` | OK — żądanie wykonane pomyślnie |
| `201` | Created — zasób utworzony |
| `400` | Bad Request — brakujące lub niepoprawne dane |
| `404` | Not Found — zasób nie istnieje |
| `500` | Internal Server Error — błąd serwera |

## 👤 Use cases

### UC1: Dodawanie nowego wydatku
**Aktor:** Użytkownik  
**Przebieg:**
1. Użytkownik otwiera aplikację
2. Wypełnia formularz "Dodaj nowy wydatek": kategoria, kwota, data, opis (opcjonalnie)
3. Klika przycisk "Dodaj wydatek"
4. System wysyła żądanie `POST /api/expenses` do backendu
5. Wydatek pojawia się na liście, podsumowanie aktualizuje się automatycznie

### UC2: Edycja istniejącego wydatku
**Aktor:** Użytkownik  
**Przebieg:**
1. Użytkownik klika przycisk "Edytuj" przy wybranym wydatku
2. Formularz wypełnia się bieżącymi danymi wydatku
3. Użytkownik modyfikuje dowolne pole
4. Klika "Zapisz zmiany"
5. System wysyła `PUT /api/expenses/:id` do backendu
6. Lista i podsumowanie aktualizują się automatycznie

### UC3: Usuwanie wydatku
**Aktor:** Użytkownik  
**Przebieg:**
1. Użytkownik klika przycisk "Usuń" przy wybranym wydatku
2. Aplikacja prosi o potwierdzenie
3. Po potwierdzeniu wysyła `DELETE /api/expenses/:id`
4. Wydatek znika z listy, podsumowanie się aktualizuje

### UC4: Tworzenie własnej kategorii
**Aktor:** Użytkownik  
**Przebieg:**
1. Użytkownik rozwija sekcję "Zarządzaj kategoriami"
2. Wpisuje nazwę nowej kategorii
3. Wybiera kolor z listy
4. Klika "Dodaj kategorię"
5. System wysyła `POST /api/categories`
6. Nowa kategoria pojawia się w liście kategorii i jest dostępna w formularzu wydatków

### UC5: Przeglądanie podsumowania
**Aktor:** Użytkownik  
**Przebieg:**
1. Użytkownik widzi na górze aplikacji trzy kafelki podsumowania:
   - Łączna suma wszystkich wydatków
   - Liczba wpisów
   - Średnia kwota wydatku
2. Wartości aktualizują się automatycznie po każdej zmianie danych

## 🧪 Testy

Backend zawiera 12 testów jednostkowych API napisanych w Jest + Supertest.

### Uruchomienie testów

```bash
cd backend
npm test
```

### Pokrycie testów

- **Wydatki:** GET (lista i pojedynczy), POST (poprawny i z błędnymi danymi), PUT, DELETE (poprawny i nieistniejący)
- **Kategorie:** GET, POST (poprawny, brak nazwy, duplikat)

## 📁 Struktura projektu
Projekt1/
├── backend/
│   ├── server.js          # Główny plik aplikacji (Express + endpointy)
│   ├── database.js        # Konfiguracja SQLite + tworzenie tabel
│   ├── expenses.db        # Plik bazy danych (tworzony automatycznie)
│   └── package.json       # Zależności backendu
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.vue        # Formularz dodawania/edycji
│   │   │   ├── ExpenseList.vue        # Tabela z listą wydatków
│   │   │   ├── ExpenseSummary.vue     # Kafelki podsumowania
│   │   │   └── CategoryManager.vue    # Zarządzanie kategoriami
│   │   ├── App.vue        # Główny komponent (spina wszystko)
│   │   ├── api.js         # Wywołania API (axios)
│   │   └── main.js        # Punkt startowy aplikacji
│   ├── index.html
│   └── package.json       # Zależności frontendu
├── .gitignore
└── README.md

## 📝 Autor
Paweł Niedźwiedź - 23416
Projekt zaliczeniowy — Zaawansowane programowanie WWW