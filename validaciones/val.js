import { z } from 'zod';

const valz = z.object({
    "titulo": z.string({
        required_error: "La tarea debe tener un titulo"
    }).trim().min(5, { message: "Debe de utilizar al menos 5 caracteres."}),
    "descripcion": z.string().trim().min(20, { message: "La descripcion debe tener al menos 20 caracteres."}),
    "completada": z.boolean({invalid_type_error: "Solo acepta valores booleanos"}),
})

export const validar = (modelo) => { 
    return valz.safeParse(modelo)
}