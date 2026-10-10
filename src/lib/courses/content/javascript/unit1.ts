import { Unit } from "@/types/course";

export const jsUnit1: Unit = {
  id: "js-unit-1",
  languageId: "javascript",
  title: "Premiers Pas & DOM Interactif",
  description: "Donne une âme et de l'interactivité à tes pages web grâce à JavaScript.",
  order: 1,
  color: "#FFC83D",
  guideMarkdown: `
# Bienvenue en JavaScript !
JavaScript est le langage de programmation du Web. C'est lui qui réagit aux clics, met à jour le contenu sans recharger la page et rend tout dynamique.

### Notions abordées :
- Les variables : \`let score = 10;\` et \`const nom = "Codie";\`
- Manipuler le HTML avec le DOM : \`document.querySelector('h1')\`
- Écouter les événements : \`element.addEventListener('click', ...)\`
  `,
  chapters: [
    {
      id: "js-ch-1",
      unitId: "js-unit-1",
      title: "Variables & Logique",
      order: 1,
      lessons: [
        {
          id: "js-l-1-1",
          unitId: "js-unit-1",
          chapterId: "js-ch-1",
          title: "Variables et Affichage",
          order: 1,
          type: "lesson",
          xpReward: 15,
          exercises: [
            {
              id: "ex-js-1-1-1",
              type: "explanation",
              title: "Stocker des informations",
              instruction: "Découvre les variables en JavaScript moderne.",
              content: `
Pour enregistrer une valeur en mémoire :
- \`const\` : Pour une valeur qui ne change jamais (constante).
- \`let\` : Pour une variable modifiable (par exemple un score).

\`\`\`javascript
const pseudo = "Alex";
let xp = 50;
xp = xp + 10;
\`\`\`
              `,
            },
            {
              id: "ex-js-1-1-2",
              type: "qcm",
              title: "Constante immuable",
              instruction: "Quel mot-clé déclare une variable dont la valeur ne doit pas être réassignée ?",
              options: ["const", "let", "var", "static"],
              correctAnswer: "const",
              explanation: "const définit une constante qui protège la valeur contre toute réassignation accidentelle.",
            },
            {
              id: "ex-js-1-1-3",
              type: "editor",
              title: "Déclare ta variable",
              instruction: "Déclare une variable constante nommée 'mascotte' égale à 'Codie'.",
              code: "",
              correctAnswer: 'const mascotte = "Codie";',
            },
          ],
        },
        {
          id: "js-l-1-2",
          unitId: "js-unit-1",
          chapterId: "js-ch-1",
          title: "Interagir avec le DOM",
          order: 2,
          type: "lesson",
          xpReward: 20,
          exercises: [
            {
              id: "ex-js-1-2-1",
              type: "explanation",
              title: "Le DOM (Document Object Model)",
              instruction: "Découvre comment JavaScript sélectionne et modifie les balises HTML.",
              content: `
Pour cibler un élément HTML depuis JavaScript :
\`\`\`javascript
const titre = document.querySelector('h1');
titre.textContent = "Nouveau titre Codingo !";
\`\`\`
\`document.querySelector\` recherche la balise comme un sélecteur CSS, et \`textContent\` change son texte !
              `,
            },
            {
              id: "ex-js-1-2-2",
              type: "fill_blanks",
              title: "Sélection DOM",
              instruction: "Complète la méthode de sélection.",
              content: "Pour sélectionner un élément dans la page on utilise document.[querySelector] et pour changer son texte on modifie la propriété [textContent].",
              correctAnswer: ["querySelector", "textContent"],
            },
            {
              id: "ex-js-1-2-3",
              type: "editor",
              title: "Modifie le titre",
              instruction: "Sélectionne le titre avec document.querySelector('h1') et affecte 'Bravo !' à son textContent.",
              code: "const titre = document.querySelector('h1');\n// Change son textContent",
              correctAnswer: "const titre = document.querySelector('h1');\ntitre.textContent = 'Bravo !';",
            },
          ],
        },
        {
          id: "js-l-1-3",
          unitId: "js-unit-1",
          chapterId: "js-ch-1",
          title: "Événements Clic",
          order: 3,
          type: "project",
          xpReward: 25,
          exercises: [
            {
              id: "ex-js-1-3-1",
              type: "explanation",
              title: "Écouter les clics de l'utilisateur",
              instruction: "Ajoute un écouteur d'événement sur un bouton.",
              content: `
Pour réagir quand l'utilisateur clique :
\`\`\`javascript
const btn = document.querySelector('button');
btn.addEventListener('click', () => {
  alert('Bouton cliqué !');
});
\`\`\`
              `,
            },
            {
              id: "ex-js-1-3-2",
              type: "editor",
              title: "Crée l'écouteur",
              instruction: "Ajoute un écouteur d'événement 'click' sur 'btn' avec btn.addEventListener('click', () => alert('OK'));.",
              code: "const btn = document.querySelector('button');\n",
              correctAnswer: "const btn = document.querySelector('button');\nbtn.addEventListener('click', () => alert('OK'));",
            },
          ],
        },
      ],
    },
  ],
};
