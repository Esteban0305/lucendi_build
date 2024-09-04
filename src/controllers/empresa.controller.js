"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmpresa = exports.createEmpresa = exports.findEmpresa = exports.showEmpresa = void 0;
const empresa_schema_1 = require("../schemas/empresa.schema");
function showEmpresa(req, res) {
    const id = req.params.id;
    empresa_schema_1.EmpresaModel.findById(id)
        .then((result) => {
        if (!result) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 500,
                    message: 'ID no definido',
                    userMessage: 'No existe empresa con el id: ' + id
                },
            });
        }
        res.status(200).json({
            success: true,
            code: 200,
            data: result
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
exports.showEmpresa = showEmpresa;
function findEmpresa(req, res) {
    try {
        const query = req.params.query;
        empresa_schema_1.EmpresaModel.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } },
                { correo: { $regex: query, $options: 'i' } },
                { RFC: { $regex: query, $options: 'i' } }
            ]
        })
            .then((results) => {
            res.status(200).json({
                success: true,
                data: results
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
exports.findEmpresa = findEmpresa;
function createEmpresa(req, res) {
    try {
        const nEmpresa = new empresa_schema_1.EmpresaModel(req.body);
        nEmpresa.save()
            .then((empresa) => {
            res.status(201).json({
                success: true,
                data: empresa
            });
        })
            .catch((err) => {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.toString(),
        });
    }
}
exports.createEmpresa = createEmpresa;
// export function existsEmpresa(req: Request, res: Response, next: NextFunction) {
//   try {
//     const id = parseInt(req.params.id) || -1;
//
//     Empresa.findById(id)
//       .then( (result: Empresa | null) => {
//         if (!result) {
//           return res.status(404).json({
//             success: false,
//             message: 'No existe esa empresa'
//           });
//         }
//
//         next();
//       })
//       .catch( (err: Error) => {
//         res.status(500).json({
//           success: false,
//           message: err.message,
//         });
//       });
//   } catch (err: any) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     })
//   }
// }
function updateEmpresa(req, res) {
    try {
        const id = req.params.id;
        empresa_schema_1.EmpresaModel.findByIdAndUpdate(id, Object.assign({}, req.body), { returnDocument: 'after' })
            .then((empresa) => {
            if (!empresa) {
                return res.status(404).json({
                    success: false,
                    message: 'La empresa con id: ' + id + ' no existe'
                });
            }
            res.status(200).json({
                success: true,
                data: empresa
            });
        })
            .catch(err => {
            res.status(500).json({
                success: false,
                message: err.message
            });
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}
exports.updateEmpresa = updateEmpresa;
