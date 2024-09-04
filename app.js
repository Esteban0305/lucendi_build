"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const express_1 = __importDefault(require("express"));
const empresa_route_1 = require("./src/routes/empresa.route");
// @ts-ignore
const morgan_1 = __importDefault(require("morgan"));
const cliente_route_1 = require("./src/routes/cliente.route");
const concepto_route_1 = require("./src/routes/concepto.route");
const cotizacion_route_1 = require("./src/routes/cotizacion.route");
// @ts-ignore
const cors_1 = __importDefault(require("cors"));
const mongoose = __importStar(require("mongoose"));
const ordenVenta_route_1 = require("./src/routes/ordenVenta.route");
const api = (0, express_1.default)();
const web = (0, express_1.default)();
const API_PORT = 3000;
const WEB_PORT = 8080;
console.clear();
// Api
api.use((0, morgan_1.default)('dev'));
api.use((0, cors_1.default)());
api.use(express_1.default.json());
api.use(express_1.default.urlencoded({ extended: false }));
api.use((err, req, res, next) => {
    if (err) {
        return res.status(400).json({
            success: false,
            error: {
                code: 400,
                userMessage: 'Ocurrió un error inesperado',
                message: err.message
            }
        });
    }
    next();
});
api.get('/', (_req, res) => {
    res.status(200).json({ "message": "Hello World" });
});
api.use('/api/empresa/', empresa_route_1.empresaRouter);
api.use('/api/cliente/', cliente_route_1.clienteRouter);
api.use('/api/concepto/', concepto_route_1.conceptoRouter);
api.use('/api/cotizacion/', cotizacion_route_1.cotizacionRoute);
api.use('/api/ordenVenta/', ordenVenta_route_1.ordenVentaRouter);
api.listen(API_PORT, () => {
    console.log('API Listening on port ' + API_PORT);
});
web.use('/', express_1.default.static(__dirname + '/public'));
web.listen(WEB_PORT, () => {
    console.log('WEB server on ' + WEB_PORT, __dirname + '/public');
});
mongoose.connect('mongodb+srv://teban0305:N35v4BdwlQNVLays@migration.c4is1uu.mongodb.net/lucendi?retryWrites=true&w=majority&appName=migration')
    .then((c) => {
    console.log('Connected to MongoDB');
})
    .catch(err => {
    console.error(err);
});
