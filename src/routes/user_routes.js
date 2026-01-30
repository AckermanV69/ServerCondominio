import { Router } from "express";
// Importamos todas las funciones desde el controlador
import { 
    usersget, 
    usersgetid, 
    usersdelete, 
    usersput, 
    loginUsuario, 
    signUpUsuario,
    updateUsuarioCondominio,
    registrarCargaComun,
    registrarCargaEspecial,
    actualizarCondominioUsuario,
    registrarCargaEspecialUnidad,
    asignarUnidadPropietario,
    desvincularUnidad,
    getEstadosConCiudades,
    asignarUnidadPorCorreo,
    getUnidadesGlobalesPropietario,
    getUnidadesLibres
} from '../controllers/usercontroller.js';

const router = Router();

router.put("/usuarios/update-condominio", updateUsuarioCondominio);
router.post("/pagos/carga-comun", registrarCargaComun);
router.post("/pagos/carga-especial", registrarCargaEspecial);
router.post("/signup", signUpUsuario);
router.post("/pagos/carga-especial-unidad", registrarCargaEspecialUnidad);
router.post("/unidades/asignar", asignarUnidadPropietario);
router.post("/unidades/desvincular", desvincularUnidad);
router.get("/unidades/usuario-completo/:correo", getUnidadesGlobalesPropietario);
router.get("/unidades/libres/:condominio_id", getUnidadesLibres);
router.get("/geografia/estados", getEstadosConCiudades);
router.put("/unidades/asignar-por-correo", asignarUnidadPorCorreo);
router.put("/usuarios/update-unidad", actualizarCondominioUsuario);

// Rutas de Gestión de Usuarios
router.get("/users", usersget);           // Obtener todos
router.get("/users/:id", usersgetid);     // Obtener uno
router.delete("/users/:id", usersdelete); // Eliminar
router.put("/users/:id", usersput);       // Actualizar

// Rutas de Autenticación (Las que usa tu App Móvil)
router.post("/login", loginUsuario);      // Iniciar sesión
router.post("/signup", signUpUsuario);    // Registrarse

export default router;
