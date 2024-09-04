"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConcepto = exports.createConcepto = exports.findConcepto = exports.showConcepto = void 0;
const concepto_schema_1 = require("../schemas/concepto.schema");
function showConcepto(req, res) {
    try {
        const id = req.params.id;
        concepto_schema_1.ConceptoModel.findById(id)
            .then((result) => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'No existe ese concepto'
                });
            }
            res.status(200).json({
                success: true,
                data: result
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
exports.showConcepto = showConcepto;
// TODO: Si el query está vacío se traba
function findConcepto(req, res) {
    try {
        const query = req.params.query || '_';
        concepto_schema_1.ConceptoModel.find({
            descripcion: { $regex: query }
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
                message: err.message,
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
exports.findConcepto = findConcepto;
function createConcepto(req, res) {
    try {
        concepto_schema_1.ConceptoModel.countDocuments()
            .then(n => {
            const newBorn = new concepto_schema_1.ConceptoModel(Object.assign(Object.assign({}, req.body), { codigo: n }));
            newBorn.save()
                .then(concepto => {
                res.status(201).json({
                    success: true,
                    data: newBorn
                });
            })
                .catch(err => {
                res.status(500).json({
                    success: false,
                    message: err.message
                });
            });
        })
            .catch((err) => {
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
exports.createConcepto = createConcepto;
// export function existsConcepto(req: Request, res: Response, next: NextFunction) {
//   try {
//     const id = parseInt(req.params.id) || -1;
//     Concepto.findById(id)
//       .then( (result) => {
//         if (!result) {
//           return res.status(404).json({
//             success: false,
//             message: 'No existe concepto con id: ' + id
//           });
//         }
//
//         next();
//       })
//   } catch (e : any) {
//     res.status(500).json({
//       success: false,
//       message: e.message,
//     })
//   }
// }
function updateConcepto(req, res) {
    try {
        concepto_schema_1.ConceptoModel.findByIdAndUpdate(req.params.id, { $set: { descripcion: req.body.descripcion, precio: req.body.precio } }, { returnDocument: 'after' })
            .then((result) => {
            res.status(200).json({
                success: true,
                data: result
            });
        })
            .catch((error) => {
            res.status(500).json({
                success: false,
                message: error.message,
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
exports.updateConcepto = updateConcepto;
