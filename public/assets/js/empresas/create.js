createApp({
  data() {
    return {
      ...superData,
      empresa: {
        id: 0,
        nombre: '',
        direccion: '',
        RFC: '',
        correo: '',
        telefono: ''
      }
    }
  },
  methods: {
    ...superMethods,
    createEmpresa() {
      fetch(this.api + 'empresa/', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(this.empresa)
      })
      .then( data => data.json())
      .then( json => {
        console.log(json);
        if (json.success) {
          if (localStorage.getItem('ls-cliente')) {
            const cliente = JSON.parse(localStorage.getItem('ls-cliente'));
            cliente.empresa = json.data;
            localStorage.setItem('ls-cliente', JSON.stringify(cliente));
            if (cliente._id != -1) {
              location.href = '/clientes/show/?id?' + cliente._id; 
            } else {
              location.href = '/clientes/create/';
            }
          } else {
            location.href = '/empresas/'; 
          }
        }
      })
    },
    updateEmpresa() {
      fetch(this.api + 'empresa/' + this.empresa._id, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(this.empresa)
      })
      .then( data => data.json())
      .then( json => {
        console.log(json);
        if (json.success) {
          if (localStorage.getItem('ls-cliente')) {
            const cliente = JSON.parse(localStorage.getItem('ls-cliente'));
            cliente.empresa = json.data;
            localStorage.setItem('ls-cliente', JSON.stringify(cliente));
            if (cliente.id != -1) {
              location.href = '/clientes/show/?id?' + cliente.id; 
            } else {
              location.href = '/clientes/create/';
            }
          } else {
            location.href = '/empresas/'; 
          }
        }
      })
    }
  },
  computed: {
    isValid() {
      return this.empresa.nombre.trim() == '';
    }
  },
  created: superCreated(),
  mounted() {
    if (!this.params.id) {
      this.loading = false;
      return this.error = {
        code: 403,
        message: 'ID no definido',
        userMessage: 'Ocurrió un error inesperado'
      }
    }
    
    fetch(this.api + 'empresa/' + this.params.id)
    .then( data => data.json())
    .then( (json) => {
      if (json.success) {
        this.empresa = json.data
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
}).mount('#app');