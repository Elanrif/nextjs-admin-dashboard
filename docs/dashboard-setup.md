## Intégration du Dashboard

L'implémentation du dashboard nécessite la configuration des styles globaux ainsi que
 l'installation de plusieurs dépendances (graphes, cartes et calendriers).

---

### 1. Configuration des styles globaux (`globals.css`)

Avant toute chose, assure-toi d'inclure les directives CSS personnalisées du template 
dans ton fichier `globals.css` :

```css
@theme;
@theme inline;
@utilities;
@layer;
```

### 2. Installation des dépendances (`package.json`)
⚠️ Note sur React 19 : Le package react-simple-maps provoque un conflit de dépendances (ERESOLVE).
 Par défaut, l'utilisation du flag --legacy-peer-deps est indispensable 
 pour forcer l'installation des nouveaux packages sans bloquer le projet.

✅ Solution définitive : Pour éviter d'avoir à taper ce flag à chaque installation, 
il suffit d'utiliser la propriété "overrides" dans le fichier package.json.
Cela permet de forcer la compatibilité avec React 19 de manière automatique.
```json
  "overrides": {
    "@react-jvectormap/core": {
      "react": "^16.8.0 || ^17 || ^18 || ^19",
      "react-dom": "^16.8.0 || ^17 || ^18 || ^19"
    },
    "@react-jvectormap/world": {
      "react": "^16.8.0 || ^17 || ^18 || ^19",
      "react-dom": "^16.8.0 || ^17 || ^18 || ^19"
    }
  }
```

### 3. Installation dependencies
```bash
npm install \
  apexcharts react-apexcharts \
  @react-jvectormap/core @react-jvectormap/world react-dropzone --legacy-peer-deps
  @fullcalendar/core \
  @fullcalendar/daygrid \
  @fullcalendar/interaction \
  @fullcalendar/list \
  @fullcalendar/react \
  @fullcalendar/timegrid \
  #--legacy-peer-deps
```
