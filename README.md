# TMDB Posterwall (Expo / React Native)

Projet mobile réalisé avec **Expo** + **React Native** (TypeScript) utilisant l’API **TMDB** pour afficher des films sous forme de **poster wall** (grid), avec recherche, détails et favoris persistés.

> TMDB = The Movie Database  
> Ce projet est un exercice.

## Fonctionnalités

- **Home / Discover**
  - Liste paginée (infinite scroll) via API TMDB
  - Affichage en **grid (poster wall)** via `FlatList` (`numColumns=3`)
- **Search**
  - Écran dédié avec `TextInput` + debounce
  - Pagination réelle via API TMDB
- **Movie details** (`/movie/[id]`)
  - Route dynamique + écran de détails film
- **Favorites**
  - Ajout / suppression de favoris (state global)
  - Persistance via AsyncStorage
- **Gestures & animations**
  - Interaction type “like” sur la card avec un double tap (gesture-handler)
  - Animation du cœur via Reanimated (shared values + animated styles)

## Stack technique

- **Expo Router** (multi-screens, layouts, routes dynamiques)
- **TypeScript**
- **TMDB API**
- **React Context + Provider + reducer**
- **AsyncStorage** (persistance)
- **react-native-gesture-handler**
- **react-native-reanimated**
- **expo-image** (affichage posters)
- **expo-linear-gradient** (fondu sur le backdrop en page détail)

## Installation & lancement

### Prérequis

- Node.js (LTS recommandé)
- Expo Go (téléphone) ou simulateur/emulator
- Un compte TMDB + un token API (Read Access Token)

### Installer

`npm install`

### Lancer

`npx expo start`

## Configuration TMDB (token)

Le token TMDB est lu depuis :

`src/core/config/env.ts`

Exemple :

`export const ENV = {`
`TMDB_BASE_URL: "https://api.themoviedb.org/3",`
`TMDB_IMAGE_BASE_URL: "https://image.tmdb.org/t/p",`
`TMDB_TOKEN: "YOUR_TMDB_READ_ACCESS_TOKEN",`
`} as const;`

## Architecture (dossiers)

- `app/` : routes Expo Router (écrans)
  - `(tabs)/index.tsx` : Home
  - `(tabs)/search.tsx` : Search
  - `(tabs)/favorites.tsx` : Favorites
  - `movie/[id].tsx` : Details (route dynamique)
- `components/` : composants UI (ex: `MovieCard`)
- `src/` : logique métier + UI réutilisable
  - `src/tmdb/` : types, api calls, hooks
  - `src/providers/` : store global (favorites) + persistence

## Crédits

- Données : [TMDB API](https://developer.themoviedb.org/reference/intro/getting-started)
- Les images/posters appartiennent à leurs ayants droit (usage éducatif).
