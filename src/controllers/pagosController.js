import { pool } from "../db.js";

export const registrarPago = async (req, res) => {
    const { telefono, referencias, cedula, monto, fecha, correo, banco } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO pagos (usuario_email, telefono, referencia, cedula, monto, fecha_pago, banco) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [correo, telefono, referencias, cedula, monto, fecha, banco]
        );

        res.status(201).json({
            message: "Pago registrado exitosamente",
            pago: result.rows[0]
        });
    } catch (error) {
        console.error("Error al registrar pago:", error);
        
        // Manejo de referencia duplicada
        if (error.code === '23505') {
            return res.status(400).json({ message: "Este número de referencia ya fue registrado anteriormente." });
        }

        res.status(500).json({ message: "Error interno al procesar el pago" });
    }
};

// CARGA COMÚN: Para todos los del edificio
export const generarCargaComun = async (req, res) => {
    const { nombreCondominio, monto } = req.body;
    try {
        // 1. Buscamos el ID del condominio y todos los usuarios vinculados
        const usuarios = await pool.query(
            `SELECT u.id, u.condominio_id 
             FROM usuarios u 
             JOIN condominios c ON u.condominio_id = c.id 
             WHERE c.nombre = $1`, [nombreCondominio]
        );

        if (usuarios.rows.length === 0) {
            return res.status(404).json({ message: "No hay usuarios en este condominio" });
        }

        // 2. Insertamos la mensualidad para cada uno
        const promesas = usuarios.rows.map(user => {
            return pool.query(
                "INSERT INTO pagos (usuario_id, condominio_id, monto, estado) VALUES ($1, $2, $3, 'pendiente')",
                [user.id, user.condominio_id, monto]
            );
        });

        await Promise.all(promesas);
        res.status(201).json({ message: `Carga generada para ${usuarios.rows.length} propietarios.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const generarCargaMasiva = async (req, res) => {
    const { condominio, monto, descripcion, tipo } = req.body;

    try {
        // 1. Buscamos a todos los usuarios vinculados a ese condominio
        const usuarios = await pool.query(
            `SELECT u.id, u.condominio_id 
             FROM usuarios u 
             JOIN condominios c ON u.condominio_id = c.id 
             WHERE c.nombre = $1`, 
            [condominio]
        );

        if (usuarios.rows.length === 0) {
            return res.status(404).json({ message: "No hay propietarios registrados en este edificio." });
        }

        const condominioId = usuarios.rows[0].condominio_id;

        // 2. Insertamos el pago para cada usuario encontrado
        // Usamos una promesa múltiple para mayor velocidad
        const promesas = usuarios.rows.map(user => {
            return pool.query(
                `INSERT INTO pagos (usuario_id, condominio_id, monto, descripcion, tipo_pago, estado) 
                 VALUES ($1, $2, $3, $4, $5, 'pendiente')`,
                [user.id, condominioId, monto, descripcion, tipo]
            );
        });

        await Promise.all(promesas);

        res.status(201).json({ 
            message: `Carga de tipo ${tipo} realizada a ${usuarios.rows.length} usuarios.` 
        });

    } catch (error) {
        console.error("Error en carga masiva:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const generarCargaEspecial = async (req, res) => {
    const { correo, monto, descripcion, tipo } = req.body;

    try {
        // 1. Buscamos los datos del usuario por su correo
        const usuarioQuery = await pool.query(
            "SELECT id, condominio_id FROM usuarios WHERE correo = $1",
            [correo]
        );

        if (usuarioQuery.rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const { id, condominio_id } = usuarioQuery.rows[0];

        // 2. Insertamos el registro de pago solo para ese usuario
        await pool.query(
            `INSERT INTO pagos (usuario_id, condominio_id, monto, descripcion, tipo_pago, estado) 
             VALUES ($1, $2, $3, $4, $5, 'pendiente')`,
            [id, condominio_id, monto, descripcion, tipo]
        );

        res.status(201).json({ message: "Carga individual realizada con éxito" });

    } catch (error) {
        console.error("Error en carga especial:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};