"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const number2words_1 = require("../functions/number2words");
const counterSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Types.ObjectId,
    folio: Number
});
const cotizacionConceptoSchema = new mongoose_1.default.Schema({
    concepto: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Conceptos',
        required: true
    },
    cantidad: {
        type: Number,
        default: 1,
    },
    descuento: {
        type: Number,
        default: 0
    }
}, {
    virtuals: {
        total: {
            get() {
                // @ts-ignore
                return (this.concepto.precio * this.cantidad) - this.descuento;
            }
        }
    },
    toJSON: {
        virtuals: true
    }
});
const cotizacionSchema = new mongoose_1.default.Schema({
    folio: {
        type: Number,
        default: 0,
    },
    fecha: {
        type: Date,
        default: Date.now,
        required: true,
    },
    cliente: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Cliente',
        required: true,
    },
    retencionISR: {
        type: Number,
        default: -1,
        required: true,
    },
    retencionIVA: {
        type: Boolean,
        default: false,
        required: true,
    },
    observaciones: {
        type: String,
        default: 'Sin Observaciones',
        required: false,
    },
    _entrega: {
        type: String,
        required: true,
        trim: true
    },
    archivada: {
        type: Boolean,
        required: true,
        default: false
    },
    conceptos: [cotizacionConceptoSchema],
}, {
    virtuals: {
        id: {
            get() {
                return 0;
            }
        },
        subtotal: {
            get() {
                let sub = 0;
                this.conceptos.forEach(concepto => {
                    // @ts-ignore
                    sub += concepto.total;
                });
                return sub;
            }
        },
        IVA: {
            get() {
                // @ts-ignore
                return this.subtotal * 0.16;
            }
        },
        ISR: {
            get() {
                if (this.retencionISR != -1) {
                    // @ts-ignore
                    return (this.retencionISR / 100) * this.subtotal;
                }
                return 0;
            }
        },
        total: {
            get() {
                // @ts-ignore
                let total = this.subtotal + this.IVA - this.ISR;
                if (this.retencionIVA) {
                    // @ts-ignore
                    total -= this.IVA;
                }
                return total;
            }
        },
        letra: {
            get() {
                // @ts-ignore
                return (0, number2words_1.NumeroALetras)(this.total);
            }
        },
        fechaReadable: {
            get() {
                const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                return this.fecha.getDate() + ' de ' + months[this.fecha.getMonth()] + ' de ' + this.fecha.getFullYear();
            }
        },
        entrega: {
            get() {
                const dt = this._entrega.split(',');
                let dias = '';
                let entr = '';
                switch (dt[0]) {
                    case '3D':
                        dias = '3 días hábiles ';
                        break;
                    case '5D':
                        dias = '5 días hábiles ';
                        break;
                    case '7D':
                        dias = '7 días hábiles ';
                        break;
                    case '10D':
                        dias = '10 días hábiles ';
                        break;
                    case '15D':
                        dias = '15 días hábiles ';
                        break;
                    case '20D':
                        dias = '20 días hábiles ';
                        break;
                    case '30D':
                        dias = '30 días hábiles ';
                        break;
                    case '6S':
                        dias = '6 semanas hábiles ';
                        break;
                    case '8S':
                        dias = '8 semanas hábiles ';
                        break;
                    case '10S':
                        dias = '10 semanas hábiles ';
                        break;
                }
                switch (dt[1]) {
                    case 'ROC':
                        entr = 'recibida la orden de compra';
                        break;
                    case 'RPT':
                        entr = 'realizado y comprobado el pago total de la cotización';
                        break;
                    case 'RPP50':
                        entr = 'realizado y comprobado el pago del 50% del precio de la cotización';
                        break;
                    case 'RPP60':
                        entr = 'realizado y comprobado el pago del 60% del precio de la cotización';
                        break;
                    case 'RPP70':
                        entr = 'realizado y comprobado el pago del 70% del precio de la cotización';
                        break;
                    case 'RPP80':
                        entr = 'realizado y comprobado el pago del 80% del precio de la cotización';
                        break;
                    case 'RPP90':
                        entr = 'realizado y comprobado el pago del 90% del precio de la cotización';
                        break;
                }
                return dias + 'a partir de ' + entr;
            }
        }
    },
    toJSON: { virtuals: true }
});
exports.CotizacionModel = mongoose_1.default.model('Cotizacion', cotizacionSchema);
// cotizacionSchema.pre('save', (next) => {
//   CotizacionModel.countDocuments()
//     .then( number => {
//       console.log(number);
//       next();
//     })
//     .catch(err => {
//       console.log(err);
//       next();
//     });
// });
