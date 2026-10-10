import { Unit } from "@/types/course";

export const cssUnit1: Unit = {
  id: "css-unit-1",
  languageId: "css",
  title: "L'Art du Style & Couleurs",
  description: "Donne vie à tes pages avec les sélecteurs, les couleurs vives et la typographie.",
  order: 1,
  color: "#1B9BE0",
  guideMarkdown: `
# Bienvenue en CSS !
Le CSS (Cascading Style Sheets) transforme le squelette HTML brut en une interface élégante, colorée et vivante.

### Les fondamentaux :
- **Sélecteur** : Cible l'élément HTML à styliser (\`h1\`, \`p\`, \`.bouton\`).
- **Propriété & Valeur** : Définit l'aspect (\`color: #4CC2FF;\`).
- **Box Model** : Tout élément est une boîte entourée de marges, bordures et rembourrages.
  `,
  chapters: [
    {
      id: "css-ch-1",
      unitId: "css-unit-1",
      title: "Les Fondamentaux du CSS",
      order: 1,
      lessons: [
        {
          id: "css-l-1-1",
          unitId: "css-unit-1",
          chapterId: "css-ch-1",
          title: "Introduction au CSS",
          order: 1,
          type: "lesson",
          xpReward: 15,
          exercises: [
            {
              id: "ex-css-1-1-1",
              type: "explanation",
              title: "La syntaxe d'une règle CSS",
              instruction: "Découvre la structure universelle d'une règle CSS.",
              content: `
Une règle CSS se compose d'un **sélecteur** suivi d'un bloc d'accolades :

\`\`\`css
h1 {
  color: #1B9BE0;
  font-size: 32px;
}
\`\`\`
- \`h1\` est le sélecteur.
- \`color\` est la propriété.
- \`#1B9BE0\` est la valeur.
- Chaque déclaration se termine par un point-virgule \`;\` !
              `,
            },
            {
              id: "ex-css-1-1-2",
              type: "qcm",
              title: "Symbole de fin de ligne",
              instruction: "Quel symbole doit obligatoirement terminer chaque propriété CSS ?",
              options: ["; (point-virgule)", ": (deux-points)", ", (virgule)", ". (point)"],
              correctAnswer: "; (point-virgule)",
              explanation: "Le point-virgule ';' sépare et termine chaque déclaration CSS.",
            },
            {
              id: "ex-css-1-1-3",
              type: "editor",
              title: "Colore les paragraphes",
              instruction: "Écris la règle CSS pour colorer tous les paragraphes <p> en bleu (#1B9BE0).",
              code: "",
              correctAnswer: "p {\n  color: #1B9BE0;\n}",
            },
          ],
        },
        {
          id: "css-l-1-2",
          unitId: "css-unit-1",
          chapterId: "css-ch-1",
          title: "Couleurs et Arrière-plans",
          order: 2,
          type: "lesson",
          xpReward: 15,
          exercises: [
            {
              id: "ex-css-1-2-1",
              type: "explanation",
              title: "Propriétés de couleur",
              instruction: "Apprends à distinguer la couleur du texte du fond.",
              content: `
- **color** : Change la couleur du texte.
- **background-color** : Change la couleur de fond du conteneur ou bouton.

\`\`\`css
button {
  color: #FFFFFF;
  background-color: #4CC2FF;
}
\`\`\`
              `,
            },
            {
              id: "ex-css-1-2-2",
              type: "true_false",
              title: "Fond d'écran",
              instruction: "La propriété 'background-color' permet de définir la couleur de fond d'un élément.",
              options: ["Vrai", "Faux"],
              correctAnswer: "Vrai",
              explanation: "Exact ! background-color applique une couleur unie en arrière-plan.",
            },
            {
              id: "ex-css-1-2-3",
              type: "editor",
              title: "Style ton bouton Codingo",
              instruction: "Stylise la classe '.btn' avec background-color: #4CC2FF; et color: white;.",
              code: ".btn {\n  /* Écris les propriétés */\n}",
              correctAnswer: ".btn {\n  background-color: #4CC2FF;\n  color: white;\n}",
            },
          ],
        },
      ],
    },
    {
      id: "css-ch-2",
      unitId: "css-unit-1",
      title: "Le Modèle de Boîte (Box Model)",
      order: 2,
      lessons: [
        {
          id: "css-l-1-3",
          unitId: "css-unit-1",
          chapterId: "css-ch-2",
          title: "Padding, Margin et Border",
          order: 3,
          type: "lesson",
          xpReward: 20,
          exercises: [
            {
              id: "ex-css-1-3-1",
              type: "explanation",
              title: "Les couches d'un élément",
              instruction: "Visualise le Modèle de Boîte.",
              content: `
Chaque élément HTML est entouré de 3 couches :
1. **padding** (rembourrage interne) : Espace entre le contenu et la bordure.
2. **border** (bordure) : Le trait physique qui délimite la boîte.
3. **margin** (marge externe) : Espace entre la boîte et ses voisins.
              `,
            },
            {
              id: "ex-css-1-3-2",
              type: "fill_blanks",
              title: "Boîte CSS",
              instruction: "Complète les termes du Box Model.",
              content: "L'espace intérieur entre le texte et la bordure est le [padding] et l'espace extérieur est la [margin].",
              correctAnswer: ["padding", "margin"],
            },
            {
              id: "ex-css-1-3-3",
              type: "editor",
              title: "Carte aérée",
              instruction: "Ajoute un padding: 16px; et une border: 2px solid #E2E8F0; à la classe '.card'.",
              code: ".card {\n  /* Propriétés */\n}",
              correctAnswer: ".card {\n  padding: 16px;\n  border: 2px solid #E2E8F0;\n}",
            },
          ],
        },
        {
          id: "css-l-1-4",
          unitId: "css-unit-1",
          chapterId: "css-ch-2",
          title: "Arrondis & Relief 3D",
          order: 4,
          type: "lesson",
          xpReward: 25,
          exercises: [
            {
              id: "ex-css-1-4-1",
              type: "explanation",
              title: "Le style 3D Codingo",
              instruction: "Découvre comment créer l'effet signature de nos boutons 3D.",
              content: `
Pour concevoir un bouton avec du relief physique :
- \`border-radius: 16px;\` arrondit les coins.
- \`box-shadow: 0 4px 0 0 #1B9BE0;\` projette une ombre pleine vers le bas.
- Lors du clic, \`transform: translateY(4px);\` enfonce physiquement le bouton !
              `,
            },
            {
              id: "ex-css-1-4-2",
              type: "editor",
              title: "Crée ton bouton 3D",
              instruction: "Stylise '.btn-3d' avec border-radius: 16px; et box-shadow: 0 4px 0 0 #1B9BE0;.",
              code: ".btn-3d {\n  /* Complète */\n}",
              correctAnswer: ".btn-3d {\n  border-radius: 16px;\n  box-shadow: 0 4px 0 0 #1B9BE0;\n}",
            },
          ],
        },
      ],
    },
  ],
};
