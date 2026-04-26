/* Ik maak mijn eigen simpele confetti functie */
export function startConfetti() {
  for (let i = 0; i < 30; i++) {
    const confettiStukje = document.createElement('span');

    /* Ik geef elk stukje de confetti class */
    confettiStukje.classList.add('confetti');

    /* Ik zet elk stukje op een willekeurige plek bovenaan het scherm */
    confettiStukje.style.left = Math.random() * 100 + 'vw';

    /* Ik geef elk stukje een kleine random vertraging */
    confettiStukje.style.animationDelay = Math.random() * 0.5 + 's';

    /* Ik voeg de confetti toe aan de pagina */
    document.body.appendChild(confettiStukje);

    /* Ik verwijder de confetti weer na 3 seconden */
    setTimeout(() => {
      confettiStukje.remove();
    }, 3000);
  }
}