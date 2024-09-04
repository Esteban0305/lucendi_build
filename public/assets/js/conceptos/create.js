createApp({
  data() {
    return {
      ...superData,
      concepto: {
        _id: -1,
        descripcion: '',
        precio: 0,
        descontinuado: false,
        cantidad: 1,
        descuento: 0,
        total: 0
      }
    }
  },
  methods: {
    ...superMethods,
    createConcepto() {
      fetch(this.api + 'concepto/', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          descripcion: this.concepto.descripcion,
          precio: this.concepto.precio
        })
      })
      .then( (data) => data.json())
      .then( json => {
        if (json.success) {
          this.concepto._id = json.data._id;
          this.concepto.total = this.concepto.precio;
          if (localStorage.getItem('ls-cotizacion')) {
            const cotizacion = JSON.parse(localStorage.getItem('ls-cotizacion'));
            cotizacion.conceptos.push({
              cantidad: 1,
              total: this.concepto.precio,
              concepto: {
                _id: this.concepto._id,
                descripcion: this.concepto.descripcion,
                codigo: json.data.codigo,
                precio: this.concepto.precio
              }
            });
            
            localStorage.setItem('ls-cotizacion', JSON.stringify(cotizacion));
            if (cotizacion.id != 0) {
              location.href = '/cotizaciones/show/?id=' + cotizacion.id;
            } else {
              location.href = '/cotizaciones/create/';
            }
          }
        }
      });
    },
    updateConcepto() {
      fetch(this.api + 'concepto/' + this.concepto._id, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          descripcion: this.concepto.descripcion,
          precio: this.concepto.precio
        })
      })
      .then( (data) => data.json())
      .then( json => {
        if (json.success) {
          console.log(json);
          this.concepto._id = json.data._id;
          this.concepto.total = this.concepto.precio;
          if (localStorage.getItem('ls-cotizacion')) {
            const cotizacion = JSON.parse(localStorage.getItem('ls-cotizacion'));
            let inArray = false;
            
            for (let i = 0; i < cotizacion.conceptos.length; i++) {
              if (cotizacion.conceptos[i].concepto._id = this.concepto._id) {
                const cantidad = cotizacion.conceptos[i].cantidad;
                const concepto = {
                  concepto: {
                    precio: this.concepto.precio,
                    descripcion: this.concepto.descripcion,
                    codigo: json.data.codigo,
                    _id: this.concepto._id
                  },
                  cantidad: cantidad,
                  total: this.concepto.precio
                }
                cotizacion.conceptos[i] = concepto;
                cotizacion.conceptos[i].total = cotizacion.conceptos[i].concepto.precio * cantidad;
              }
            }
            
            if (!inArray) {
              cotizacion.conceptos.push({
                concepto: {
                  precio: this.concepto.precio,
                  descripcion: this.concepto.descripcion,
                  codigo: json.data.codigo,
                  _id: this.concepto._id
                },
                cantidad: 1,
                total: this.concepto.precio
              });
            }
            localStorage.setItem('ls-cotizacion', JSON.stringify(cotizacion));
            
            if (cotizacion.id != 0) {
              location.href = '/cotizaciones/show/?id=' + cotizacion.id;
            } else {
              location.href = '/cotizaciones/create/';
            }
          } else {
            location.href = '/conceptos/';
          }
        }
      });
    }
  },
  computed: {
    validConcepto() {
      return this.concepto.descripcion.trim() == ''
    }
  },
  mounted() {
    if (new URL(location.href).searchParams.getAll('id').length > 0) {
      const id = new URL(location.href).searchParams.getAll('id')[0];
      fetch(this.api + 'concepto/' + id)
      .then( data => data.json())
      .then( (json) => {
        if (json.success) {
          console.log(json.data);
          this.concepto = {...json.data, total: json.data.precio, cantidad: 1}
        } else {
          alert(json.message);
        }
      });
    }
  }
}).mount('#app');