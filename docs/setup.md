## Démarrage rapide

Les composants dans `src/lib/users/components` utilisent ces librairies runtime. Si tu veux installer uniquement ce dont ces composants ont besoin, exécute :

```bash
# Git bash -- prod (users components)
npm install \
  flatpickr \
  next-themes @hookform/resolvers zod sonner \
  react-hook-form @hookform/resolvers zod  axios \
  cloudinary next-cloudinary \
  nodemailer clsx tailwind-merge \
  pino \
  server-only rimraf \
  moment
  #babel-plugin-react-compiler
```

# Optional (recommandé), installé shadcn

```bash
  npx shadcn@latest init
  npx shadcn@latest add button
```

```bash
# Git bash -- Dev
npm install -D \
  @svgr/webpack \
  @types/nodemailer \
  pino-pretty \
  prettier eslint-config-prettier eslint-plugin-prettier \
  prettier-plugin-classnames prettier-plugin-merge prettier-plugin-tailwindcss \
  @eslint/css eslint-plugin-import eslint-plugin-unicorn \
  eslint-plugin-unused-imports \
  husky lint-staged @commitlint/cli @commitlint/config-conventional \
  shx tailwind-csstree
```

## Fichiers / dossiers à copier pour un nouveau projet

Si tu veux réutiliser ce blueprint sans tout copier, prends au minimum :

- `src/config/` (configuration axios, api, environment, logger)
- `src/lib/` (logique commune, ui components, hooks)
- `src/utils/` (helpers réutilisables)
- `env/` (exemples `.env.*`) , sur gitignore modifié `.env*` par `.env*.local`

## Config package.json

Add lint-staged and some scripts

```bash
npm run env:local    # copie .env.local
npm run dev          # démarre next en dev
npm run build        # build
npm run start        # start
npm run lint         # eslint
npm run format       # prettier
```

## Points d’attention

- Assure-toi que `tsconfig.json` contient les `paths` suivants (pratique pour imports absolus) :

```json
"paths": {
  "@/*": ["./src/*"],
  "@lib/*": ["./src/lib/*"],
  "@config/*": ["./src/config/*"],
  "@/components/*": ["./src/lib/_/components/*"]
}
```

## Modifié le fichier eslint.config.mjs

Ajouté cette regle

```json
    {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
```

## Le Design tout ce qui concerne UI est optionnel le plus important est la partie metier
et l'architecture, sauf si tu veux démarrer un projet vierge là oui tu peux utiliser pourquoi pas tout ce template.

Mais si tu as déja un template, alors seule les config metiers suffisent:
- config
- lib 
- etc...