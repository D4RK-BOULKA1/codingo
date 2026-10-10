import { Unit } from "@/types/course";

export const htmlUnit2: Unit = {
  id: "html-unit-2",
  languageId: "html",
  title: "Listes, Formulaires & Interactions",
  description: "Crée des listes organisées et des formulaires pour interagir avec tes visiteurs.",
  order: 2,
  color: "#189C63",
  guideMarkdown: `
# Listes et Formulaires en HTML
Dans cette unité, tu apprends à structurer des éléments répétés (listes) et à récolter des informations grâce aux formulaires interactifs.

### Balises indispensables :
- \`<ul>\` : Liste non ordonnée (à puces).
- \`<ol>\` : Liste ordonnée (numérotée 1, 2, 3...).
- \`<li>\` : Élément individuel d'une liste (List Item).
- \`<form>\` : Conteneur de formulaire.
- \`<input>\` : Champ de saisie (texte, mot de passe, email...).
- \`<button>\` : Bouton d'action ou de soumission.
  `,
  chapters: [
    {
      id: "html-ch-3",
      unitId: "html-unit-2",
      title: "Listes & Éléments",
      order: 1,
      lessons: [
        {
          id: "html-l-2-1",
          unitId: "html-unit-2",
          chapterId: "html-ch-3",
          title: "Listes ordonnées et à puces",
          order: 1,
          type: "lesson",
          xpReward: 15,
          exercises: [
            {
              id: "ex-2-1-1",
              type: "explanation",
              title: "Les deux types de listes",
              instruction: "Distingue les listes à puces des listes numérotées.",
              content: `
Pour afficher une série d'éléments :
- **<ul>** (Unordered List) : Affiche des puces circulaires.
- **<ol>** (Ordered List) : Numérote automatiquement (1, 2, 3...).
- Chaque ligne doit être enfermée dans une balise **<li>** (List Item).

\`\`\`html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
\`\`\`
              `,
            },
            {
              id: "ex-2-1-2",
              type: "qcm",
              title: "Balise d'un élément",
              instruction: "Quelle balise contient chaque élément à l'intérieur d'une liste ?",
              options: ["<item>", "<list>", "<li>", "<ul>"],
              correctAnswer: "<li>",
              explanation: "<li> (List Item) définit un élément individuel de la liste.",
            },
            {
              id: "ex-2-1-3",
              type: "editor",
              title: "Crée ta liste de langages",
              instruction: "Crée une liste à puces <ul> contenant deux éléments <li> : 'HTML' et 'CSS'.",
              code: "",
              correctAnswer: "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>",
            },
          ],
        },
        {
          id: "html-l-2-2",
          unitId: "html-unit-2",
          chapterId: "html-ch-3",
          title: "Boutons et Actions",
          order: 2,
          type: "lesson",
          xpReward: 15,
          exercises: [
            {
              id: "ex-2-2-1",
              type: "explanation",
              title: "La balise <button>",
              instruction: "Rends ta page interactive avec des boutons cliquables.",
              content: `
La balise \`<button>\` crée un bouton cliquable natif.
Elle peut contenir du texte ou même des icônes.

\`\`\`html
<button type="button">Cliquer ici</button>
\`\`\`
              `,
            },
            {
              id: "ex-2-2-2",
              type: "true_false",
              title: "Boutons natifs",
              instruction: "La balise <button> est la balise sémantique standard pour déclencher une action utilisateur.",
              options: ["Vrai", "Faux"],
              correctAnswer: "Vrai",
              explanation: "Exact ! Utiliser <button> assure accessibilité et comportement clavier natif.",
            },
            {
              id: "ex-2-2-3",
              type: "editor",
              title: "Bouton d'inscription",
              instruction: "Crée un bouton avec le texte 'Rejoindre Codingo'.",
              code: "",
              correctAnswer: "<button>Rejoindre Codingo</button>",
            },
          ],
        },
      ],
    },
    {
      id: "html-ch-4",
      unitId: "html-unit-2",
      title: "Formulaires Interactifs",
      order: 2,
      lessons: [
        {
          id: "html-l-2-3",
          unitId: "html-unit-2",
          chapterId: "html-ch-4",
          title: "Champs de saisie (Inputs)",
          order: 3,
          type: "lesson",
          xpReward: 20,
          exercises: [
            {
              id: "ex-2-3-1",
              type: "explanation",
              title: "L'univers des <input>",
              instruction: "Découvre comment collecter des données utilisateur.",
              content: `
La balise \`<input>\` s'adapte selon son attribut **type** :
- \`type="text"\` : Texte libre (nom, pseudo).
- \`type="email"\` : Adresse email avec vérification automatique.
- \`type="password"\` : Masque les caractères saisis.

L'attribut **placeholder** affiche un texte d'aide temporaire !
              `,
            },
            {
              id: "ex-2-3-2",
              type: "fill_blanks",
              title: "Types d'entrées",
              instruction: "Complète les attributs des inputs.",
              content: "Pour un mot de passe masqué on utilise type=[password] et pour un champ texte libre type=[text].",
              correctAnswer: ["password", "text"],
            },
            {
              id: "ex-2-3-3",
              type: "editor",
              title: "Champ email avec placeholder",
              instruction: "Crée un champ input de type email avec le placeholder 'ton@email.com'.",
              code: "",
              correctAnswer: '<input type="email" placeholder="ton@email.com">',
            },
          ],
        },
        {
          id: "html-l-2-4",
          unitId: "html-unit-2",
          chapterId: "html-ch-4",
          title: "Mini-Projet : Carte Profil",
          order: 4,
          type: "project",
          xpReward: 30,
          exercises: [
            {
              id: "ex-2-4-1",
              type: "explanation",
              title: "Défi Récapitulatif",
              instruction: "Combine tout ce que tu as appris pour concevoir une vraie carte de profil.",
              content: `
Tu vas créer une structure HTML complète avec :
1. Un titre principal \`<h1>Alex Dev\`
2. Un paragraphe \`<p>Passionné par le web et l'IA\`
3. Un bouton \`<button>Me contacter\`
              `,
            },
            {
              id: "ex-2-4-2",
              type: "editor",
              title: "Construis la carte",
              instruction: "Rédige le code de la carte avec <h1>Alex Dev</h1>, <p>Passionné de code</p> et <button>Suivre</button>.",
              code: "",
              correctAnswer: "<h1>Alex Dev</h1>\n<p>Passionné de code</p>\n<button>Suivre</button>",
            },
          ],
        },
      ],
    },
  ],
};
