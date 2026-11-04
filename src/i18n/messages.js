// Interface text. Recipe titles and ingredients come from the RecetteVie API in both languages.

export const LANGUAGES = ['fr', 'en']

export const MESSAGES = {
  fr: {
    'page.title': 'Semainier · les repas de la semaine',
    'page.description': 'Planifiez les repas de la semaine avec les recettes de RecetteVie et obtenez votre liste de courses.',
    'lang.label': 'Langue',

    'login.title': 'Les repas de la semaine, sur une seule page.',
    'login.leadStart': 'Choisissez une recette de ',
    'login.leadEnd': ' pour chaque midi et chaque soir. La liste de courses se fait toute seule.',
    'login.heading': 'Connexion',
    'login.account': 'Avec votre compte RecetteVie.',
    'login.email': 'Email',
    'login.password': 'Mot de passe',
    'login.submit': 'Se connecter',
    'login.pending': 'Connexion…',
    'login.tryIt': 'Pour essayer : ',
    'login.fillDemo': 'remplir avec le compte de démonstration',
    'login.noAccount': 'Pas encore de compte ? ',
    'login.signUp': 'Créez-le sur RecetteVie',
    'login.signUpEnd': ', il sert aussi ici.',

    'errors.sessionExpired': 'Session expirée, reconnectez-vous.',
    'errors.badCredentials': 'Email ou mot de passe incorrect.',
    'errors.unreachable': 'Impossible de joindre RecetteVie. Réessayez dans un instant.',
    'errors.recipes': "Les recettes n'ont pas pu être chargées.",

    'header.allRecipes': 'Toutes les recettes sur RecetteVie',
    'header.hello': 'Bonjour {name}',
    'header.loggedIn': 'Connecté',
    'header.logout': 'Se déconnecter',

    'week.heading': 'Semaine',
    'week.nav': 'Changer de semaine',
    'week.previous': '← Précédente',
    'week.previousLabel': 'Semaine précédente',
    'week.current': 'Cette semaine',
    'week.next': 'Suivante →',
    'week.nextLabel': 'Semaine suivante',
    'week.meals': 'Repas de la semaine {label}',
    'meal.lunch': 'Midi',
    'meal.dinner': 'Soir',

    'slot.add': '+ Choisir une recette',
    'slot.change': 'Changer',
    'slot.remove': 'Retirer',
    'slot.removeLabel': 'Retirer {title}',

    'picker.title': 'Choisir une recette',
    'picker.close': 'Fermer',
    'picker.search': 'Rechercher une recette',
    'picker.placeholder': 'Rechercher : quiche, curry…',
    'picker.empty': 'Aucune recette ne correspond à « {search} ».',
    'picker.more': 'Charger la suite',
    'picker.loading': 'Chargement…',

    'shopping.title': 'Liste de courses',
    'shopping.done': 'Tout est pris.',
    'shopping.remaining': '{remaining} sur {total} à acheter',
    'shopping.empty': "Ajoutez des recettes à la semaine : leurs ingrédients s'afficheront ici.",

    'footer.about': 'Semainier · projet portfolio de puremax-lab · recettes et photos de ',
    'footer.source': 'Code source',
    'footer.github': 'GitHub puremax-lab',
    'footer.legal': 'Mentions légales',
  },

  en: {
    'page.title': "Semainier · the week's meals",
    'page.description': "Plan the week's meals with RecetteVie recipes and get your shopping list.",
    'lang.label': 'Language',

    'login.title': "The week's meals, on a single page.",
    'login.leadStart': 'Pick a recipe from ',
    'login.leadEnd': ' for every lunch and dinner. The shopping list writes itself.',
    'login.heading': 'Log in',
    'login.account': 'With your RecetteVie account.',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Log in',
    'login.pending': 'Logging in…',
    'login.tryIt': 'To try it: ',
    'login.fillDemo': 'fill in the demo account',
    'login.noAccount': 'No account yet? ',
    'login.signUp': 'Create one on RecetteVie',
    'login.signUpEnd': ', it works here too.',

    'errors.sessionExpired': 'Your session has expired, please log in again.',
    'errors.badCredentials': 'Wrong email or password.',
    'errors.unreachable': 'RecetteVie cannot be reached. Please try again in a moment.',
    'errors.recipes': 'The recipes could not be loaded.',

    'header.allRecipes': 'All recipes on RecetteVie',
    'header.hello': 'Hello {name}',
    'header.loggedIn': 'Logged in',
    'header.logout': 'Log out',

    'week.heading': 'Week',
    'week.nav': 'Change week',
    'week.previous': '← Previous',
    'week.previousLabel': 'Previous week',
    'week.current': 'This week',
    'week.next': 'Next →',
    'week.nextLabel': 'Next week',
    'week.meals': 'Meals for the week: {label}',
    'meal.lunch': 'Lunch',
    'meal.dinner': 'Dinner',

    'slot.add': '+ Choose a recipe',
    'slot.change': 'Change',
    'slot.remove': 'Remove',
    'slot.removeLabel': 'Remove {title}',

    'picker.title': 'Choose a recipe',
    'picker.close': 'Close',
    'picker.search': 'Search for a recipe',
    'picker.placeholder': 'Search: quiche, curry…',
    'picker.empty': 'No recipe matches "{search}".',
    'picker.more': 'Load more',
    'picker.loading': 'Loading…',

    'shopping.title': 'Shopping list',
    'shopping.done': 'All done.',
    'shopping.remaining': '{remaining} of {total} left to buy',
    'shopping.empty': 'Add recipes to the week and their ingredients will appear here.',

    'footer.about': 'Semainier · portfolio project by puremax-lab · recipes and photos from ',
    'footer.source': 'Source code',
    'footer.github': 'GitHub puremax-lab',
    'footer.legal': 'Legal notice',
  },
}

// The API sends the French category name; RecetteVie translates it by slug, like here.
export const CATEGORIES_EN = {
  entrees: 'Starters',
  plats: 'Main courses',
  desserts: 'Desserts',
  vegetarien: 'Vegetarian',
  boulangerie: 'Bakery',
  boissons: 'Drinks',
}
