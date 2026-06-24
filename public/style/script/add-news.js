// Ik pak mijn nieuws-formulier
const nieuwsForm = document.querySelector('.nieuws-formulier')

// Ik voer deze code alleen uit als het formulier bestaat
if (nieuwsForm) {

  // Ik pak de knop
  const nieuwsKnop = nieuwsForm.querySelector('.nieuws-knop')

  // Ik pak de foutmelding
  const foutMelding = document.querySelector('.error-melding')

  // Als ik submit
  nieuwsForm.addEventListener('submit', async function (event) {

    // Geen pagina refresh
    event.preventDefault()

    // Foutmelding verbergen
    foutMelding.hidden = true

    // Loading state
    nieuwsKnop.disabled = true
    nieuwsKnop.textContent = 'Nieuws plaatsen...'

    // Formuliergegevens ophalen
    const formData = new FormData(nieuwsForm)

    // Request versturen
    const response = await fetch(nieuwsForm.action, {
      method: nieuwsForm.method,
      body: new URLSearchParams(formData)
    })

    // Gelukt
    if (response.ok) {

      nieuwsKnop.textContent = 'Gelukt ✅'

      // Formulier leegmaken
      nieuwsForm.reset()

      setTimeout(function () {
        nieuwsKnop.disabled = false
        nieuwsKnop.textContent = 'Verzenden'
      }, 2000)

    } else {

      // Foutmelding tonen
      foutMelding.hidden = false

      // Knop herstellen
      nieuwsKnop.disabled = false
      nieuwsKnop.textContent = 'Verzenden'
    }
  })
}