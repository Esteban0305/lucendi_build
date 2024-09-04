"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCliente = exports.createCliente = exports.findCliente = exports.showCliente = void 0;
const cliente_schema_1 = require("../schemas/cliente.schema");
function showCliente(req, res) {
    try {
        const id = req.params.id;
        cliente_schema_1.ClienteModel.findById(id).populate({
            path: 'empresa_id'
        })
            .then((cliente) => {
            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'No existe el id ' + id,
                        userMessage: 'No existe cliente con id: ' + id
                    }
                });
            }
            res.status(200).json({
                success: true,
                data: cliente
            });
        })
            .catch((err) => {
            res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: err.message,
                    userMessage: 'Ocurrió un error inesperado'
                },
            });
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
exports.showCliente = showCliente;
function findCliente(req, res) {
    try {
        const query = req.params.query;
        cliente_schema_1.ClienteModel.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } },
                { RFC: { $regex: query, $options: 'i' } },
                { correo: { $regex: query, $options: 'i' } },
            ]
        })
            .populate('empresa_id')
            .then((clientes) => {
            res.status(200).json({
                success: true,
                data: clientes
            });
        })
            .catch((err) => {
            res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: err.message,
                    userMessage: 'Ocurrió un error inesperado'
                },
            });
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            error: {
                code: 500,
                message: e.message,
                userMessage: 'Ocurrió un error inesperado'
            },
        });
    }
}
exports.findCliente = findCliente;
function createCliente(req, res) {
    try {
        const cliente = new cliente_schema_1.ClienteModel(req.body);
        cliente.save()
            .then((clienteN) => {
            res.status(201).json({
                success: true,
                data: clienteN
            });
        })
            .catch(err => {
            res.status(500).json({
                success: false,
                message: err.message
            });
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: e.message,
        });
    }
}
exports.createCliente = createCliente;
// export function existsCliente(req: Request, res: Response, next: NextFunction) {
//   try {
//     const id = parseInt(req.params.id) || -1;
//     Cliente.findById(id)
//       .then( (cliente : Cliente | null) => {
//         if (!cliente) {
//           return res.status(404).json({
//             success: false,
//             message: 'No existe ese cliente'
//           })
//         }
//         next();
//       })
//       .catch( (err) => {
//         res.status(500).json({
//           success: false,
//           message: err.message
//         });
//       })
//   } catch (e : any) {
//     res.status(500).json({
//       success: false,
//       message: e.message,
//     })
//   }
// }
function updateCliente(req, res) {
    try {
        const id = req.params.id;
        cliente_schema_1.ClienteModel.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })
            .then((cliente) => {
            res.status(200).json({
                success: true,
                data: cliente
            });
        })
            .catch(err => {
            res.status(500).json({
                success: false,
                message: err.message
            });
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: e.message,
        });
    }
}
exports.updateCliente = updateCliente;
