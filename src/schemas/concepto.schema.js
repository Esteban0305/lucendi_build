"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConceptoModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const conceptoSchema = new mongoose_1.default.Schema({
    codigo: {
        type: Number,
        default: 0,
    },
    descripcion: {
        type: String,
        required: true,
        // trim: true
    },
    precio: {
        type: Number,
        required: true,
        default: 0
    },
    descontinuado: {
        type: Boolean,
        required: true,
        default: false
    }
});
exports.ConceptoModel = mongoose_1.default.model('Concepto', conceptoSchema);
