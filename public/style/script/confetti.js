/* Ik maak een functie aan die een confetti-effect laat zien */
export function startConfetti() {

  /* Met deze for-loop voer ik de code 30 keer uit */
  /* Hierdoor maak ik 30 confettistukjes aan */
  for (let i = 0; i < 30; i++) {

    /* Ik maak een nieuw span-element aan */
    /* Elk span-element wordt één confettistukje */
    const confettiStukje = document.createElement('span');

    /* Ik voeg de class confetti toe */
    /* Hierdoor krijgt het stukje de juiste CSS-stijl en animatie */
    confettiStukje.classList.add('confetti');

    /* Met Math.random() geef ik elk stukje een willekeurige positie */
    /* Hierdoor verschijnen de stukjes verspreid over de breedte van het scherm */
    confettiStukje.style.left = Math.random() * 100 + 'vw';

    /* Met Math.random() geef ik elk stukje een kleine willekeurige vertraging */
    /* Hierdoor vallen niet alle stukjes precies tegelijk */
    confettiStukje.style.animationDelay = Math.random() * 0.5 + 's';

    /* Ik voeg het confettistukje toe aan de body */
    /* Hierdoor wordt het zichtbaar op de pagina */
    document.body.appendChild(confettiStukje);

    /* Met setTimeout wacht ik 3 seconden */
    /* Daarna verwijder ik het confettistukje weer */
    /* Zo blijft de pagina netjes en stapelt de confetti zich niet op */
    setTimeout(() => {
      confettiStukje.remove();
    }, 3000);
  }
}