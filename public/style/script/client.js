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

/* Ik pak hier het reactieformulier op */
const reactieFormulier = document.querySelector('.reactie-formulier');

/* Ik voer de validatie alleen uit als het formulier bestaat */
if (reactieFormulier) {
  const naamInput = document.getElementById('naam');
  const berichtInput = document.getElementById('bericht');
  const naamFout = document.getElementById('naam-fout');
  const berichtFout = document.getElementById('bericht-fout');

  /* Ik maak een functie die een fout laat zien */
  function toonFout(veld, foutmelding) {
    veld.classList.add('heeft-fout');
    foutmelding.classList.add('zichtbaar');
  }

  /* Ik maak een functie die de fout weer weghaalt */
  function verwijderFout(veld, foutmelding) {
    veld.classList.remove('heeft-fout');
    foutmelding.classList.remove('zichtbaar');
  }

  /* Ik controleer of de naam leeg is */
  function controleerNaam() {
    if (naamInput.value.trim() === '') {
      toonFout(naamInput, naamFout);
      return false;
    }

    verwijderFout(naamInput, naamFout);
    return true;
  }

  /* Ik controleer of het bericht leeg is */
  function controleerBericht() {
    if (berichtInput.value.trim() === '') {
      toonFout(berichtInput, berichtFout);
      return false;
    }

    verwijderFout(berichtInput, berichtFout);
    return true;
  }

  /* Ik voorkom submit als één van de velden leeg is */
  reactieFormulier.addEventListener('submit', function (event) {
    const naamIsGoed = controleerNaam();
    const berichtIsGoed = controleerBericht();

    if (!naamIsGoed || !berichtIsGoed) {
      event.preventDefault();
    }
  });

  /* Ik haal de fout direct weg zodra er iets wordt ingevuld */
  naamInput.addEventListener('input', controleerNaam);
  berichtInput.addEventListener('input', controleerBericht);
}