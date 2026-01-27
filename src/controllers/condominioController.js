import { pool } from "../db.js";

// ESTA ES LA QUE USA TU PANTALLA AddContom
export const registrarCondominio = async (req, res) => {
    const { nombre, estado, ciudad, direccion, unidades, correo } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO condominios (
                nombre, estado, ciudad, direccion, 
                correo_administrador, correo_contacto, cantidad_unidades
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [nombre, estado, ciudad, direccion, correo, correo, unidades.length]
        );

        const condoId = result.rows[0].id;

        for (let u of unidades) {
            const nombreUnidad = `T:${u.torre || ''} P:${u.piso || ''} A:${u.apto || ''}`;
            await pool.query(
                "INSERT INTO unidades (condominio_id, nombre_unidad) VALUES ($1, $2)",
                [condoId, nombreUnidad]
            );
        }

        res.status(201).json({ message: "¡Propiedad registrada exitosamente!", id: condoId });
    } catch (error) {
        console.error("DETALLE DEL ERROR:", error);
        res.status(500).json({ message: "Error al guardar", error: error.message });
    }
};

// ESTA ES LA QUE USA TU PANTALLA SignUp (El Picker)
export const getCondominios = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre, estado, ciudad FROM condominios ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener la lista de condominios" });
    }
};

export const getCondominiosPorAdmin = async (req, res) => {
    // Extraemos el correo del administrador de los parámetros de consulta (?admin=...)
    const { admin } = req.query;

    try {
        let query = 'SELECT id, nombre, estado, ciudad FROM condominios';
        let params = [];

        // Si viene un correo, filtramos la búsqueda
        if (admin) {
            query += ' WHERE correo_administrador = $1';
            params.push(admin);
        }

        query += ' ORDER BY nombre ASC';
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al filtrar condominios:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};