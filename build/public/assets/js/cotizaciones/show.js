createApp({
  data() {
    return {
      ...superData,
      cotizacion: {
        id: 0,
        fecha: 'mar 4 de jun de 2024',
        cliente: {},
        conceptos: new Map(),
        retencionISR: -1,
        retencionIVA: false,
        entrega: '',
        observaciones: '',
        subtotal: 0,
        retencionISR: -1,
        IVA: 0,
        ISR: 0,
      },
    }
  },
  methods: {
    ...superMethods,
    archive() {
      fetch(this.api + 'cotizacion/' + this.cotizacion.id, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          archivada: true
        })
      })
      .then( (data) => data.json())
      .then( (json) => {
        if (json.success) {
          console.log(json.data);
        } else {
          alert(json.message);
        }
      })
      .catch( err => {
        alert(err);
      });
    },
    update() {
      location.href = '/cotizaciones/update/?id=' + this.cotizacion.id;
    },
    ordenDeVenta() {
      fetch(this.api + 'ordenVenta/' + this.cotizacion.id, {
        method: 'POST'
      })
      .then( (data) => data.json())
      .then( (json) => {
        if (json.success) {
          location.href = '/ordenVenta/show/?id=' + json.data._id
        } else {
          alert(json.message);
        }
      })
      .catch( err => {
        alert(err);
      });
    }
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
    
    fetch(this.api + 'cotizacion/' + this.params.id)
      .then( data => data.json())
      .then( json => {
        if (json.success) {
          this.cotizacion = json.data;
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
}).mount('#app');