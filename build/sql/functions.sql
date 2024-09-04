delimiter //

CREATE
    FUNCTION subtotal (idCotizacion INTEGER)
    RETURNS DOUBLE
    READS SQL DATA
BEGIN
    DECLARE sub double;
    SET sub = (SELECT SUM(conceptos.precio * cotizaciones_conceptos.cantidad) FROM cotizaciones_conceptos INNER JOIN conceptos ON cotizaciones_conceptos.concepto = conceptos.id WHERE cotizaciones_conceptos.cotizacion = idCotizacion);
RETURN sub;
END //

CREATE
    FUNCTION iva (subtotal FLOAT)
    RETURNS FLOAT
    READS SQL DATA
BEGIN
    RETURN subtotal * 0.16;
END //

CREATE
    FUNCTION isr (isr_isr FLOAT, subtotal_isr FLOAT)
    RETURNS FLOAT
    READS SQL DATA
BEGIN
    IF (isr_isr > -1) THEN
      RETURN subtotal_isr * (isr_isr / 100);
END IF;
    RETURN 0;
END
