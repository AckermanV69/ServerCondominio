import { Router } from 'express';
import { 
    registrarPago, 
    generarCargaComun, 
    generarCargaEspecial,
    generarCargaMasiva
} from '../controllers/pagosController.js';

const router = Router();

// 1. Registro de pago individual (cuando el dueño paga)
router.post("/registrar", registrarPago);

// 2. CARGA COMÚN Y ACCIDENTES (Debe decir 'carga-comun' para que el celular lo encuentre)
router.post("/carga-comun", generarCargaComun);

// 3. CARGA ESPECIAL (A un solo usuario)
router.post("/carga-especial", generarCargaEspecial);

// 4. CARGA MASIVA (varios usuarios desde un archivo)
router.post("/carga-masiva", generarCargaMasiva);

export default router;