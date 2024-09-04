"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empresa = void 0;
const empresa_schema_1 = require("../schemas/empresa.schema");
class Empresa {
    constructor({ id = '', nombre, direccion = '', correo = '', telefono = '', RFC = '' }) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.correo = correo;
        this.telefono = telefono;
        this.RFC = RFC;
    }
    static findById(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                empresa_schema_1.EmpresaModel.findById(id)
                    .then((empresas) => {
                    resolve(empresas);
                })
                    .catch(err => {
                    reject(err);
                });
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    static find(queryStatement) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                empresa_schema_1.EmpresaModel.find({});
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    create() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const empresa = new empresa_schema_1.EmpresaModel(Object.assign({}, this));
                yield empresa.save()
                    .then((emp) => {
                    this.id = emp._id.toString();
                    resolve(emp._id.toString());
                })
                    .catch(err => {
                    reject(err);
                });
            }
            catch (e) {
                reject(e);
            }
        }));
    }
}
exports.Empresa = Empresa;
