import { Unit } from "@/types/course";

export const cssUnit2: Unit = {
  id: "css-unit-2",
  languageId: "css",
  title: "Mise en Page Moderne & Flexbox",
  description: "Maîtrise Flexbox pour aligner, centrer et organiser tes éléments sur tous les écrans.",
  order: 2,
  color: "#4CC2FF",
  guideMarkdown: `
# Flexbox : La Révolution du Layout
Avant Flexbox, centrer un élément en CSS était un cauchemar. Aujourd'hui, avec \`display: flex\`, c'est instantané !

### Propriétés clés du conteneur :
- \`display: flex\` : Active le mode Flexible.
- \`flex-direction: row | column\` : Organise horizontalement ou verticalement.
- \`justify-content\` : Aligne le long de l'axe principal (center, space-between...).
- \`align-items\` : Aligne le long de l'axe transversal (center, stretch...).
- \`gap: 16px\` : Définit l'espace entre chaque enfant.
  `,
  chapters: [
    {
      id: "css-ch-3",
      unitId: "css-unit-2",
      title: "Maîtriser Flexbox",
      order: 1,
      lessons: [
        {
          id: "css-l-2-1",
          unitId: "css-unit-2",
          chapterId: "css-ch-3",
          title: "Le Conteneur Flex",
          order: 1,
          type: "lesson",
          xpReward: 15,
          exercises: [
            {
              id: "ex-css-2-1-1",
              type: "explanation",
              title: "Activer Flexbox",
              instruction: "Apprends à transformer un bloc en conteneur flexible.",
              content: `
Pour activer Flexbox, applique simplement \`display: flex;\` sur le parent.
Tous ses enfants directs s'alignent automatiquement sur une même ligne horizontale !

\`\`\`css
.container {
  display: flex;
  gap: 12px;
}
\`\`\`
              `,
            },
            {
              id: "ex-css-2-1-2",
              type: "qcm",
              title: "Propriété d'activation",
              instruction: "Quelle propriété permet d'activer le modèle Flexible Box ?",
              options: ["display: flex;", "position: flex;", "float: left;", "layout: modern;"],
              correctAnswer: "display: flex;",
              explanation: "display: flex active instantanément le contexte Flexbox.",
            },
            {
              id: "ex-css-2-1-3",
              type: "editor",
              title: "Active Flexbox avec un écart",
              instruction: "Ajoute display: flex; et gap: 16px; sur la classe '.navbar'.",
              code: ".navbar {\n  /* Complète */\n}",
              correctAnswer: ".navbar {\n  display: flex;\n  gap: 16px;\n}",
            },
          ],
        },
        {
          id: "css-l-2-2",
          unitId: "css-unit-2",
          chapterId: "css-ch-3",
          title: "Centrage et Alignement",
          order: 2,
          type: "lesson",
          xpReward: 20,
          exercises: [
            {
              id: "ex-css-2-2-1",
              type: "explanation",
              title: "Le centrage parfait en 3 lignes",
              instruction: "Découvre comment centrer parfaitement n'importe quel élément.",
              content: `
Pour centrer un élément horizontalement ET verticalement au centre de son conteneur :

\`\`\`css
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`
- \`justify-content: center\` : Centre sur l'axe horizontal.
- \`align-items: center\` : Centre sur l'axe vertical.
              `,
            },
            {
              id: "ex-css-2-2-2",
              type: "fill_blanks",
              title: "Alignements Flex",
              instruction: "Complète les propriétés d'alignement.",
              content: "Pour aligner sur l'axe principal on utilise [justify-content] et sur l'axe secondaire [align-items].",
              correctAnswer: ["justify-content", "align-items"],
            },
            {
              id: "ex-css-2-2-3",
              type: "editor",
              title: "Centre le contenu",
              instruction: "Stylise '.hero' avec display: flex; justify-content: center; align-items: center;.",
              code: ".hero {\n  /* Complète */\n}",
              correctAnswer: ".hero {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
            },
          ],
        },
        {
          id: "css-l-2-3",
          unitId: "css-unit-2",
          chapterId: "css-ch-3",
          title: "Mini-Projet : Carte Responsive",
          order: 3,
          type: "project",
          xpReward: 30,
          exercises: [
            {
              id: "ex-css-2-3-1",
              type: "explanation",
              title: "La Carte Produit Moderne",
              instruction: "Conçois une carte produit complète et soignée.",
              content: `
Ce mini-projet rassemble tout :
- Flexbox pour organiser les éléments en colonne
- Fond blanc et bordure soignée
- Ombre douce et boutons centrés
              `,
            },
            {
              id: "ex-css-2-3-2",
              type: "editor",
              title: "Code la carte complète",
              instruction: "Stylise '.product-card' avec display: flex; flex-direction: column; gap: 12px; padding: 20px; border-radius: 16px;.",
              code: ".product-card {\n  /* Complète */\n}",
              correctAnswer: ".product-card {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 20px;\n  border-radius: 16px;\n}",
            },
          ],
        },
      ],
    },
  ],
};
