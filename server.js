console.log('Hier komt je server voor Sprint 10.')

// console.log('Gebruik uit Sprint 9 alleen de code die je mee wilt nemen.')
// Importeer het npm package Express
import express from 'express'

// Importeer de Liquid package
import { Liquid } from 'liquidjs'

// Maak een nieuwe Express applicatie aan
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({ extended: true }))

// Gebruik de map 'public' voor statische bestanden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
app.set('views', './views')

// Zet Liquid als view engine
app.set('view engine', 'liquid')


// Maak een GET route voor de homepagina
app.get('/', async function (request, response) {

  // Haal de nieuwsdata op uit de database
  const apiResponse = await fetch('https://fdnd-agency.directus.app/items/adconnect_news')

  // Zet de opgehaalde data om naar JSON
  const apiResponseJSON = await apiResponse.json()

  // Laat de data zien in de terminal
  console.log(apiResponseJSON)

  // Pak alleen de array met nieuwsitems uit de JSON
  const news = apiResponseJSON.data

  // Render index.liquid en geef news mee
  response.render('index.liquid', { news: news })
})


// ROUTE: FORMULIER OM EEN NIEUWSBERICHT TOE TE VOEGEN
// Deze route toont de pagina met het formulier voor de admin
app.get('/nieuws-toevoegen', async function (request, response) {
  response.render('add-news.liquid', {
    path: request.path
  })
})


// ROUTE: NIEUWSBERICHT TOEVOEGEN
// Deze route ontvangt de data uit het formulier
// Daarna stuurt deze route de data door naar Directus
app.post('/nieuws-toevoegen', async function (request, response) {

  // In request.body zitten alle velden uit het formulier
  // Elk veld moet in HTML een name="" attribuut hebben
  const title = request.body.title
  const description = request.body.description
  const body = request.body.body
  const author = request.body.author
  const date = request.body.date
  const status = request.body.status

  // Met fetch sturen we een POST request naar Directus
  // Hiermee maken we een nieuw item aan in de collectie adconnect_news
  const fetchResponse = await fetch('https://fdnd-agency.directus.app/items/adconnect_news', {
    method: 'POST',

    // Hier zetten we de formulierdata om naar JSON
    body: JSON.stringify({
      title: title,
      description: description,
      body: body,
      author: author,
      date: date,
      status: status
    }),

    // Hiermee vertellen we Directus dat we JSON sturen
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  // Check of het opslaan in Directus gelukt is
  // Als het niet lukt, tonen we een foutmelding
  if (!fetchResponse.ok) {
    const error = await fetchResponse.text()
    console.log(error)

    response.status(500).send('Het toevoegen van het nieuwsbericht is niet gelukt')
    return
  }

  // Als het opslaan wel lukt, sturen we alleen een succesvolle response terug
  // De client-side JavaScript toont daarna de succesmelding
  response.status(200).send('Nieuwsbericht succesvol toegevoegd')
})


// ROUTE: LAdO PAGINA
// Ik gebruik deze route om mijn LAdO pagina te tonen
// Hier render ik simpelweg lado.liquid zonder extra data op te halen
app.get('/lado', async function (request, response) {
  response.render('lado.liquid')
})


// ROUTE: GENOMINEERDE STUDENTEN PAGINA
// Deze route toont een overzicht van alle genomineerde studenten
app.get('/genomineerden', async function (request, response) {

  // Haal de genomineerden op uit de database
  const apiResponse = await fetch('https://fdnd-agency.directus.app/items/adconnect_nominations')

  // Zet de opgehaalde data om naar JSON
  const apiResponseJSON = await apiResponse.json()

  // Pak alleen de array met genomineerden
  const nominees = apiResponseJSON.data

  // Render de pagina en geef nominees mee
  response.render('genomineerden.liquid', { nominees: nominees })
})


// ROUTE: DETAILPAGINA VAN EEN GENOMINEERDE
// Deze route toont meer informatie over één specifieke genomineerde
app.get('/genomineerden/:id', async function (request, response) {

  // Haal het id op uit de URL
  const id = request.params.id

  // Haal opnieuw alle genomineerden op uit de database
  const apiResponse = await fetch('https://fdnd-agency.directus.app/items/adconnect_nominations')

  // Zet de opgehaalde data om naar JSON
  const apiResponseJSON = await apiResponse.json()

  // Pak de array met genomineerden
  const nominees = apiResponseJSON.data

  // Zoek de juiste genomineerde op basis van het id
  const nominee = nominees.find(function (item) {
    return item.id == id
  })

  // Haal alle reacties op uit de database
  const reactiesResponse = await fetch('https://fdnd-agency.directus.app/items/adconnect_nominations_comments')

  // Zet de opgehaalde reacties om naar JSON
  const reactiesJSON = await reactiesResponse.json()

  // Pak alleen de reacties van deze genomineerde
  const reacties = reactiesJSON.data.filter(function (item) {
    return item.nomination == id
  })

  // Render de detailpagina en geef de genomineerde en reacties mee
  response.render('genomineerde-detail.liquid', {
    nominee: nominee,
    reacties: reacties
  })
})


// ROUTE: REACTIE PLAATSEN BIJ EEN GENOMINEERDE
// Deze route ontvangt het reactieformulier op de detailpagina
app.post('/genomineerden/:id', async function (request, response) {

  // In request.body zitten alle formuliervelden
  const naam = request.body.naam
  const bericht = request.body.bericht
  const nominee_id = request.params.id

  // Met fetch sturen we de reactie naar Directus
  const fetchResponse = await fetch('https://fdnd-agency.directus.app/items/adconnect_nominations_comments', {
    method: 'POST',
    body: JSON.stringify({
      name: naam,
      comment: bericht,
      nomination: nominee_id
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  // Zet de response om naar JSON
  const fetchResponseJSON = await fetchResponse.json()

  // Redirect terug naar de detailpagina en spring naar de nieuwe reactie
  response.redirect(303, `/genomineerden/${nominee_id}#reactie-${fetchResponseJSON.data.id}`)
})


// ROUTE: REACTIE VERWIJDEREN
// Deze route gebruik ik om een reactie weg te halen
app.post('/reacties/:reactieId/verwijderen', async function (request, response) {

  // Ik haal hier het id van de reactie uit de URL
  const reactieId = request.params.reactieId

  // Ik haal hier het id van de genomineerde uit het formulier
  const nomineeId = request.body.nomineeId

  // Met deze fetch stuur ik een DELETE request naar Directus
  const deleteResponse = await fetch(`https://fdnd-agency.directus.app/items/adconnect_nominations_comments/${reactieId}`, {
    method: 'DELETE'
  })

  // Ik check even of het verwijderen gelukt is
  if (!deleteResponse.ok) {
    response.status(500).send('Het verwijderen van de reactie is niet gelukt')
    return
  }

  // Als het wel gelukt is, stuur ik de gebruiker terug naar de detailpagina
  response.redirect(303, `/genomineerden/${nomineeId}`)
})


// Stel het poortnummer in waar Express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)


// Start Express op
app.listen(app.get('port'), function () {
  console.log(`Daarna kun je via http://localhost:${app.get('port')}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`)
})

// console.log('Zet \'m op!')