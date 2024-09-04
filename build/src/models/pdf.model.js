"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFGenerator = void 0;
// @ts-ignore
const fs_1 = __importDefault(require("fs"));
const jspdf_1 = __importDefault(require("jspdf"));
class PDFGenerator {
    static init() {
        const pdf = new jspdf_1.default({
            format: 'letter',
            compress: true
        });
        // pdf.addFileToVFS('OpenSans-Variable.ttf', fs.readFileSync(process.cwd() + '/src/assets/font/OpenSans-Variable.ttf').toString('base64'))
        pdf.addFileToVFS('Roboto-Light.ttf', fs_1.default.readFileSync(process.cwd() + '/src/assets/font/Roboto-Light.ttf').toString('base64'));
        pdf.addFileToVFS('Roboto-Regular.ttf', fs_1.default.readFileSync(process.cwd() + '/src/assets/font/Roboto-Regular.ttf').toString('base64'));
        pdf.addFileToVFS('Roboto-Bold.ttf', fs_1.default.readFileSync(process.cwd() + '/src/assets/font/Roboto-Bold.ttf').toString('base64'));
        pdf.addFileToVFS('Poppins-Regular.ttf', fs_1.default.readFileSync(process.cwd() + '/src/assets/font/Poppins-Regular.ttf').toString('base64'));
        pdf.addFont('Roboto-Light.ttf', 'Roboto', 'light');
        pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        pdf.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
        pdf.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');
        return pdf;
    }
    static hojaMembretada() {
        const pdf = PDFGenerator.init();
        // Header
        {
            pdf.addImage({
                imageData: fs_1.default.readFileSync(process.cwd() + '/src/assets/img/Full Logo Black White.png').toString('base64'),
                x: 10,
                y: 5,
                width: 68,
                height: 15,
                format: 'PNG',
                compression: 'FAST'
            });
            pdf.setDrawColor('#eeeeee');
            pdf.line(10, 22, 205, 22);
        }
        return pdf;
    }
    static cotizacion(data) {
        const pdf = PDFGenerator.hojaMembretada();
        // Archivada
        {
            if (data.archivada) {
                pdf.setFontSize(96);
                pdf.setTextColor('#dddddd');
                pdf.setFont('Roboto', 'bold');
                pdf.text('ARCHIVADA', 45, 220, {
                    angle: 45
                });
            }
        }
        // Datos de Cotización
        {
            pdf.setFontSize(14);
            pdf.setFont('Roboto', 'normal');
            pdf.text('Cotización', 205, 10, { align: "right" });
            //  ID
            {
                pdf.setFont('Roboto', 'bold');
                pdf.setFontSize(9);
                pdf.setTextColor('#FF0000');
                pdf.text('#' + data.folio, 205, 15, { align: "right" });
            }
            //  - Fecha
            {
                pdf.setFont('Roboto', 'normal');
                pdf.setTextColor('#575757');
                pdf.text(data.fechaReadable, 205, 20, { align: "right" });
            }
            pdf.setDrawColor('#eeeeee');
            pdf.line(10, 22, 205, 22);
        }
        // Datos de Contacto
        {
            pdf.setTextColor('#000000');
            pdf.setFontSize(10);
            pdf.setFont('Roboto', 'bold');
            pdf.text('Datos de Contacto', 10, 28);
            pdf.addImage({
                imageData: fs_1.default.readFileSync(process.cwd() + '/src/assets/img/location_on.png').toString('base64'),
                x: 10,
                y: 30,
                width: 5,
                height: 5,
                format: 'PNG',
            });
            pdf.addImage({
                imageData: fs_1.default.readFileSync(process.cwd() + '/src/assets/img/call.png').toString('base64'),
                x: 10,
                y: 37,
                width: 5,
                height: 5,
                format: 'PNG',
            });
            pdf.addImage({
                imageData: fs_1.default.readFileSync(process.cwd() + '/src/assets/img/mail.png').toString('base64'),
                x: 10,
                y: 44,
                width: 5,
                height: 5,
                format: 'PNG',
            });
            pdf.setFont('Roboto', 'light');
            pdf.text('Av. Tecnológico #198, Col. Morelos C.P. 28975', 17, 33.5);
            pdf.text('312 318 1873', 17, 40.7);
            pdf.text('cotizaciones@lucendisolar.com', 17, 47.5);
        }
        // Datos Fiscales
        {
            pdf.setFont('Roboto', 'bold');
            pdf.text('Datos Fiscales', 205, 28, { align: "right" });
            pdf.setFont('Roboto', 'light');
            pdf.text('JOSE RAYMUNDO MUÑOZ SOLANO\nPASEO DE MAGNOLIAS #11\nVILLAS DE BUGAMBILIA\nVILLA DE ÁLVAREZ, COLIMA\nC.P. 28978\nRFC:MUSR790510FT8', 205, 33.5, { align: "right", lineHeightFactor: 1.4 });
            pdf.line(10, 62, 205, 62);
        }
        // Datos del cliente
        {
            if (data.cliente) {
                pdf.setFont('Roboto', 'bold');
                pdf.text('Cliente', 10, 67.5);
                pdf.setFont('Roboto', 'normal');
                pdf.text('Nombre', 10, 73);
                // Headers
                {
                    if (data.cliente.empresa_id) {
                        pdf.text('Atención', 10, 78);
                        if (data.cliente.empresa_id.correo.trim() != '') {
                            pdf.text('Correo', 10, 83);
                        }
                        if (data.cliente.empresa_id.telefono.trim() != '') {
                            pdf.text('Teléfono', 10, 88);
                        }
                        if (data.cliente.empresa_id.RFC.trim() != '') {
                            pdf.text('RFC', 10, 93);
                        }
                        if (data.cliente.empresa_id.direccion.trim() != '') {
                            pdf.text('Dirección', 10, 98);
                        }
                    }
                    else {
                        if (data.cliente.correo.trim() != '') {
                            pdf.text('Correo', 10, 78);
                        }
                        if (data.cliente.telefono.trim() != '') {
                            pdf.text('Teléfono', 10, 83);
                        }
                        if (data.cliente.RFC.trim() != '') {
                            pdf.text('RFC', 10, 88);
                        }
                        if (data.cliente.direccion.trim() != '') {
                            pdf.text('Dirección', 10, 93);
                        }
                    }
                }
                //  Data
                pdf.setFont('Roboto', 'light');
                {
                    if (data.cliente.empresa_id) {
                        pdf.text(data.cliente.empresa_id.nombre, 30, 73);
                        pdf.text(data.cliente.nombre, 30, 78);
                        if (data.cliente.empresa_id.correo.trim() != '') {
                            pdf.text(data.cliente.empresa_id.correo, 30, 83);
                        }
                        if (data.cliente.empresa_id.telefono.trim() != '') {
                            pdf.text(data.cliente.empresa_id.telefono, 30, 88);
                        }
                        if (data.cliente.empresa_id.RFC.trim() != '') {
                            pdf.text(data.cliente.empresa_id.RFC, 30, 93);
                        }
                        if (data.cliente.empresa_id.direccion.trim() != '') {
                            pdf.text(data.cliente.empresa_id.direccion, 30, 98);
                        }
                    }
                    else {
                        pdf.text(data.cliente.nombre, 30, 73);
                        if (data.cliente.correo.trim() != '') {
                            pdf.text(data.cliente.correo, 30, 78);
                        }
                        if (data.cliente.telefono.trim() != '') {
                            pdf.text(data.cliente.telefono, 30, 83);
                        }
                        if (data.cliente.RFC.trim() != '') {
                            pdf.text(data.cliente.RFC, 30, 88);
                        }
                        if (data.cliente.direccion.trim() != '') {
                            pdf.text(data.cliente.direccion, 30, 93);
                        }
                    }
                }
            }
            else {
                pdf.text('A quien corresponda', 5, 78);
            }
            pdf.line(10, 100, 205, 100);
        }
        // Conceptos
        let y = 107;
        {
            pdf.setFont('Roboto', 'bold');
            pdf.setFontSize(12);
            pdf.text('Conceptos', 10, y);
            pdf.setFont('Roboto', 'bold');
            pdf.setFontSize(10);
            y += 7;
            // Headers
            {
                pdf.setFillColor('#545454');
                pdf.rect(10, y - 4, 195, 7, 'F');
                pdf.setTextColor('#ffffff');
                pdf.text('#', 13.5, y);
                pdf.text('Descripción', 23.5, y);
                pdf.text('Cantidad', 142.5, y, { align: 'right' });
                pdf.text('P. Unitario', 172.5, y, { align: 'right' });
                pdf.text('Total', 202.5, y, { align: 'right' });
                pdf.setTextColor('#000000');
            }
            pdf.setFont('Roboto', 'normal');
            let rect = true;
            data.conceptos.forEach((concepto) => {
                y += 6;
                if (y > 250) {
                    console.log('Superiooor', y);
                    pdf.addPage();
                    y = 15;
                }
                const lineHeight = pdf.getTextDimensions('a').h;
                const descripcionHeight = pdf.getTextDimensions(concepto.concepto.descripcion, { maxWidth: 110 }).h;
                const yHeight = descripcionHeight + 1 + 1.5;
                const yRect = y - lineHeight - 0.75;
                let style = 'S';
                pdf.setFillColor('#ffffff');
                if (rect) {
                    pdf.setFillColor('#eeeeee');
                    style = 'FD';
                }
                rect = !rect;
                pdf.rect(10, yRect, 195, yHeight, style);
                // Data
                {
                    pdf.text(concepto.concepto.codigo.toString(), 13.5, y);
                    pdf.text(concepto.concepto.descripcion, 23.5, y, { maxWidth: 105 });
                    pdf.text(concepto.cantidad.toString(), 142.5, y, { align: 'right' });
                    pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(concepto.concepto.precio), 172.5, y, { align: 'right' });
                    pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(concepto.total), 202.5, y, { align: 'right' });
                }
                y += pdf.getTextDimensions(concepto.concepto.descripcion, { maxWidth: 110 }).h - pdf.getTextDimensions('a').h;
            });
        }
        // Observaciones
        let yObservacion = y + 5 + pdf.getTextDimensions(data.observaciones, { maxWidth: 135 }).h;
        if (y > 250) {
            console.log('Superiooor', y);
            pdf.addPage();
            y = 15;
        }
        {
            pdf.rect(10, y + 3, 139, pdf.getTextDimensions(data.observaciones, { maxWidth: 135 }).h + 7);
            pdf.setFont('Roboto', 'bold');
            pdf.text('Observaciones', 11, y + 7);
            pdf.setFont('Roboto', 'light');
            pdf.text(data.observaciones, 11, y + 12, { maxWidth: 137 });
        }
        // Totales
        {
            pdf.setFont('Roboto', 'normal');
            y += 7;
            pdf.setFillColor('#eeeeee');
            pdf.setDrawColor('#eeeeee');
            pdf.rect(150, y - 5.1, 55, 7, 'F');
            pdf.text('Subtotal', 172, y, { align: 'right' });
            pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data.subtotal), 202, y, { align: 'right' });
            pdf.rect(150, y + 2, 55, 6);
            pdf.text('IVA', 172, y += 6, { align: 'right' });
            pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data.IVA), 202, y, { align: 'right' });
            if (data.retencionIVA) {
                pdf.setFillColor('#eeeeee');
                pdf.setDrawColor('#eeeeee');
                pdf.rect(150, y + 2, 55, 6, 'F');
                pdf.text('Retención IVA', 172, y += 6, { align: 'right' });
                pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(-data.IVA), 202, y, { align: 'right' });
            }
            if (data.retencionISR != -1) {
                if (!data.retencionIVA) {
                    pdf.setFillColor('#eeeeee');
                    pdf.setDrawColor('#eeeeee');
                    pdf.rect(150, y + 2, 55, 6, 'F');
                }
                else {
                    pdf.rect(150, y + 2, 55, 6);
                }
                pdf.text('ISR', 172, y += 6, { align: 'right' });
                pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(-data.ISR), 202, y, { align: 'right' });
            }
            pdf.setTextColor('#FFFFFF');
            pdf.setFillColor('#545454');
            pdf.setDrawColor('#545454');
            pdf.rect(150, y + 2, 55, 6, 'FD');
            pdf.text('Total', 172, y += 6, { align: 'right' });
            pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data.total), 202, y, { align: 'right' });
        }
        // Letra
        {
            if (y > 250) {
                console.log('Superiooor', y);
                pdf.addPage();
                y = 10;
                yObservacion = 10;
            }
            if (yObservacion > y) {
                y = yObservacion;
            }
            pdf.setTextColor('#FFFFFF');
            pdf.setFillColor('#545454');
            pdf.setFont('Roboto', 'bold');
            pdf.rect(10, y + 6, 195, 6, 'F');
            pdf.text('Importe con letra', 12, y += 10);
            pdf.setFillColor('#eeeeee');
            pdf.rect(10, y + 1.7, 195, 6, 'F');
            pdf.setTextColor('#000000');
            pdf.setFont('Roboto', 'normal');
            pdf.text(data.letra, 12, y += 6);
        }
        // TyC
        {
            pdf.setTextColor('#000000');
            pdf.setFontSize(8);
            pdf.text('Términos y Condiciones\n' +
                '- Fecha de entrega: ' + data.entrega + '\n' +
                '- Estos términos son válidos solo por 15 días a partir de la emisión de la cotización, pasado ese tiempo solicitar una nueva cotización.\n' +
                '- Estos precios están sujetos a cambio sin previo aviso.\n' +
                '- El precio está sujeto a la compra de este paquete completo, si desea comprar los productos por separado se tiene que realizar otra cotización.\n' +
                '- Aplican restricciones.\n' +
                '- En caso de requerir retención de ISR favor de plasmarlo en la orden de compra.\n' +
                '- Se hará todo lo posible por cumplir con el plazo de entrega, pero no nos hacemos responsables de restrasos debido a circunstancias fuera de nuestro control\n' +
                '- Esta cotización es completamente informativa, para poder realizar el surtido del producto es necesario solicitar la orden de venta.\n', 10, y += 10, { maxWidth: 195 });
        }
        const base64pdf = pdf.output('dataurlstring');
        return Buffer.from(base64pdf.slice(51, base64pdf.length), 'base64');
    }
    static ordenVenta(data) {
        const pdf = PDFGenerator.hojaMembretada();
        // Pagada
        {
            if (data.pagada) {
                pdf.setFontSize(126);
                pdf.setTextColor('#dddddd');
                pdf.setFont('Roboto', 'bold');
                pdf.text('PAGADA', 50, 205, {
                    angle: 45
                });
            }
        }
        // Datos de Cotización
        {
            pdf.setFontSize(14);
            pdf.setFont('Roboto', 'normal');
            pdf.text('Orden de Venta', 205, 10, { align: "right" });
            //  ID
            {
                pdf.setFont('Roboto', 'bold');
                pdf.setFontSize(9);
                pdf.setTextColor('#FF0000');
                pdf.text('#' + data.folio, 205, 15, { align: "right" });
            }
            //  - Fecha
            {
                pdf.setFont('Roboto', 'normal');
                pdf.setTextColor('#575757');
                pdf.text(data.fechaReadable, 205, 20, { align: "right" });
            }
            pdf.setDrawColor('#eeeeee');
            pdf.line(10, 22, 205, 22);
        }
        // Datos de Contacto
        {
            pdf.setTextColor('#000000');
            pdf.setFontSize(10);
            pdf.setFont('Roboto', 'bold');
            pdf.text('Datos de Contacto', 10, 28);
            pdf.addImage({
                imageData: fs_1.default.readFileSync(process.cwd() + '/src/assets/img/location_on.png').toString('base64'),
                x: 10,
                y: 30,
                width: 5,
                height: 5,
                format: 'PNG',
            });
            pdf.addImage({
                imageData: fs_1.default.readFileSync(process.cwd() + '/src/assets/img/call.png').toString('base64'),
                x: 10,
                y: 37,
                width: 5,
                height: 5,
                format: 'PNG',
            });
            pdf.addImage({
                imageData: fs_1.default.readFileSync(process.cwd() + '/src/assets/img/mail.png').toString('base64'),
                x: 10,
                y: 44,
                width: 5,
                height: 5,
                format: 'PNG',
            });
            pdf.setFont('Roboto', 'light');
            pdf.text('Av. Tecnológico #198, Col. Morelos C.P. 28975', 17, 33.5);
            pdf.text('312 318 1873', 17, 40.7);
            pdf.text('cotizaciones@lucendisolar.com', 17, 47.5);
        }
        // Datos Fiscales
        {
            pdf.setFont('Roboto', 'bold');
            pdf.text('Datos Fiscales', 205, 28, { align: "right" });
            pdf.setFont('Roboto', 'light');
            pdf.text('JOSE RAYMUNDO MUÑOZ SOLANO\nPASEO DE MAGNOLIAS #11\nVILLAS DE BUGAMBILIA\nVILLA DE ÁLVAREZ, COLIMA\nC.P. 28978\nRFC:MUSR790510FT8', 205, 33.5, { align: "right", lineHeightFactor: 1.4 });
            pdf.line(10, 62, 205, 62);
        }
        // Datos del cliente
        {
            if (data.cliente) {
                pdf.setFont('Roboto', 'bold');
                pdf.text('Cliente', 10, 67.5);
                pdf.setFont('Roboto', 'normal');
                pdf.text('Nombre', 10, 73);
                // Headers
                {
                    if (data.cliente.empresa) {
                        pdf.text('Atención', 10, 78);
                        if (data.cliente.empresa.correo.trim() != '') {
                            pdf.text('Correo', 10, 83);
                        }
                        if (data.cliente.empresa.telefono.trim() != '') {
                            pdf.text('Teléfono', 10, 88);
                        }
                        if (data.cliente.empresa.RFC.trim() != '') {
                            pdf.text('RFC', 10, 93);
                        }
                        if (data.cliente.empresa.direccion.trim() != '') {
                            pdf.text('Dirección', 10, 98);
                        }
                    }
                    else {
                        if (data.cliente.correo.trim() != '') {
                            pdf.text('Correo', 10, 78);
                        }
                        if (data.cliente.telefono.trim() != '') {
                            pdf.text('Teléfono', 10, 83);
                        }
                        if (data.cliente.RFC.trim() != '') {
                            pdf.text('RFC', 10, 88);
                        }
                        if (data.cliente.direccion.trim() != '') {
                            pdf.text('Dirección', 10, 93);
                        }
                    }
                }
                //  Data
                pdf.setFont('Roboto', 'light');
                {
                    if (data.cliente.empresa) {
                        pdf.text(data.cliente.empresa.nombre, 30, 73);
                        pdf.text(data.cliente.nombre, 30, 78);
                        if (data.cliente.empresa.correo.trim() != '') {
                            pdf.text(data.cliente.empresa.correo, 30, 83);
                        }
                        if (data.cliente.empresa.telefono.trim() != '') {
                            pdf.text(data.cliente.empresa.telefono, 30, 88);
                        }
                        if (data.cliente.empresa.RFC.trim() != '') {
                            pdf.text(data.cliente.empresa.RFC, 30, 93);
                        }
                        if (data.cliente.empresa.direccion.trim() != '') {
                            pdf.text(data.cliente.empresa.direccion, 30, 98);
                        }
                    }
                    else {
                        pdf.text(data.cliente.nombre, 30, 73);
                        if (data.cliente.correo.trim() != '') {
                            pdf.text(data.cliente.correo, 30, 78);
                        }
                        if (data.cliente.telefono.trim() != '') {
                            pdf.text(data.cliente.telefono, 30, 83);
                        }
                        if (data.cliente.RFC.trim() != '') {
                            pdf.text(data.cliente.RFC, 30, 88);
                        }
                        if (data.cliente.direccion.trim() != '') {
                            pdf.text(data.cliente.direccion, 30, 93);
                        }
                    }
                }
                // Información de pago
                pdf.setFont('Roboto', 'bold');
                {
                    pdf.text('Información de pago', 205, 67.5, { align: 'right' });
                    pdf.setFont('Roboto', 'light');
                    pdf.text('José Raymundo Muñoz Solano\nBANORTE\nCLABE Interbancaria\n072 098004188456318\nNúmero de Cuenta\n0418845631', 205, 73, { align: 'right', lineHeightFactor: 1.3 });
                }
            }
            else {
                pdf.text('A quien corresponda', 5, 78);
            }
            pdf.line(10, 100, 205, 100);
        }
        // Conceptos
        let y = 107;
        {
            pdf.setFont('Roboto', 'bold');
            pdf.setFontSize(12);
            pdf.text('Conceptos', 10, y);
            pdf.setFont('Roboto', 'bold');
            pdf.setFontSize(10);
            y += 7;
            // Headers
            {
                pdf.setFillColor('#545454');
                pdf.rect(10, y - 4, 195, 7, 'F');
                pdf.setTextColor('#ffffff');
                pdf.text('#', 13.5, y);
                pdf.text('Descripción', 23.5, y);
                pdf.text('Cantidad', 142.5, y, { align: 'right' });
                pdf.text('P. Unitario', 172.5, y, { align: 'right' });
                pdf.text('Total', 202.5, y, { align: 'right' });
                pdf.setTextColor('#000000');
            }
            pdf.setFont('Roboto', 'normal');
            let rect = true;
            data.conceptos.forEach((concepto) => {
                y += 6;
                const lineHeight = pdf.getTextDimensions('a').h;
                const descripcionHeight = pdf.getTextDimensions(concepto.concepto.descripcion, { maxWidth: 110 }).h;
                const yHeight = descripcionHeight + 1 + 1.5;
                const yRect = y - lineHeight - 0.75;
                let style = 'S';
                pdf.setFillColor('#ffffff');
                if (rect) {
                    pdf.setFillColor('#eeeeee');
                    style = 'FD';
                }
                rect = !rect;
                pdf.rect(10, yRect, 195, yHeight, style);
                // Data
                {
                    pdf.text(concepto.concepto.codigo.toString(), 13.5, y);
                    pdf.text(concepto.concepto.descripcion, 23.5, y, { maxWidth: 105 });
                    pdf.text(concepto.cantidad.toString(), 142.5, y, { align: 'right' });
                    pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(concepto.concepto.precio), 172.5, y, { align: 'right' });
                    pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(concepto.total), 202.5, y, { align: 'right' });
                }
                y += pdf.getTextDimensions(concepto.concepto.descripcion, { maxWidth: 110 }).h - pdf.getTextDimensions('a').h;
            });
        }
        // Observaciones
        let yObservacion = y + 5 + pdf.getTextDimensions(data.observaciones, { maxWidth: 135 }).h;
        {
            pdf.rect(10, y + 3, 139, pdf.getTextDimensions(data.observaciones, { maxWidth: 135 }).h + 7);
            pdf.setFont('Roboto', 'bold');
            pdf.text('Observaciones', 11, y + 7);
            pdf.setFont('Roboto', 'light');
            pdf.text(data.observaciones, 11, y + 12, { maxWidth: 137 });
        }
        // Totales
        {
            pdf.setFont('Roboto', 'normal');
            y += 7;
            pdf.setFillColor('#eeeeee');
            pdf.setDrawColor('#eeeeee');
            pdf.rect(150, y - 5.1, 55, 7, 'F');
            pdf.text('Subtotal', 172, y, { align: 'right' });
            pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data.subtotal), 202, y, { align: 'right' });
            pdf.rect(150, y + 2, 55, 6);
            pdf.text('IVA', 172, y += 6, { align: 'right' });
            pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data.IVA), 202, y, { align: 'right' });
            if (data.retencionIVA) {
                pdf.setFillColor('#eeeeee');
                pdf.setDrawColor('#eeeeee');
                pdf.rect(150, y + 2, 55, 6, 'F');
                pdf.text('Retención IVA', 172, y += 6, { align: 'right' });
                pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(-data.IVA), 202, y, { align: 'right' });
            }
            if (data.retencionISR != -1) {
                if (!data.retencionIVA) {
                    pdf.setFillColor('#eeeeee');
                    pdf.setDrawColor('#eeeeee');
                    pdf.rect(150, y + 2, 55, 6, 'F');
                }
                else {
                    pdf.rect(150, y + 2, 55, 6);
                }
                pdf.text('ISR', 172, y += 6, { align: 'right' });
                pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(-data.ISR), 202, y, { align: 'right' });
            }
            pdf.setTextColor('#FFFFFF');
            pdf.setFillColor('#545454');
            pdf.setDrawColor('#545454');
            pdf.rect(150, y + 2, 55, 6, 'FD');
            pdf.text('Total', 172, y += 6, { align: 'right' });
            pdf.text(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data.total), 202, y, { align: 'right' });
        }
        // Letra
        {
            if (yObservacion > y) {
                y = yObservacion;
            }
            pdf.setTextColor('#FFFFFF');
            pdf.setFillColor('#545454');
            pdf.setFont('Roboto', 'bold');
            pdf.rect(10, y + 6, 195, 6, 'F');
            pdf.text('Importe con letra', 12, y += 10);
            pdf.setFillColor('#eeeeee');
            pdf.rect(10, y + 1.7, 195, 6, 'F');
            pdf.setTextColor('#000000');
            pdf.setFont('Roboto', 'normal');
            pdf.text(data.letra, 12, y += 6);
        }
        // TyC
        {
            pdf.setTextColor('#000000');
            pdf.setFontSize(10);
            pdf.setFont('Roboto', 'bold');
            pdf.text('Pagaré', 10, y += 10);
            pdf.setFont('Roboto', 'normal');
            pdf.setFontSize(8);
            pdf.text('Debo y pagaré incondicionalmente por este pagaré a la orden de JOSÉ RAYMUNDO MUÑOZ SOLANO, la cantidad de ' + new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data.total) + ' (' + data.letra + '), cantidad recibida en efectivo a mi entera satisfacción, debiendo realizar el pago el día ' + data.fechaPago + '.\n' +
                '\n' +
                'Valor recibido a mi entera satisfacción, este pagare forma parte de una serie numerada del 1 al ___ y todos están sujetos a la condición de que, al no pagarse cualquiera de ellos a su vencimiento, serán exigibles todos los que le sigan en número, ademas de los ya vencidos, desde la fecha de vencimiento de este documento hasta el día de su liquidación.\n' +
                '\n' +
                'Este pagaré generará un interés ordinario de 5% (CINCO por ciento) mensual por concepto de interés ordinario por todo el tiempo que permanezca insoluto el adeudo. Igualmente obligándome a pagar para el caso de mora un interés moratorio equivalente al 5% (CINCO por ciento) mensual a partir de la fecha en que se constituya en mora y hasta su total liquidación.\n' +
                '\n' +
                'La cantidad resultante de los intereses podrá ser capitalizada de conformidad al artículo 363 del código de comercio. Los deudores renuncian al fuero que por razón de su domicilio presente o futuro pudiera corresponderles y se someten a la jurisdicción de los tribunales competentes del Estado de Colima.\n' +
                '\n' +
                '\n' +
                'Suscrito en _______________________,  al ' + data.fechaReadable + '         Suscriptor (Deudor principal):________________________', 10, y += 4, { maxWidth: 195, align: 'justify' });
        }
        const base64pdf = pdf.output('dataurlstring');
        return Buffer.from(base64pdf.slice(51, base64pdf.length), 'base64');
    }
}
exports.PDFGenerator = PDFGenerator;
