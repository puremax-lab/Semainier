# Semainier

**A React app to plan the week's meals and get the shopping list, built on the RecetteVie API.**
*Application React pour planifier les repas de la semaine et obtenir la liste de courses.*

### 👉 [Try the live demo](https://puremax-lab.alwaysdata.net/semainier)

Click **remplir avec le compte de démonstration**, then **Se connecter** (it is the RecetteVie demo account: `camille@recettevie.test` / `password`).

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![RecetteVie API](https://img.shields.io/badge/uses-RecetteVie_API_(JWT)-38A9B4)
[![Tests](https://github.com/puremax-lab/Semainier/actions/workflows/tests.yml/badge.svg)](https://github.com/puremax-lab/Semainier/actions/workflows/tests.yml)

![The week](docs/screenshots/week.png)

## Two apps, one API

Semainier has no server of its own. It is a front end for [RecetteVie](https://github.com/puremax-lab/RecetteVie), my Symfony recipe website, to which I added a REST API with API Platform. The recipes, the accounts and the meal plans all live in RecetteVie.

```mermaid
sequenceDiagram
    participant S as Semainier (React)
    participant R as RecetteVie API (Symfony)
    S->>R: POST /api/login (email, password)
    R-->>S: JWT (valid 1 hour, includes the first name)
    S->>R: GET /api/meal_plan_entries?day[after]=…&day[before]=… + JWT
    R-->>S: this member's meals for the week
    S->>R: GET /api/recipes?title=…&page=2
    R-->>S: 12 recipes, with their ingredients
    S->>R: POST /api/meal_plan_entries (recipe, day, lunch or dinner) + JWT
    R-->>S: 201, replaces the recipe already in that slot
```

## What it does

- **Log in** with a RecetteVie account. The session survives a reload until the token expires.
- **Plan the week**: a lunch and a dinner for each of the 7 days. Pick a recipe in a side panel with search and infinite scroll, change it or remove it.
- **Move between weeks**: previous, current, next.
- **Shopping list**: the ingredients of the week's recipes, each line once, with the recipes it is for. Lines can be ticked off, and are remembered per week in the browser.
- **Responsive**: 7 columns on a desktop, the days one under the other on a phone.

## How it is built

- **React 19 with hooks only**: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`. No router or state library: the app is one screen.
- **API calls in one place** ([`api.js`](src/lib/api.js)). A 401 answer turns into an `AuthError`, which logs the member out with a message.
- **No stale answers**: each `useEffect` that fetches data ignores the answer if the week or the search changed in the meantime ([`Planner.jsx`](src/components/Planner.jsx), [`RecipePicker.jsx`](src/components/RecipePicker.jsx)). The loading state is derived from what was asked and what was received, not set by hand.
- **Optimistic removal**: a removed recipe disappears at once, and comes back if the API refuses.
- **Infinite scroll** with an `IntersectionObserver`, plus a **Charger la suite** button for keyboards and old browsers.
- **Side panel** with the native `<dialog>` element: focus kept inside, closed with Escape.
- **Shopping list logic** as a pure function ([`shopping.js`](src/lib/shopping.js)): lines are compared without case, accents or extra spaces ("3 œufs" and "3 oeufs" stay apart, "Sel, poivre" and "sel, poivre" merge).
- **One domain online**: both apps are served from `puremax-lab.alwaysdata.net`, so the browser needs no CORS. In development, Vite forwards `/api` to RecetteVie ([`vite.config.js`](vite.config.js)).
- **Tests** with Vitest and Testing Library: dates, shopping list, session, login screen, and the planner with a mocked API (plan, remove, logout on 401). They run on every push with GitHub Actions, with the linter and the build.

On the RecetteVie side, the API work is described in [its README](https://github.com/puremax-lab/RecetteVie#technical-highlights): read-only recipes, a `MealPlanEntry` resource limited to its owner, JWT login.

## Screens

| Choosing a recipe | Shopping list |
|---|---|
| ![Recipe picker](docs/screenshots/picker.png) | ![Shopping list](docs/screenshots/shopping.png) |

| Login | Phone |
|---|---|
| ![Login](docs/screenshots/login.png) | ![Phone](docs/screenshots/mobile-week.png) |

## Run it locally

Semainier needs RecetteVie running on http://127.0.0.1:8000 with its API set up (see [Run it locally](https://github.com/puremax-lab/RecetteVie#run-it-locally) in RecetteVie, including the JWT key pair). Then, with Node.js 22 or later:

```bash
git clone https://github.com/puremax-lab/Semainier.git
cd Semainier
npm install
npm run dev    # http://localhost:5173
npm test
```

## Credits

The recipe photos come from RecetteVie, which credits their [Unsplash](https://unsplash.com) photographers in [its README](https://github.com/puremax-lab/RecetteVie#photo-credits).

## Author

**puremax-lab**: [github.com/puremax-lab](https://github.com/puremax-lab)
