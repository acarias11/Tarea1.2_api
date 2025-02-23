import express from 'express'
import modelos from './local_db/modelo.json' with { type: 'json' }
import crypto from 'node:crypto'
import { validar } from './validaciones/val.js'

const server = express()

server.disable('x-powered-by')

server.use(express.json())

server.get('/', (req, res) => {
    res.send('Página principal para la gestión de sus tareas.')
})

server.get('/tareas', (req, res) => {
    const response = {
        success: true,
        data: modelos
    }

    res.json(response)
})

server.get('/tareas/:id', (req, res) => {
    const { id } = req.params

    const mod = modelos.find((mod) => mod.id === id)

    if( !mod ){
        return res.status(204).json({
            success: false,
            data: null
        })
    }

    const response = {
        success: true,
        data: mod ?? null
    }

    res.status(200).send(response)
})

server.post('/tareas', (req, res) => {
    const result = validar(req.body)

    if( !result.success ){
        return res.status(400).json({
            success: false,
            message: result.error.errors.map( error => ({
                message: error.message,
                path: error.path[0]
            }) )
        })
    }

    const UUId = {
        id: crypto.randomUUID(),
        ...result.data, 
        fecha_creacion: new Date().toUTCString()
    }

    modelos.push(UUId)

    res.status(201).json({
        success: true,
        data: UUId
    })
})

server.put('/tareas/:id', (req, res) => {
    const { id } = req.params
    
    const Index = modelos.findIndex((mod) => mod.id === id)
    
    if ( Index == -1 ){
        return res.status(404).json({
            success: false,
            message: "No existe una tarea con el id"
        })
    }

    const result = validar(req.body)

    if( !result.success ){
        return res.status(400).json({
            success: false,
            message: result.error.errors.map(error => ({
                message: error.message,
                path: error.path[0]
            }) )
        })
    }

    const UId = {
        id: modelos[Index].id,
        ...result.data, 
        fecha_creacion: modelos[Index].fecha_creacion
    }

    modelos[Index] = UId

    res.status(200).json({
        success: true,
        data: UId
    })

})

server.delete('/tareas/:id', (req, res) => {
    const { id } = req.params

    const findIndex = modelos.findIndex( (mod) => mod.id === id)

    if(findIndex == -1){
        return res.status(404).json({
            success: false,
            message: "No existe una tarea con ese id"
        })
    }

    modelos.splice(findIndex, 1)

    res.status(202).json({
        success: true,
        message: "Tarea eliminada"
    })

})

server.use((req, res) => {
    res.status(404).send({
        success: false,
        data: "Tarea no encontrada"
    })
})

const port = process.env.port || 3000

server.listen(port, () => {
    console.log(`Servidor escuchado en el puerto http://localhost:${port}`)
})