import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Usuario from "./Usuario.js";
import Categoria from "./Categoria.js";
import Mensaje from "./Mensaje.js";

Propiedad.belongsTo(Precio);
Propiedad.belongsTo(Categoria);
Propiedad.belongsTo(Usuario);
Propiedad.hasMany(Mensaje);

Mensaje.belongsTo(Propiedad);
Mensaje.belongsTo(Usuario);

export { Mensaje, Precio, Usuario, Categoria, Propiedad };
