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

/* Ik voer alles alleen uit als het formulier bestaat */
if (reactieFormulier) {
  const naamInput = document.getElementById('naam');
  const berichtInput = document.getElementById('bericht');
  const naamFout = document.getElementById('naam-fout');
  const berichtFout = document.getElementById('bericht-fout');

  /* Ik pak de knop in mijn formulier */
  const reactieKnop = reactieFormulier.querySelector('.reactie-knop');

  /* Ik pak de lijst waar alle reacties in staan */
  const reactiesLijst = document.querySelector('.reacties-lijst');

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

  /* Ik haal de fout direct weg zodra er iets wordt ingevuld */
  naamInput.addEventListener('input', controleerNaam);
  berichtInput.addEventListener('input', controleerBericht);

  /* Als ik mijn formulier verstuur */
  reactieFormulier.addEventListener('submit', async function (event) {
    /* Ik voorkom dat mijn pagina opnieuw laadt */
    event.preventDefault();

    /* Ik controleer eerst of alles goed is ingevuld */
    const naamIsGoed = controleerNaam();
    const berichtIsGoed = controleerBericht();

    /* Ik stop als één van de velden niet goed is ingevuld */
    if (!naamIsGoed || !berichtIsGoed) {
      return;
    }

    /* Ik laat op de knop zien dat hij bezig is */
    reactieKnop.classList.add('loading');
    reactieKnop.disabled = true;

    /* Ik verzamel alles wat ik in mijn formulier heb ingevuld */
    let formData = new FormData(reactieFormulier);

    /* Ik stuur mijn formulier-data naar de server */
    const response = await fetch(reactieFormulier.action, {
      method: reactieFormulier.method,
      body: new URLSearchParams(formData)
    });

    /* Ik haal de nieuwe HTML op die ik van de server terugkrijg */
    const responseData = await response.text();

    /* Ik maak van die HTML een soort tijdelijke pagina */
    const parser = new DOMParser();
    const responseDOM = parser.parseFromString(responseData, 'text/html');

    /* Ik zoek in die tijdelijke pagina de nieuwe reacties-lijst op */
    const nieuweReactiesLijst = responseDOM.querySelector('.reacties-lijst');

    /* Als de nieuwe lijst bestaat, vervang ik mijn oude lijst */
    if (nieuweReactiesLijst && reactiesLijst) {
      reactiesLijst.innerHTML = nieuweReactiesLijst.innerHTML;
    }

    /* Ik haal de loading state weer van mijn knop af */
    reactieKnop.classList.remove('loading');
    reactieKnop.disabled = false;

    /* Ik maak mijn formulier leeg nadat mijn reactie is geplaatst */
    reactieFormulier.reset();
  });
}