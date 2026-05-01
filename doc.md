# Skild Project Guide

Ce document explique comment fonctionne le projet Skild dans son ensemble, avec un focus particulier sur les **server actions** de TanStack Start.

## 1. Vue d'ensemble

Skild est un registre de "skills" pour agents. L'application permet de :

- lister les skills les plus recents
- voir le detail d'un skill
- creer un skill
- modifier un skill
- supprimer un skill
- synchroniser l'utilisateur connecte depuis Clerk vers MongoDB

Le projet est construit avec :

- **TanStack Start** pour le rendu full-stack
- **TanStack Router** pour le routage par fichiers
- **Clerk** pour l'authentification
- **MongoDB + Mongoose** pour la persistance
- **React Hook Form** pour les formulaires
- **Zod** pour la validation des donnees serveur
- **Tailwind CSS** pour le style

## 2. Structure du projet

Les dossiers les plus importants sont :

- `src/routes` : pages et routes de l'application
- `src/server` : logique serveur, base de donnees, models, server actions
- `src/components` : composants UI reutilisables
- `src/styles.css` : styles globaux et classes de composants

### Routes principales

- `src/routes/__root.tsx` : layout global, provider Clerk, Query Client, navbar
- `src/routes/index.tsx` : page d'accueil avec les derniers skills
- `src/routes/skills/new.tsx` : formulaire de creation
- `src/routes/skills/$id.tsx` : page detail d'un skill
- `src/routes/skills/$id/edit.tsx` : page de modification
- `src/routes/__auth/sign-in.$.tsx` et `src/routes/__auth/sign-up.$.tsx` : auth Clerk

### Couches serveur

- `src/server/db/connection.ts` : connexion MongoDB avec cache
- `src/server/models/user.ts` : modele User
- `src/server/models/skill.ts` : modele Skill
- `src/server/skills/*.ts` : server actions et fonctions de lecture
- `src/server/users/sync-current-user.ts` : synchronisation Clerk -> MongoDB

## 3. Les server actions

### C'est quoi ?

Dans TanStack Start, une server action est une fonction declaree avec `createServerFn`.
Elle s'excute cote serveur, mais peut etre appelee depuis le client comme une fonction normale.

Exemple mental :

- le composant front appelle la fonction
- TanStack Start envoie l'appel au serveur
- le code serveur valide les donnees
- le code serveur lit ou ecrit en base
- la fonction retourne une valeur JSON serialisable

### Pourquoi c'est utile ?

- pas besoin d'ecrire une API REST separee pour chaque action
- le code serveur reste proche de l'utilisation cote UI
- la validation et les regles metier restent centralisees
- le typage est plus simple a suivre

### Les pieces importantes

- `createServerFn({ method: "GET" | "POST" })`
- `.inputValidator(zodSchema)`
- `.handler(async ({ data }) => { ... })`
- `useServerFn(serverFn)` pour l'appeler depuis un composant React

### Difference entre `GET` et `POST`

- `GET` sert surtout pour lire des donnees
- `POST` sert pour creer, modifier ou supprimer

Dans ce projet :

- `getLatestSkills` est un `GET`
- `getSkill` est un `GET`
- `getEditableSkill` est un `GET`
- `createSkill` est un `POST`
- `updateSkill` est un `POST`
- `deleteSkill` est un `POST`
- `syncCurrentUserToDb` est un `POST`

## 4. Cycle de vie d'une server action

Le cycle est toujours proche du meme schema :

1. le composant ou le loader appelle la server action
2. la validation Zod verifie l'entree
3. la fonction lit l'utilisateur courant avec Clerk si necessaire
4. la connexion MongoDB est ouverte via `connectToDatabase()`
5. Mongoose lit ou ecrit les donnees
6. la fonction retourne un objet simple
7. la page consomme ce resultat

## 5. Les server actions du projet

### `src/server/users/sync-current-user.ts`

Role :

- synchroniser l'utilisateur Clerk courant dans MongoDB

Quand elle est appelee :

- depuis `Navbar.tsx`, quand un utilisateur est connecte

Ce qu'elle fait :

- valide `clerkId`, `email`, `username`, `name`, `imageUrl`
- ouvre la connexion MongoDB
- fait un `findOneAndUpdate` avec `upsert: true`
- cree ou met a jour le document User

Retour :

- `{ ok: true }`

Point important :

- cette action permet de relier les donnees Clerk et les skills en base

### `src/server/skills/create-skill.ts`

Role :

- creer un nouveau skill

Regles :

- l'utilisateur doit etre connecte
- le user doit exister en base MongoDB
- les champs sont valides par Zod

Etapes :

1. verifier l'authentification via `auth()`
2. recuperer l'auteur dans `UserModel`
3. creer le skill avec `SkillModel.create()`
4. retourner l'id du skill cree

Retour :

- `{ id: string }`

Utilisation :

- appelee depuis `src/routes/skills/new.tsx`

### `src/server/skills/update-skill.ts`

Role :

- modifier un skill existant

Regles :

- l'utilisateur doit etre connecte
- le skill doit appartenir a cet utilisateur

Etapes :

1. verifier l'authentification
2. trouver le user MongoDB correspondant a Clerk
3. chercher le skill avec `_id` et `author`
4. mettre a jour les champs si le skill appartient bien au user
5. retourner l'id du skill

Retour :

- `{ id: string }`

Utilisation :

- appelee depuis `src/routes/skills/$id/edit.tsx`

### `src/server/skills/delete-skill.ts`

Role :

- supprimer un skill

Regles :

- l'utilisateur doit etre connecte
- il ne peut supprimer que ses propres skills

Etapes :

1. verifier l'authentification
2. trouver le user MongoDB
3. executer `deleteOne` avec `_id` et `author`
4. verifier que `deletedCount` n'est pas zero

Retour :

- `{ ok: true }`

Utilisation :

- appelee depuis `src/routes/skills/$id.tsx`

### `src/server/skills/get-latest-skills.ts`

Role :

- charger les skills les plus recents pour la page d'accueil

Etapes :

1. appeler `fetchLatestSkills()`
2. retourner la liste serialisee

Retour :

- `SkillRecord[]`

Utilisation :

- loader de `src/routes/index.tsx`

### `src/server/skills/get-skill.ts`

Role :

- charger un skill en detail

Etapes :

1. valider l'id
2. recuperer le skill via `fetchSkillById()`
3. verifier l'utilisateur courant
4. retourner le skill et `canEdit`

Retour :

- `{ skill, canEdit }`

Utilisation :

- loader de `src/routes/skills/$id.tsx`

### `src/server/skills/get-editable-skill.ts`

Role :

- charger un skill seulement si le user peut le modifier

Etapes :

1. verifier l'authentification
2. charger le skill via `fetchEditableSkillById()`
3. refuser si le user n'est pas l'auteur

Retour :

- `SkillRecord`

Utilisation :

- loader de `src/routes/skills/$id/edit.tsx`

## 6. Fonctions de lecture et normalisation

Le fichier `src/server/skills/skill-views.ts` contient la logique de lecture partagee.

### Pourquoi ce fichier existe ?

Il evite de dupliquer la logique de lecture dans plusieurs server actions.

### Les fonctions principales

- `fetchLatestSkills()` : liste toutes les skills recentes
- `fetchSkillById(id)` : retourne une skill ou `null`
- `fetchEditableSkillById(id, clerkId)` : retourne le skill si l'utilisateur est l'auteur

### Point important

Ce fichier utilise une aggregation MongoDB pour :

- joindre le skill avec son auteur
- ordonner les skills par `createdAt` decroissant
- produire une forme de donnees directement exploitable par l'UI

La fonction `serializeSkill()` convertit le resultat Mongo en `SkillRecord`, qui est plus simple pour le front.

## 7. Modeles MongoDB

### `src/server/models/user.ts`

Le modele `User` stocke :

- `clerkId`
- `email`
- `username`
- `name`
- `imageUrl`

### `src/server/models/skill.ts`

Le modele `Skill` stocke :

- `author`
- `title`
- `description`
- `tags`
- `installCommand`
- `promptConfig`
- `usageExample`

### `src/server/models/index.ts`

Ce fichier centralise les exports :

- `UserModel`
- `SkillModel`

## 8. Connexion base de donnees

Le fichier `src/server/db/connection.ts` gere la connexion MongoDB.

### Ce qu'il fait

- lit `MONGODB_URI`
- cree une connexion cachee
- re-utilise la connexion pendant le hot reload
- expose `connectToDatabase()`
- expose `disconnectFromDatabase()`

### Pourquoi c'est important ?

Sans cache, le serveur de dev peut ouvrir trop de connexions MongoDB.
Ici, la connexion est gardee en memoire pour eviter ce probleme.

## 9. Comment le front appelle les server actions

Il y a deux grands cas.

### Cas 1 : Loader de route

Exemple :

- `src/routes/index.tsx` appelle `getLatestSkills()`
- `src/routes/skills/$id.tsx` appelle `getSkill()`
- `src/routes/skills/$id/edit.tsx` appelle `getEditableSkill()`

Ici, la route recupere les donnees avant de rendre la page.

### Cas 2 : Action depuis un composant

Exemple :

- `src/routes/skills/new.tsx` appelle `createSkill`
- `src/routes/skills/$id/edit.tsx` appelle `updateSkill`
- `src/routes/skills/$id.tsx` appelle `deleteSkill`

Ici, le composant utilise `useServerFn(...)` ou appelle la fonction server-side dans un handler.

### Exemple concret

```tsx
const updateSkillFn = useServerFn(updateSkill);

await updateSkillFn({
  data: {
    id: skill.id,
    title: values.title,
    description: values.description,
    tags: normalizedTags,
  },
});
```

Le composant :

- collecte les valeurs du formulaire
- nettoie les tags
- appelle la server action
- gere la navigation ou l'erreur

## 10. Flux metier principaux

### Publication d'un skill

1. l'utilisateur ouvre `/skills/new`
2. le formulaire collecte les donnees
3. les tags sont convertis en tableau
4. `createSkill()` valide puis enregistre
5. l'utilisateur est redirige vers la page detail

### Edition d'un skill

1. l'utilisateur ouvre `/skills/$id/edit`
2. `getEditableSkill()` verifie qu'il est l'auteur
3. le formulaire est pre-rempli
4. `updateSkill()` valide et met a jour
5. retour vers la page detail

### Suppression d'un skill

1. l'utilisateur ouvre la page detail
2. il clique sur supprimer
3. `deleteSkill()` verifie la propriete
4. le skill est supprime
5. retour a l'accueil

### Synchronisation de l'utilisateur

1. `Navbar.tsx` lit l'utilisateur Clerk
2. `syncCurrentUserToDb()` est appelee
3. MongoDB garde une copie locale du user
4. les skills peuvent referencer cet utilisateur

## 11. Authentification et autorisation

### Authentification

Clerk fournit l'utilisateur courant.
Dans les server actions, `auth()` permet de recuperer `userId`.

### Autorisation

Le projet verifie plusieurs niveaux d'acces :

- un utilisateur non connecte ne peut pas creer, modifier ou supprimer
- un utilisateur connecte ne peut modifier/supprimer que ses propres skills
- la page detail calcule `canEdit` pour afficher les bonnes actions

## 12. Formulaire et ergonomie

Le formulaire utilise `react-hook-form`.

Avantages :

- validation simple
- state de soumission propre
- erreurs de champs faciles a afficher

Les tags sont saisis sous forme de chaine puis transformes en tableau avec :

```ts
values.tags
  .split(",")
  .map((tag) => tag.trim())
  .filter(Boolean);
```

Cette logique est utilisee dans :

- creation
- edition

## 13. Style et composants UI

Le style global est defini dans `src/styles.css`.

Classes importantes :

- `.btn-primary`
- `.btn-secondary`
- `.form-item`
- `.form-label`
- `.input-field`
- `.input-field-textarea`
- `.form-message`

Composants notables :

- `Navbar`
- `Crosshair`
- `SkillCard`

## 14. Comment lire le code efficacement

Si tu veux comprendre le projet rapidement, lis dans cet ordre :

1. `src/routes/__root.tsx`
2. `src/routes/index.tsx`
3. `src/server/skills/skill-views.ts`
4. `src/server/skills/create-skill.ts`
5. `src/routes/skills/new.tsx`
6. `src/routes/skills/$id.tsx`
7. `src/routes/skills/$id/edit.tsx`
8. `src/server/users/sync-current-user.ts`
9. `src/server/db/connection.ts`
10. `src/server/models/user.ts`
11. `src/server/models/skill.ts`

## 15. Variables d'environnement

Le projet depend au minimum de :

- `MONGODB_URI`
- `VITE_CLERK_PUBLISHABLE_KEY`

Selon le setup Clerk, il peut aussi y avoir :

- `CLERK_WEBHOOK_SIGNING_SECRET`

## 16. Commandes utiles

```bash
npm install
npm run dev
npm run build
npm run test
npm run lint
npm run format
npm run check
```

## 17. Points a retenir

- Les server actions sont le coeur du projet cote backend.
- La validation passe par Zod avant toute operation MongoDB.
- Clerk sert a l'identite, MongoDB sert a la persistance.
- `skill-views.ts` regroupe la logique de lecture partagee.
- `Navbar.tsx` synchronise l'utilisateur connecte dans la base.

## 18. Petit glossaire

- **Server action** : fonction serveur appelable depuis le front
- **Loader** : recuperation de donnees avant rendu de la page
- **Model** : schema Mongoose pour lire/crire une collection
- **Serialization** : transformation d'un document DB vers une forme simple pour le front
- **Authorization** : verification des droits d'acces

---

Si tu veux, je peux aussi transformer ce document en version plus pedagogique avec :

- des diagrammes de flux
- une section "exemple pas a pas"
- un mini lexique des fichiers du projet
