const routes = module.exports = require('next-routes')()

//:slug, es el nombre normalizado de la web

//1param: nombre ruta, 2para: parametros url, 3para: que pagina apunta la url
//.add('channel', '/:slug.:id', 'channel')
routes
.add('home', '/', 'index')
.add('channel', '/:slug.:id', 'channel')
.add('podcast', '/:slugChannel.:idChannel/:slug.:id', 'podcast')