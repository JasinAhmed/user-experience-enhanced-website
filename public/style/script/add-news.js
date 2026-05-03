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

    // Geen reload
    event.preventDefault()

    // Reset foutmelding
    foutMelding.hidden = true
    foutMelding.classList.remove('zichtbaar')

    // Loading state
    nieuwsKnop.classList.add('loading')
    nieuwsKnop.disabled = true
    nieuwsKnop.textContent = 'Nieuws plaatsen...'

    // Data ophalen
    const formData = new FormData(nieuwsForm)

    try {
      // Versturen
      const response = await fetch(nieuwsForm.action, {
        method: nieuwsForm.method,
        body: new URLSearchParams(formData)
      })

      // Loading uit
      nieuwsKnop.classList.remove('loading')

      // SUCCESS
      if (response.ok) {

        nieuwsKnop.classList.add('success')
        nieuwsKnop.textContent = 'Gelukt ✅'

        // Form reset
        nieuwsForm.reset()

        // Terug naar normaal
        setTimeout(function () {
          nieuwsKnop.classList.remove('success')
          nieuwsKnop.disabled = false
          nieuwsKnop.textContent = 'Verzenden'
        }, 2000)

        return
      }

      // ERROR
      throw new Error('Niet gelukt')

    } catch (error) {

      // Reset knop
      nieuwsKnop.classList.remove('loading')
      nieuwsKnop.disabled = false
      nieuwsKnop.textContent = 'Verzenden'

      // Toon foutmelding
      foutMelding.hidden = false
      foutMelding.classList.add('zichtbaar')
    }
  })
}