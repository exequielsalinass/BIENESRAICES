import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'

// Crear la App
const app = express()

// Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta Pública
app.use( express.static('public') )

// Routing 
app.use('/auth', usuarioRoutes)

// Puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
})

