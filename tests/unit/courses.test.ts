import { test } from "node:test";
import assert from "node:assert/strict";
import { getAllCourses, getCourseById, getLessonById } from "../../src/lib/courses/index.js";

test("Structure et intégrité des parcours de cours Codingo", async (t) => {
  await t.test("Tous les cours obligatoires sont présents et disponibles", () => {
    const courses = getAllCourses();
    assert.equal(courses.length, 3, "Doit avoir 3 cours (HTML, CSS, JS)");

    const html = getCourseById("html");
    const css = getCourseById("css");
    const js = getCourseById("javascript");

    assert.ok(html, "Cours HTML manquant");
    assert.ok(css, "Cours CSS manquant");
    assert.ok(js, "Cours JavaScript manquant");

    assert.equal(html?.status, "available");
    assert.equal(css?.status, "available");
    assert.equal(js?.status, "available");
  });

  await t.test("HTML contient au moins 2 unités et plusieurs leçons", () => {
    const html = getCourseById("html");
    assert.ok((html?.units.length ?? 0) >= 2, "HTML doit comporter au moins 2 unités");

    const totalLessons = html!.units.reduce(
      (acc, u) => acc + u.chapters.reduce((a, ch) => a + ch.lessons.length, 0),
      0
    );
    assert.ok(totalLessons >= 7, `HTML doit avoir au moins 7 leçons, reçu ${totalLessons}`);
  });

  await t.test("CSS contient 2 unités avec leçons complètes", () => {
    const css = getCourseById("css");
    assert.ok((css?.units.length ?? 0) >= 2, "CSS doit comporter 2 unités");

    const totalLessons = css!.units.reduce(
      (acc, u) => acc + u.chapters.reduce((a, ch) => a + ch.lessons.length, 0),
      0
    );
    assert.ok(totalLessons >= 6, `CSS doit avoir au moins 6 leçons, reçu ${totalLessons}`);
  });

  await t.test("getLessonById résout correctement chaque leçon", () => {
    const lesson1 = getLessonById("html-l-1-1");
    assert.ok(lesson1, "Leçon html-l-1-1 introuvable");
    assert.equal(lesson1?.lesson.title, "Qu'est-ce que le HTML ?");

    const cssLesson = getLessonById("css-l-1-1");
    assert.ok(cssLesson, "Leçon css-l-1-1 introuvable");
    assert.equal(cssLesson?.lesson.title, "Introduction au CSS");

    const jsLesson = getLessonById("js-l-1-1");
    assert.ok(jsLesson, "Leçon js-l-1-1 introuvable");
    assert.equal(jsLesson?.lesson.title, "Variables et Affichage");
  });
});
