createApp({
  data() {
    return {
      ...superData,
      orden: {
        "_id": 0,
        "folio": 0,
        "cliente": {
          "_id": "",
          "nombre": "",
          "correo": "",
          "telefono": "",
          "RFC": "",
          "direccion": "",
          "empresa_id": null,
        },
        "retencionISR": -1,
        "retencionIVA": false,
        "observaciones": "Sin Observaciones",
        "_entrega": "",
        "conceptos": [],
        "fecha": "",
        "facturada": false,
        "pagada": false,
        "subtotal": 0,
        "IVA": 0,
        "ISR": 0,
        "total": 0,
        "letra": "",
        "fechaReadable": "",
        "fechaPago": "",
        "entrega": ""
      }
    }
  },
  methods: {
    ...superMethods
  },
  created: superCreated,
  mounted() {
    if (!this.params.id) {
      this.error = {
        code: 403,
        message: 'ID no está definido',
        userMessage: 'Ocurrió un error al realizar la petición'
      }
      this.loading = false;
      return 403;
    }
    
    fetch (this.api + 'ordenVenta/' + this.params.id)
    .then( (data) => data.json())
    .then( json => {
      if (json.success) {
        this.orden = json.data;
      } else {
        this.error = json.error;
      }
    })
    .catch( (err) => {
      console.log(err);
      this.error = {
        code: 500,
        message: err.message,
        userMessage: 'Ocurrió un error inesperado'
      };
    })
    .finally( () => {
      this.loading = false;
    });
  }
}).mount('#ordenData');