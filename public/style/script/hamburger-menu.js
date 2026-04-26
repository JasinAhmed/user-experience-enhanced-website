/* Ik geef aan dat JavaScript actief is */
document.documentElement.classList.add('js');

/* Ik pak de hamburger en het menu */
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('hoofd-menu');

/* Ik controleer eerst of de hamburger en het menu bestaan */
if (hamburger && menu) {
  hamburger.addEventListener('click', () => {
    /* Ik open en sluit hier het mobiele menu */
    menu.classList.toggle('open');

    /* Ik verander hier het icoon van de knop */
    hamburger.textContent = menu.classList.contains('open') ? '✕' : '☰';
  });
}