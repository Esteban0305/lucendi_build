createApp({
  data() {
    return {
      ...superData,
      buscador: '',
      page : 0,
      resultados: []
    }
  },
  methods: {
    ...superMethods,
    searchCotizaciones() {
      fetch(this.api + 'cotizacion/find/?q=' + this.buscador + '&page=' + this.page)
      .then( data => data.json())
      .then( json => {
        if (json.success) {
          this.resultados = json.data;
        } else {
          alert(json.message);
        }
      })
      .catch( err => {
        alert(err);
      });
    },
    showCotizacion(id) {
      location.href = '/cotizaciones/show/?id=' + id
    }
  },
  createdd: superCreated,
  mounted() {
    fetch(this.api + 'cotizacion/find/?q=' + this.buscador + '&page=' + this.page)
      .then( data => data.json())
      .then( json => {
        if (json.success) {
          this.resultados = json.data;
        } else {
          this.error = json.error
        }
      })
      .catch( err => {
        this.error = {
          code: 500,
          message: err,
          userMessage: 'Ocurrió un error inesperado'
        }
      })
      .finally( () => this.loading = false);
  }
}).mount('#listCotizaciones');