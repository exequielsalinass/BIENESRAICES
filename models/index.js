import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Usuario from "./Usuario.js";
import Categoria from "./Categoria.js";

Propiedad.belongsTo(Precio)
Propiedad.belongsTo(Categoria)
Propiedad.belongsTo(Usuario)

export {
    Propiedad,
    Precio,
    Usuario,
    Categoria,
}