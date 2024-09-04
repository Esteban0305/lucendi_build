createApp({
  data() {
    return {
      ...superData,
      page: 0,
      resultados: []
    }
  },
  methods: {
    ...superMethods,
    searchOrdenes() {
      fetch(this.api + 'ordenVenta/?page=' + this.page)
      .then( data => data.json())
      .then( json => {
        console.log(json);
        if (json.sucess) {
          this.resultados = json.data;
        } else {
          alert(json.message);
        }
      });
    },
    showOrden(id) {
      location.href = '/ordenVenta/show/?id=' + id;
    }
  },
  created: superCreated,
  mounted() {
    fetch(this.api + 'ordenVenta/find/?page=0')
      .then( data => data.json())
      .then( json => {
        console.log(json);
        if (json.success) {
          this.resultados = json.data;
        } else {
          this.error = json.error;
        }
      })
      .catch( err => {
        this.error = {
          code: 500,
          message: err,
          userMessage: 'Ocurrió un error inesperado'
        }
      })
      .finally( () => {
        this.loading = false;
      });
  }
}).mount('#listOrdenes');