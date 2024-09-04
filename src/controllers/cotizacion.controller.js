"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCotizaciones = exports.printCotizacion = exports.updateCotizacion = exports.createCotizacion = exports.showCotizacion = void 0;
const cotizacion_schema_1 = require("../schemas/cotizacion.schema");
const pdf_model_1 = require("../models/pdf.model");
function showCotizacion(req, res) {
    try {
        const id = req.params.id;
        cotizacion_schema_1.CotizacionModel.findById(id)
            .populate({ path: "conceptos.concepto", model: 'Concepto' })
            .populate({ path: "cliente", populate: {
                path: "empresa_id", model: 'Empresa'
            } })
            .then((cotizacion) => {
            if (!cotizacion) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'No existe cotización con el id ' + id.toUpperCase(),
                        userMessage: 'No se encontró la orden de venta, revise el número de ID'
                    }
                });
            }
            res.status(200).json({
                success: true,
                data: cotizacion
            });
        })
            .catch((err) => {
            res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: err.message,
                    userMessage: 'Ocurrió un error inesperado'
                }
            });
        });
    }
    catch (e) {
        res.status(500).send({
            success: false,
            message: e.message
        });
    }
}
exports.showCotizacion = showCotizacion;
function createCotizacion(req, res) {
    try {
        cotizacion_schema_1.CotizacionModel.countDocuments()
            .then(n => {
            console.log(n);
            const cotizacion = new cotizacion_schema_1.CotizacionModel(Object.assign(Object.assign({}, req.body), { folio: n + 479 }));
            cotizacion.save()
                .then((result) => {
                res.status(201).send({
                    success: true,
                    data: result
                });
            })
                .catch((err) => {
                res.status(500).json({
                    success: false,
                    message: err.message,
                });
            });
        })
            .catch(err => {
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
exports.createCotizacion = createCotizacion;
// export function existsCotizacion(req: Request, res: Response, next: NextFunction) {
//   try {
//     const id = parseInt(req.params.id) || -1;
//     Cotizacion.findById(id)
//       .then( (cotizacion : object | null) => {
//         if (!cotizacion) {
//           return res.status(404).json({
//             success: false,
//             message: 'No existe cotizacion con id: ' + id
//           })
//         }
//         next();
//       })
//   } catch (e : any) {
//     res.status(500).json({
//       success: false,
//       message: e.message,
//     })
//   }
// }
function updateCotizacion(req, res, next) {
    try {
        const id = req.params.id;
        cotizacion_schema_1.CotizacionModel.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })
            .then((cotizacionUpdated) => {
            showCotizacion(req, res);
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
exports.updateCotizacion = updateCotizacion;
function printCotizacion(req, res) {
    try {
        const id = req.params.id;
        cotizacion_schema_1.CotizacionModel.findById(id)
            .populate({ path: 'conceptos.concepto', model: 'Concepto' })
            .populate({ path: 'cliente', model: 'Cliente', populate: { path: 'empresa_id', model: 'Empresa' } })
            .then((cotizacion) => {
            if (!cotizacion) {
                return res.status(500).json({
                    success: false,
                    message: 'La cotización con id ' + id + ' no existe.'
                });
            }
            const pdf = pdf_model_1.PDFGenerator.cotizacion(cotizacion);
            // @ts-ignore
            const nombre = (cotizacion.cliente.empresa_id ? cotizacion.cliente.empresa_id.nombre : cotizacion.cliente.nombre);
            // res.setHeader('Content-disposition', 'attachment; filename=Cotizacion ' + cotizacion.folio + ' ' + nombre + '.pdf');
            res.set({
                'content-type': 'application/pdf; charset=UTF-8',
            }).send(pdf);
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
            message: err.message
        });
    }
}
exports.printCotizacion = printCotizacion;
function listCotizaciones(req, res) {
    try {
        // const query = req.query.q || '';
        let page = 0;
        if (req.query.page) {
            page = parseInt(req.query.page.toString() || '0');
        }
        cotizacion_schema_1.CotizacionModel.find()
            .populate({ path: 'conceptos.concepto', model: 'Concepto' })
            .populate({ path: 'cliente', model: 'Cliente', populate: { path: 'empresa_id', model: 'Empresa' } })
            .limit(25).skip(page * 25)
            .then((cotizacion) => {
            if (!cotizacion) {
                return res.status(200).json({
                    success: true,
                    data: []
                });
            }
            res.status(200).json({
                success: true,
                data: cotizacion
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
exports.listCotizaciones = listCotizaciones;
