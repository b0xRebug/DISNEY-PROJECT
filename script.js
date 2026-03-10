/**
 * SCRIPT.JS — Vanilla JavaScript pour Disney+
 * =============================================
 * Fonctionnalités :
 *   1. Accordéon FAQ (ouverture/fermeture avec transition)
 *   2. Navigation clavier dans la FAQ (accessibilité)
 *   3. Header qui s'assombrit au scroll
 *   4. Animation d'apparition au scroll (Intersection Observer)
 */

// On attend que tout le HTML soit chargé avant d'exécuter le script.
// Sans ça, les éléments du DOM n'existent pas encore quand le JS s'exécute.
document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================
     1. ACCORDÉON FAQ
     Principe :
     - On sélectionne tous les boutons .faq__question
     - Au clic, on ferme tous les items, puis on ouvre celui cliqué
     - La classe CSS "is-open" sur .faq__item déclenche les styles ouverts
     ========================================================== */

  // querySelectorAll renvoie une NodeList de tous les boutons de question
  const faqBtns = document.querySelectorAll('.faq__question');

  faqBtns.forEach(function (btn, index) {

    // On écoute le clic sur chaque bouton
    btn.addEventListener('click', function () {

      // closest() remonte l'arbre DOM pour trouver l'ancêtre .faq__item
      const item = this.closest('.faq__item');

      // On mémorise si cet item est DÉJÀ ouvert, avant de tout fermer
      const wasOpen = item.classList.contains('is-open');

      // ---- Fermer tous les items ----
      fermerTout();

      // ---- Ouvrir cet item s'il était fermé ----
      // (S'il était déjà ouvert, fermerTout() l'a fermé → comportement toggle)
      if (!wasOpen) {
        ouvrir(item, this);
      }
    });

    // ---- Navigation clavier (accessibilité ARIA) ----
    // Permet d'utiliser les touches ↑ ↓ Home End pour naviguer entre questions
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault(); // Empêche le défilement de la page
        if (faqBtns[index + 1]) faqBtns[index + 1].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (faqBtns[index - 1]) faqBtns[index - 1].focus();
      }
      if (e.key === 'Home') { e.preventDefault(); faqBtns[0].focus(); }
      if (e.key === 'End')  { e.preventDefault(); faqBtns[faqBtns.length - 1].focus(); }
    });
  });

  /**
   * Ferme tous les items FAQ
   */
  function fermerTout() {
    document.querySelectorAll('.faq__item').forEach(function (item) {
      item.classList.remove('is-open');
      // aria-expanded="false" indique aux lecteurs d'écran que la réponse est cachée
      const btn  = item.querySelector('.faq__question');
      const icon = item.querySelector('.faq__icon');
      if (btn)  btn.setAttribute('aria-expanded', 'false');
      if (icon) icon.textContent = '+';
    });
  }

  /**
   * Ouvre un item FAQ spécifique
   * @param {HTMLElement} item - Le .faq__item à ouvrir
   * @param {HTMLElement} btn  - Le bouton .faq__question correspondant
   */
  function ouvrir(item, btn) {
    item.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true'); // Accessible pour les lecteurs d'écran
    const icon = btn.querySelector('.faq__icon');
    if (icon) icon.textContent = '−'; // Change l'icône de "+" à "−"
  }


  /* ==========================================================
     2. HEADER : assombrissement au scroll
     On ajoute la classe "is-scrolled" au header dès que
     l'utilisateur a défilé de plus de 50px.
     ========================================================== */

  const header = document.querySelector('.header');

  if (header) {
    // "passive: true" améliore les performances car on ne bloque pas le défilement
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 50);
    }, { passive: true });
  }


  /* ==========================================================
     3. ANIMATIONS AU SCROLL (Intersection Observer API)
     Les éléments apparaissent progressivement quand ils entrent
     dans la fenêtre visible (viewport).

     Intersection Observer est plus performant qu'un event listener
     sur "scroll" car il ne se déclenche qu'aux changements de visibilité.
     ========================================================== */

  // Éléments à animer
  const elementsAnimables = document.querySelectorAll(
    '.benefit-card, .device-category, .faq__item'
  );

  // Configuration : se déclenche quand 10% de l'élément est visible
  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // L'élément entre dans le viewport → on le rend visible
        entry.target.classList.add('anim-visible');
        // On arrête d'observer pour ne pas refaire l'animation
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // On prépare chaque élément (état initial invisible) et on l'observe
  elementsAnimables.forEach(function (el) {
    el.classList.add('anim-hidden');
    observer.observe(el);
  });

  // Styles d'animation injectés dynamiquement en JavaScript
  // (ainsi, si JS est désactivé, les éléments restent visibles normalement)
  const style = document.createElement('style');
  style.textContent = `
    /* État de départ : élément invisible, légèrement décalé vers le bas */
    .anim-hidden {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }
    /* État final : élément visible, en place */
    .anim-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);


  /* ==========================================================
     4. LOG DE CONFIRMATION (à supprimer en production)
     Permet de vérifier que le script s'est bien chargé.
     ========================================================== */
  console.log('%c✅ Disney+ — Script chargé', 'color:#0dcff5;font-weight:bold;');

}); // fin DOMContentLoaded
