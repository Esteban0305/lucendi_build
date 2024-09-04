"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrdenVenta = exports.printOrdenVenta = exports.showOrdenVenta = exports.createOrdenVenta = void 0;
const cotizacion_schema_1 = require("../schemas/cotizacion.schema");
const pdf_model_1 = require("../models/pdf.model");
const ordenVenta_schema_1 = require("../schemas/ordenVenta.schema");
function createOrdenVenta(req, res) {
    try {
        const id = req.params.id;
        cotizacion_schema_1.CotizacionModel.findByIdAndUpdate(id, { archivada: true }, { returnDocument: 'after' })
            .populate({ path: "conceptos.concepto", model: 'Concepto' })
            .then((cotizacion) => {
            if (!cotizacion) {
                return res.status(500).json({
                    success: false,
                    message: 'No existe cotización con id ' + id
                });
            }
            const orden = new ordenVenta_schema_1.OrdenVentaModel({
                folio: cotizacion.folio,
                cliente: cotizacion.cliente,
                retencionISR: cotizacion.retencionISR,
                retencionIVA: cotizacion.retencionIVA,
                observaciones: cotizacion.observaciones,
                _entrega: cotizacion._entrega,
                conceptos: cotizacion.conceptos,
            });
            orden.save()
                .then((ordenS) => {
                res.status(200).json({
                    success: true,
                    data: ordenS
                });
            })
                .catch(err => {
                res.status(500).json({
                    success: false,
                    message: err.message,
                });
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
exports.createOrdenVenta = createOrdenVenta;
function showOrdenVenta(req, res) {
    try {
        const id = req.params.id;
        ordenVenta_schema_1.OrdenVentaModel.findById(id)
            .populate({ path: 'cliente', model: 'Cliente', populate: { path: 'empresa_id', model: 'Empresa' } })
            .then((ordenVenta) => {
            if (ordenVenta) {
                return res.status(200).json({
                    code: 200,
                    success: true,
                    data: ordenVenta
                });
            }
            res.status(404).json({
                success: false,
                error: {
                    code: 404,
                    message: 'No existe orden de venta con el id ' + id.toUpperCase(),
                    userMessage: 'No se encontró la orden de venta, revise el número de ID'
                }
            });
        })
            .catch(err => {
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
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}
exports.showOrdenVenta = showOrdenVenta;
function printOrdenVenta(req, res) {
    try {
        const id = req.params.id;
        ordenVenta_schema_1.OrdenVentaModel.findById(id)
            .populate({ path: 'cliente', model: 'Cliente', populate: { path: 'empresa_id', model: 'Empresa' } })
            .then((ordenVenta) => {
            if (!ordenVenta) {
                return res.status(500).json({
                    success: false,
                    message: 'La orden de venta con id ' + id + ' no existe.'
                });
            }
            const pdf = pdf_model_1.PDFGenerator.ordenVenta(ordenVenta);
            // @ts-ignore
            const nombre = (ordenVenta.cliente.empresa ? ordenVenta.cliente.empresa.nombre : ordenVenta.cliente.nombre);
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
exports.printOrdenVenta = printOrdenVenta;
function listOrdenVenta(req, res) {
    try {
        let page = 0;
        if (req.query.page) {
            page = parseInt(req.query.page.toString() || '0');
        }
        ordenVenta_schema_1.OrdenVentaModel.find()
            .populate({ path: 'cliente', model: 'Cliente', populate: { path: 'empresa_id', model: 'Empresa' } })
            .limit(25).skip(25 * page)
            .then(ordenes => {
            res.status(200).json({
                success: true,
                data: ordenes
            });
        })
            .catch(err => {
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
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
exports.listOrdenVenta = listOrdenVenta;
