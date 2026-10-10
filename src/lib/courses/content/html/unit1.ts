import { Unit } from "@/types/course";

export const htmlUnit1: Unit = {
  id: "html-unit-1",
  languageId: "html",
  title: "Les Fondations du Web",
  description: "Découvre les balises indispensables et apprends à structurer tes premières pages web.",
  order: 1,
  color: "#FF6B35",
  guideMarkdown: `
# Bienvenue en HTML !
Le HTML (HyperText Markup Language) est le squelette de toutes les pages web.
Ce n'est pas un langage de programmation, mais un langage de **balisage**.

### Les points clés :
- Les **balises** entourent le contenu : \`<p>Ceci est un paragraphe</p>\`.
- Une balise a une ouverture \`<balise>\` et une fermeture \`</balise>\`.
- Les attributs apportent des précisions : \`<a href="https://codingo.dev">Lien</a>\`.
- Le navigateur interprète ce code pour afficher le rendu visuel.
  `,
  chapters: [
    {
      id: "html-ch-1",
      unitId: "html-unit-1",
      title: "Les Fondations",
      order: 1,
      lessons: [
        {
          id: "html-l-1-1",
          unitId: "html-unit-1",
          chapterId: "html-ch-1",
          title: "Qu'est-ce que le HTML ?",
          order: 1,
          type: "lesson",
          xpReward: 10,
          exercises: [
            {
              id: "ex-1-1-1",
              type: "explanation",
              title: "Le langage du Web",
              instruction: "Lis attentivement cette introduction au Web.",
              content: `
HTML signifie **HyperText Markup Language**.
- **HyperText** : Des liens qui relient les pages entre elles à travers le monde.
- **Markup** : Des "balises" qui structurent les textes, images et boutons.

Imagine que le HTML est le plan d'architecte et les briques d'une maison.
              `,
            },
            {
              id: "ex-1-1-2",
              type: "qcm",
              title: "Vérification",
              instruction: "Que signifie le 'M' de HTML ?",
              options: ["Master", "Markup", "Modern", "Machine"],
              correctAnswer: "Markup",
              explanation: "HTML est un langage de balisage (Markup language).",
            },
            {
              id: "ex-1-1-3",
              type: "true_false",
              title: "Vrai ou Faux",
              instruction: "Le HTML permet de calculer des trajectoires de fusées et exécuter des boucles complexes.",
              options: ["Vrai", "Faux"],
              correctAnswer: "Faux",
              explanation: "Le HTML structure le document. C'est JavaScript qui gère la logique de calcul.",
            },
            {
              id: "ex-1-1-4",
              type: "fill_blanks",
              title: "Complète la règle",
              instruction: "Remplis les blancs par les termes clés.",
              content: "Le HTML utilise des [balises] pour structurer le [contenu] d'une page.",
              correctAnswer: ["balises", "contenu"],
            },
            {
              id: "ex-1-1-5",
              type: "editor",
              title: "Ton premier paragraphe",
              instruction: "Écris le texte 'Bonjour Codingo' à l'intérieur d'une balise `<p>`.",
              code: "",
              correctAnswer: "<p>Bonjour Codingo</p>",
              explanation: "Bravo ! Tu as écrit ton tout premier paragraphe HTML.",
            },
          ],
        },
        {
          id: "html-l-1-2",
          unitId: "html-unit-1",
          chapterId: "html-ch-1",
          title: "La structure d'une page",
          order: 2,
          type: "lesson",
          xpReward: 15,
          exercises: [
            {
              id: "ex-1-2-1",
              type: "explanation",
              title: "L'anatomie d'un document",
              instruction: "Découvre le squelette standard universel de tout fichier HTML.",
              content: `
Toute page web moderne commence par :
1. \`<!DOCTYPE html>\` : Indique au navigateur qu'il s'agit de HTML5.
2. \`<html>\` : La balise racine qui englobe toute la page.
3. \`<head>\` : Les métadonnées (titre d'onglet, polices, styles).
4. \`<body>\` : Tout ce qui s'affiche à l'écran pour les visiteurs !
              `,
            },
            {
              id: "ex-1-2-2",
              type: "order_code",
              title: "Remets dans l'ordre",
              instruction: "Ordonne ces balises pour reconstruire le squelette HTML.",
              options: [
                "<!DOCTYPE html>",
                "<html>",
                "<head></head>",
                "<body></body>",
                "</html>",
              ],
              correctAnswer: [
                "<!DOCTYPE html>",
                "<html>",
                "<head></head>",
                "<body></body>",
                "</html>",
              ],
            },
            {
              id: "ex-1-2-3",
              type: "qcm",
              title: "Zone visible",
              instruction: "Dans quelle balise place-t-on le contenu visible par l'internaute ?",
              options: ["<head>", "<body>", "<title>", "<meta>"],
              correctAnswer: "<body>",
              explanation: "La balise <body> contient tous les textes, images et éléments visibles.",
            },
            {
              id: "ex-1-2-4",
              type: "editor",
              title: "Ajoute un titre principal",
              instruction: "Dans le corps de la page, ajoute un titre <h1> avec le texte 'Bienvenue sur Codingo'.",
              code: "<body>\n  <!-- Écris ton titre ici -->\n</body>",
              correctAnswer: "<body>\n  <h1>Bienvenue sur Codingo</h1>\n</body>",
            },
          ],
        },
        {
          id: "html-l-1-3",
          unitId: "html-unit-1",
          chapterId: "html-ch-1",
          title: "Titres et Paragraphes",
          order: 3,
          type: "lesson",
          xpReward: 15,
          exercises: [
            {
              id: "ex-1-3-1",
              type: "explanation",
              title: "La hiérarchie des titres",
              instruction: "Comprends l'importance des niveaux de titres de <h1> à <h6>.",
              content: `
Le HTML propose 6 niveaux de titres :
- \`<h1>\` : Le titre le plus important (titre principal unique de la page).
- \`<h2>\` : Les sections principales.
- \`<h3>\` : Les sous-sections.
- Jusqu'à \`<h6>\` pour les détails plus fins.
              `,
            },
            {
              id: "ex-1-3-2",
              type: "qcm",
              title: "Le plus grand titre",
              instruction: "Quelle balise représente le titre principal le plus important ?",
              options: ["<h6>", "<head>", "<h1>", "<header>"],
              correctAnswer: "<h1>",
              explanation: "<h1> correspond au niveau de titre le plus élevé.",
            },
            {
              id: "ex-1-3-3",
              type: "fill_blanks",
              title: "Hiérarchie",
              instruction: "Complète la phrase sur les titres.",
              content: "Pour un sous-titre de section sous un h1, on utilise la balise [h2] et pour un paragraphe la balise [p].",
              correctAnswer: ["h2", "p"],
            },
            {
              id: "ex-1-3-4",
              type: "editor",
              title: "Article de présentation",
              instruction: "Crée un sous-titre <h2> avec 'Mon Parcours' suivi d'un paragraphe <p> avec 'J'apprends le code avec Codingo !'.",
              code: "",
              correctAnswer: "<h2>Mon Parcours</h2>\n<p>J'apprends le code avec Codingo !</p>",
            },
          ],
        },
      ],
    },
    {
      id: "html-ch-2",
      unitId: "html-unit-1",
      title: "Liens et Médias",
      order: 2,
      lessons: [
        {
          id: "html-l-1-4",
          unitId: "html-unit-1",
          chapterId: "html-ch-2",
          title: "Les Liens Hypertextes",
          order: 4,
          type: "lesson",
          xpReward: 15,
          exercises: [
            {
              id: "ex-1-4-1",
              type: "explanation",
              title: "La magie des liens <a>",
              instruction: "Apprends à connecter les pages entre elles.",
              content: `
La balise \`<a>\` (pour Anchor) permet de créer un lien cliquable.
Elle utilise l'attribut **href** (Hypertext Reference) qui indique la destination :

\`\`\`html
<a href="https://codingo.dev">Visiter Codingo</a>
\`\`\`
              `,
            },
            {
              id: "ex-1-4-2",
              type: "qcm",
              title: "L'attribut de destination",
              instruction: "Quel attribut obligatoire de la balise <a> contient l'adresse URL du lien ?",
              options: ["src", "href", "link", "url"],
              correctAnswer: "href",
              explanation: "href désigne l'adresse de destination du lien.",
            },
            {
              id: "ex-1-4-3",
              type: "editor",
              title: "Crée ton premier lien",
              instruction: "Crée un lien vers 'https://codingo.dev' avec le texte 'Découvrir Codingo'.",
              code: "",
              correctAnswer: '<a href="https://codingo.dev">Découvrir Codingo</a>',
            },
          ],
        },
        {
          id: "html-l-1-5",
          unitId: "html-unit-1",
          chapterId: "html-ch-2",
          title: "Insérer des Images",
          order: 5,
          type: "lesson",
          xpReward: 20,
          exercises: [
            {
              id: "ex-1-5-1",
              type: "explanation",
              title: "La balise orpheline <img>",
              instruction: "Observe comment insérer une image sans balise de fermeture.",
              content: `
La balise \`<img>\` est auto-fermante (elle n'a pas de \`</img>\`).
Elle possède deux attributs essentiels :
- **src** (source) : L'adresse de l'image.
- **alt** (texte alternatif) : Description textuelle indispensable pour l'accessibilité et les moteurs de recherche.

\`\`\`html
<img src="robot.png" alt="Mascotte Codie" />
\`\`\`
              `,
            },
            {
              id: "ex-1-5-2",
              type: "true_false",
              title: "Texte alternatif",
              instruction: "L'attribut alt est optionnel et inutile pour les lecteurs d'écran.",
              options: ["Vrai", "Faux"],
              correctAnswer: "Faux",
              explanation: "L'attribut alt est crucial pour l'accessibilité des personnes malvoyantes et le référencement.",
            },
            {
              id: "ex-1-5-3",
              type: "editor",
              title: "Ajoute la mascotte Codie",
              instruction: "Insère une image avec src='codie.png' et alt='Mascotte Codie'.",
              code: "",
              correctAnswer: '<img src="codie.png" alt="Mascotte Codie">',
            },
          ],
        },
      ],
    },
  ],
};
