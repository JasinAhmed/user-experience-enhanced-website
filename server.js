console.log('Hier komt je server voor Sprint 10.')

// console.log('Gebruik uit Sprint 9 alleen de code die je mee wilt nemen.')
// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({ extended: true }))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
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
  // Zie https://expressjs.com/en/5x/api.html#res.render over response.render()
  response.render('index.liquid', { news: news })
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

  // Pak alleen de array met genomineerden uit de JSON
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

  // Render de detailpagina en geef de genomineerde mee
  response.render('genomineerde-detail.liquid', { nominee: nominee, reacties: reacties })
})


// Maak een POST route voor de detailpagina van een genomineerde
// Zie https://expressjs.com/en/5x/api.html#app.post.method over app.post()
app.post('/genomineerden/:id', async function (request, response) {

  // In request.body zitten alle formuliervelden die een `name` attribuut hebben in je HTML

  // Via een fetch() naar Directus vullen we nieuwe gegevens in

  // Zie https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch over fetch()
  // Zie https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify over JSON.stringify()
  // Zie https://docs.directus.io/reference/items.html#create-an-item over het toevoegen van gegevens in Directus
  // Zie https://docs.directus.io/reference/items.html#update-an-item over het veranderen van gegevens in Directus

  const naam = request.body.naam
  const bericht = request.body.bericht
  const nominee_id = request.params.id

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

  // Als de POST niet gelukt is, kun je de response loggen. Sowieso een goede debugging strategie.
  // console.log(fetchResponse)

  // Eventueel kun je de JSON van die response nog debuggen
  const fetchResponseJSON = await fetchResponse.json()
  // console.log(fetchResponseJSON)

  // Redirect de gebruiker daarna naar een logische volgende stap
  // Zie https://expressjs.com/en/5x/api.html#res.redirect over response.redirect()
  response.redirect(303, `/genomineerden/${nominee_id}#reactie-${fetchResponseJSON.data.id}`)
})


// ROUTE: REACTIE VERWIJDEREN
// Deze route gebruik ik om een reactie weg te halen
app.post('/reacties/:reactieId/verwijderen', async function (request, response) {

  // Ik haal hier het id van de reactie uit de URL
  const reactieId = request.params.reactieId

  // Ik haal hier het id van de genomineerde uit het formulier
  // Dit heb ik nodig zodat ik daarna terug kan sturen naar de juiste pagina
  const nomineeId = request.body.nomineeId

  // Met deze fetch stuur ik een DELETE request naar Directus
  // Zo probeer ik precies die ene reactie te verwijderen
  const deleteResponse = await fetch(`https://fdnd-agency.directus.app/items/adconnect_nominations_comments/${reactieId}`, {
    method: 'DELETE'
  })

  // Ik check even of het verwijderen gelukt is
  // Als het niet lukt, laat ik een simpele foutmelding zien
  if (!deleteResponse.ok) {
    response.status(500).send('Het verwijderen van de reactie is niet gelukt')
    return
  }

  // Als het wel gelukt is, stuur ik de gebruiker terug naar de detailpagina
  response.redirect(303, `/genomineerden/${nomineeId}`)
})


// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console
  console.log(`Daarna kun je via http://localhost:${app.get('port')}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`)
})
// console.log('Zet \'m op!')