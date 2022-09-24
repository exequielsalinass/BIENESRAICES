import jwt from "jsonwebtoken"
import { } from '../models/Usuario.js'

const protegerRuta = async (req,res,next) => {

    //Verificar si hay un token
    let { _token } = req.cookies;

    if(!_token){
        return res.redirect("/auth/login")
    }
    //Comprobar token
    try {
        
        const decodificar = jwt.verify(_token , process.env.JWT_SECRET)

        const usuario = await Usuario.scope("eliminarPassword").findByPk(decodificar.id) // el .scope esta agregado en el modelo de usaurio para no mostrar info donde no es requerida

        //Almacenar el usuario al req
        if(usuario){
            req.usuario = usuario
        } else {
            return res.redirect("/auth/login")
        }
        
        return next()

    } catch (error) {
        return res.clearCookie("_token").redirect("/auth/login")
    }
}

export default protegerRuta