import jwt from "jsonwebtoken"

const generarJWT = ({id,nombre}) => {
    return jwt.sign({id,nombre}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

const generarId = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring() + Date.now().toString(32)
}

export { 
    generarId,
    generarJWT
}