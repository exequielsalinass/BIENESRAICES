import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

// Crear la App
const app = express()

// Habilitar lectura de datos de formularios
app.use( express.urlencoded({extended: true}) )

// Conexion a la db
try {
    await db.authenticate()
    db.sync()
    console.log('Conexión Correcta a la Base de Datos')
} catch (error) {
    console.log(error)
}

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

