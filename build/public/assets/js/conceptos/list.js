createApp({
  data() {
    return {
      ...superData,
      buscador: '',
      resultados: []
    }
  },
  methods: {
    searchConcepto() {
      fetch(this.api + 'concepto/find/' + this.buscador)
      .then( data => data.json())
      .then( json => {
        // console.log(json);
        if (json.success) {
          this.resultados = json.data;
        } else {
          alert(json.message);
        }
      })
      .catch(err => {
        alert(err);
      }); 
    },
    showConcepto(id) {
      location.href = '/conceptos/show/?id=' + id;
    }
  }
}).mount('#listConceptos');