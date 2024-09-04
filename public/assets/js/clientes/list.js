createApp({
  data() {
    return {
      ...superData,
      buscador: '',
      resultados: []
    }
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    ...superMethods,
    searchCliente() {
      this.loading = true;
      this.error = this.restoreError();
      this.resultados = [];
      fetch(this.api + 'cliente/find/' + this.buscador)
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
      .finally( () => {
        this.loading = false;
      });
    },
    editCliente(id) {
      location.href = '/clientes/show/?id=' + id;
    }
  }
}).mount('#listClientes');