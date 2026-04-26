/* Ik pak alle links naar de detailpagina */
const detailLinks = document.querySelectorAll('.nominee-link');

/* Ik controleer eerst of View Transitions worden ondersteund */
if ('startViewTransition' in document) {
  detailLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      /* Ik voorkom dat de browser meteen naar de nieuwe pagina gaat */
      event.preventDefault();

      /* Ik start de view transition */
      document.startViewTransition(() => {
        window.location.href = link.href;
      });
    });
  });
}