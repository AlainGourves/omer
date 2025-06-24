# recettes

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```
or
```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```
or
```sh
bun run dev
```

### Compile and Minify for Production

```sh
npm run build
```
or
```sh
bun run build
```

__Note:__ Après le `build`, le script supprime le fichier `index.html` créé par Vite et tente de copier les fichiers JS et CSS dans le répertoire du plugin.

Le chemin est à modifier en fonction de la situation dans `package.json`.

Par exemple, en supposant, une version locale de Wordpress gérée avec [Local](https://localwp.com/), ça donne :

```
"$HOME/Local Sites/[répertoire de Wordpress]/app/public/wp-content/plugins/demi-sel-plugin/public/"
```
où `$HOME` donne le chemin de la racine du répertoire de l'utilisateur courant.