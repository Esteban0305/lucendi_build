createApp({
  data() {
    return {
      ...superData,
      buscador: '',
      resultados: []
    }
  },
  methods: {
    ...superMethods,
    searchEmpresa() {
      this.loading = true;
      this.error = this.restoreError();
      fetch(this.api + 'empresa/find/' + this.buscador)
      .then( data => data.json())
      .then( json => {
        if (json.success) {
          this.resultados = json.data;
        } else {
          this.error = json.error;
        }
      })
      .catch( (err) => {
        this.error = {
          code: 500,
          userMessage: 'Ocurrió un error inesperado',
          message: err
        }
      })
      .finally( () => {
        this.loading = false;
      });
    },
    
    editEmpresa(id) {
      location.href = '/empresas/show/?id=' + id;
    }
  },
  mounted() {
    this.loading = false;
  }
}).mount('#listEmpresas');