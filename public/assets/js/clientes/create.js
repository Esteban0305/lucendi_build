createApp({
  data() {
    return {
      ...superData,
      buscadores: {
        empresa: ''
      },
      cliente: {
        id: -1,
        nombre: '',
        RFC: '',
        correo: '',
        telefono: '',
        direccion: '',
        empresa_id: null
      },
      resultados: {
        empresa: [],
      }
    }
  },
  methods: {
    createCliente() {
      const data = Object.assign({},this.cliente);
      
      if (data.empresa_id) {
        data.empresa_id = data.empresa_id._id;
      }

      fetch(this.api + 'cliente/', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then( data => data.json())
      .then( json => {
        if (json.success) {
          this.cliente.id = json.data.id;
          if (localStorage.getItem('ls-cotizacion') != null) {
            const cotizacion = JSON.parse(localStorage.getItem('ls-cotizacion'));
            cotizacion.cliente = this.cliente;
            localStorage.setItem('ls-cotizacion', JSON.stringify(cotizacion));
            if (cotizacion.id != 0) {
              location.href = '/cotizaciones/show/?id=' + cotizacion.id;
            } else {
              location.href = '/cotizaciones/create/';
            }
          } else {
            location.href = '/clientes/';
          }
        }
      });
    },
    
    createEmpresa() {
      localStorage.setItem('ls-cliente', JSON.stringify(this.cliente));
      location.href = '/empresas/create/';
    },
    updateEmpresa(id) {
      localStorage.setItem('ls-cliente', JSON.stringify(this.cliente));
      location.href = '/empresas/show/?id=' + id;
    },
    changeEmpresa() {
      this.cliente.empresa_id = null;
    },
    selectEmpresa(id) {
      fetch(this.api + 'empresa/' + id)
      .then( (data) => data.json())
      .then( (json) => {
        if (json.success) {
          this.cliente.empresa_id = json.data;
          this.resultados.empresa = [];
          this.buscadores.empresa = '';
        }
      })
    },
    searchEmpresa() {
      fetch(this.api + 'empresa/find/' + this.buscadores.empresa)
      .then( (data) => data.json())
      .then( (json) => {
        console.log(json);
        if (json.success) {
          this.resultados.empresa = json.data;
        }
      })
    }
  },
  computed: {
    dataComplete() {
      return this.cliente.nombre.trim() == '';
    }
  },
  mounted() {
    if (localStorage.getItem('ls-cliente')) {
      this.cliente = JSON.parse(localStorage.getItem('ls-cliente'));
      localStorage.removeItem('ls-cliente');
      this.loading = false;
      return 0;
    }
  }
}).mount('#app');