delimiter //

CREATE
    PROCEDURE getCotizacion (IN _idCotizacion INTEGER)
BEGIN
    DECLARE _subtotal FLOAT;
    DECLARE _iva FLOAT;
    DECLARE _retencion_iva FLOAT;
    DECLARE _isr FLOAT;
    DECLARE _total FLOAT;
    DECLARE _cliente INTEGER;

    SET _subtotal = ROUND(subtotal(_idCotizacion), 2);
    SET _iva = ROUND(iva(_subtotal), 2);
    SET _isr = 0;
    SET _retencion_iva = 0;

    IF ( (SELECT isr FROM cotizaciones WHERE id = _idCotizacion) > -1) THEN
      SET _isr = (SELECT ROUND(isr(_subtotal, isr), 2) FROM cotizaciones WHERE id = _idCotizacion);
END IF;

    IF ( (SELECT retencionIVA FROM cotizaciones WHERE id = _idCotizacion) = 1) THEN
      SET _retencion_iva = _iva * -1;
END IF;

    SET _total = ROUND(_subtotal + _iva - _isr + _retencion_iva, 2);
    SET _cliente = (SELECT cliente FROM cotizaciones WHERE id = _idCotizacion);

SELECT id AS 'folio', fecha, cliente, _subtotal AS 'subtotal', _iva AS 'IVA', isr AS 'porISR', _isr AS 'ISR', _total AS 'total', observaciones, letra, entrega, retencionIVA, archivada FROM cotizaciones WHERE id = _idCotizacion;
CALL getCliente(_cliente);
CALL getconceptosFromCotizacion(_idCotizacion);
END //

CREATE
    PROCEDURE getFolio ()
BEGIN
    SELECT (MAX(id) + 1) AS 'folio' FROM cotizaciones;
END //

CREATE
    PROCEDURE getconceptosFromCotizacion (IN idCotizacion INTEGER)
BEGIN
    SELECT conceptos.id AS 'codigo', conceptos.descripcion AS 'descripcion', conceptos.precio AS 'precioUnitario', cotizaciones_conceptos.cantidad AS 'cantidad', ROUND(conceptos.precio * cotizaciones_conceptos.cantidad, 2) AS 'total' FROM lucendi_dev.cotizaciones_conceptos INNER JOIN conceptos ON cotizaciones_conceptos.concepto = conceptos.id WHERE cotizaciones_conceptos.cotizacion = idCotizacion;
END //

CREATE
    PROCEDURE searchFoliosCotizaciones (IN _query VARCHAR(100))
BEGIN
    SELECT cotizaciones.id AS 'folio' FROM cotizaciones INNER JOIN clientes ON cotizaciones.cliente = clientes.id LEFT JOIN empresas ON clientes.empresa = empresas.id WHERE cotizaciones.id = _query OR cotizaciones.observaciones LIKE CONCAT ('%', _query, '%') OR clientes.nombre LIKE CONCAT('%', _query, '%') OR empresas.nombre LIKE CONCAT('%', _query, '%') OR clientes.RFC LIKE CONCAT('%', _query, '%') OR empresas.RFC LIKE CONCAT('%', _query, '%') ORDER BY cotizaciones.id DESC;
END //

-- POST
CREATE
    PROCEDURE saveCotizacion (IN _fecha DATE, IN _cliente INTEGER, IN _isr FLOAT, IN _observaciones VARCHAR(300), IN _letra VARCHAR(150), IN _entrega VARCHAR(100), IN _retencionIVA BOOLEAN)
BEGIN
    DECLARE _idCotizacion INTEGER;
    INSERT INTO cotizaciones (fecha, cliente, isr, observaciones, letra, entrega, retencionIVA) VALUES (_fecha,_cliente, _isr, _observaciones, _letra, _entrega, _retencionIVA);
    SELECT MAX(id) AS 'folio' FROM cotizaciones;
END //

CREATE
    PROCEDURE updateCotizacion (IN _folio INTEGER, IN _fecha DATE, IN _cliente INTEGER, IN _isr FLOAT, IN _observaciones VARCHAR(300), IN _letra VARCHAR(150), IN _entrega VARCHAR(100), IN _retencionIVA BOOLEAN)
BEGIN
    DECLARE _idCotizacion INTEGER;
    UPDATE cotizaciones SET fecha = _fecha, cliente = _cliente, isr = _isr, observaciones = _observaciones, letra = _letra, entrega = _entrega, retencionIVA = _retencionIVA WHERE id = _folio;
    SELECT id AS 'folio' FROM cotizaciones WHERE id = _folio;
END //

CREATE
    PROCEDURE archivarCotizacion (IN _folio INTEGER)
BEGIN
    UPDATE cotizaciones SET archivada = 1 WHERE id = _folio;
END //

CREATE
    PROCEDURE saveConceptoToCotizacion (IN _idConcepto INTEGER, IN _idCotizacion INTEGER, IN _cantidad INTEGER)
BEGIN
    INSERT INTO cotizaciones_conceptos VALUES (_idConcepto, _idCotizacion, _cantidad);
END //

-- DELETE
CREATE
    PROCEDURE deleteconceptosFromCotizacion (IN _folio INTEGER)
BEGIN
    DELETE FROM cotizaciones_conceptos WHERE cotizacion = _folio;
END //


-- clientes
-- GET
CREATE
    PROCEDURE getCliente (IN _idCliente INTEGER)
BEGIN
    DECLARE _idEmpresa INTEGER;
    SET _idEmpresa = (SELECT DISTINCT empresas.id FROM empresas INNER JOIN clientes ON empresas.id = clientes.empresa WHERE clientes.id = _idCliente);

    SELECT id AS 'numCliente', nombre, correo, telefono, RFC, direccion, empresa AS 'numEmpresa' FROM clientes WHERE id = _idCliente;
    CALL getEmpresa(_idEmpresa);
END //

CREATE
    PROCEDURE searchCliente(IN _query VARCHAR (100))
BEGIN
    SELECT clientes.id AS 'numCliente', clientes.nombre, clientes.correo, clientes.telefono, clientes.RFC, clientes.direccion, clientes.empresa FROM clientes WHERE clientes.nombre LIKE CONCAT('%',_query,'%') OR clientes.correo LIKE CONCAT('%',_query,'%') OR clientes.RFC LIKE CONCAT('%',_query,'%') OR clientes.id = _query ORDER BY clientes.nombre ASC;
    SELECT empresas.id AS 'numEmpresa', empresas.nombre AS 'nombre', empresas.direccion AS 'direccion', empresas.RFC as 'RFC', empresas.telefono as 'telefono', empresas.correo as 'correo' FROM clientes LEFT JOIN empresas ON clientes.empresa = empresas.id WHERE clientes.nombre LIKE CONCAT('%',_query,'%') OR clientes.correo LIKE CONCAT('%',_query,'%') OR clientes.RFC LIKE CONCAT('%',_query,'%') OR clientes.id = _query ORDER BY clientes.nombre ASC;
END //

-- POST
CREATE
    PROCEDURE saveCLiente (IN _nombre VARCHAR(50), IN _correo VARCHAR(100), IN _telefono VARCHAR(10), IN _RFC VARCHAR(13), IN _direccion VARCHAR(300), IN _empresa INTEGER)
BEGIN
    DECLARE _id INTEGER;
    INSERT INTO clientes (nombre, correo, telefono, RFC, direccion, empresa) VALUES (_nombre, _correo, _telefono, _RFC, _direccion, _empresa);
    SET _id = (SELECT id AS 'numCliente' FROM clientes ORDER BY id DESC LIMIT 1);
    CALL getEmpresa(_id);
END //

CREATE
    PROCEDURE updateCliente (IN _numCliente INTEGER, IN _nombre VARCHAR(50), IN _correo VARCHAR(100), IN _telefono VARCHAR(10), IN _RFC VARCHAR(13), IN _direccion VARCHAR(300), IN _empresa INTEGER)
BEGIN
    UPDATE clientes SET nombre = _nombre, correo = _correo, telefono = _telefono, RFC = _RFC, direccion = _direccion, empresa = _empresa WHERE id = _numCliente;
    SELECT clientes.id AS 'numCliente', clientes.nombre, clientes.correo, clientes.telefono, clientes.RFC, clientes.direccion, clientes.empresa FROM clientes WHERE clientes.id = _numCliente;
    SELECT empresas.id AS 'numEmpresa', empresas.nombre AS 'nombre', empresas.direccion AS 'direccion', empresas.RFC as 'RFC', empresas.telefono as 'telefono', empresas.correo as 'correo' FROM clientes LEFT JOIN empresas ON clientes.empresa = empresas.id WHERE clientes.id = _numCliente;
END //


-- conceptos
-- GET
CREATE
    PROCEDURE getConcepto (IN _idConcepto INTEGER)
BEGIN
    SELECT id as 'codigo', descripcion, precio as 'precioUnitario' FROM conceptos WHERE id = _idConcepto;
END //

CREATE
    PROCEDURE searchConcepto (IN _query VARCHAR(100))
BEGIN
    SELECT id as 'codigo', descripcion, precio as 'precioUnitario' FROM conceptos WHERE descripcion LIKE CONCAT('%', _query, '%') OR id LIKE CONCAT('%',_query,'%') ORDER BY descripcion ASC;
END //
-- POST
CREATE
    PROCEDURE saveConcepto (IN _descripcion VARCHAR(2000), IN _precio FLOAT)
BEGIN
    INSERT INTO conceptos (descripcion, precio) VALUES (_descripcion, _precio);
    SELECT id as 'codigo', descripcion, precio as 'precioUnitario' FROM conceptos ORDER BY id DESC LIMIT 1;
END //

CREATE
    PROCEDURE updateConcepto (IN _codigo INTEGER, IN _descripcion VARCHAR(2000), IN _precio FLOAT)
BEGIN
    UPDATE conceptos SET descripcion = _descripcion, precio = _precio WHERE id = _codigo;
END //


-- empresas
-- GET
CREATE
    PROCEDURE getEmpresa (IN _idEmpresa INTEGER)
BEGIN
    SELECT id AS 'numEmpresa', nombre, direccion, RFC, telefono, correo FROM empresas WHERE id = _idEmpresa;
END //

CREATE
    PROCEDURE searchEmpresa (IN _query VARCHAR(100))
BEGIN
    SELECT  id AS 'numEmpresa', nombre, direccion, RFC, telefono, correo FROM empresas WHERE nombre LIKE CONCAT('%',_query,'%') OR correo LIKE CONCAT('%',_query,'%') OR RFC LIKE CONCAT('%',_query,'%') ORDER BY nombre ASC;
END //

-- POST
CREATE
    PROCEDURE saveEmpresa(IN _nombre VARCHAR(50), IN _direccion VARCHAR(300), IN _RFC VARCHAR(13), IN _telefono VARCHAR(10), IN _correo VARCHAR(100))
BEGIN
    INSERT INTO empresas (nombre, direccion, RFC, telefono, correo) VALUES (_nombre, _direccion, _RFC, _telefono, _correo);
    SELECT id AS 'numEmpresa', nombre, direccion, RFC, telefono, correo FROM empresas ORDER BY id DESC LIMIT 1;
END //

-- errores
-- GET
CREATE
    PROCEDURE listarerrores (IN _fecha DATE, IN _page INTEGER)
BEGIN
    DECLARE _inicio INTEGER;
    SET _inicio = _page * 20;

    SELECT * FROM errores WHERE fecha > _fecha AND fecha < ADDDATE(_fecha, INTERVAL 1 day) LIMIT _inicio, 20;
END //

-- POST
CREATE
    PROCEDURE saveError (IN _mensaje VARCHAR(300), IN _codigo VARCHAR(100), IN _descripcion VARCHAR(500))
BEGIN
    INSERT INTO errores (mensaje, codigo, descripcion) VALUES (_mensaje, _codigo, _descripcion);
    SELECT * FROM errores ORDER BY id DESC LIMIT 1;
END //