createApp({
  data() {
    return {
      ...superData,
      cotizacion: {
        id: 0,
        fecha: 'mar 4 de jun de 2024',
        cliente: null,
        conceptos: new Map(),
        retencionISR: -1,
        retencionIVA: false,
        entrega: {
          dias: '3D',
          entr: 'ROC'
        },
        observaciones: ''
      },
      buscadores: {
        cliente: '',
        concepto: ''
      },
      resultados: {
        clientes: [],
        conceptos: []
      },
      tab: 0,
      tabs: ['tab-data-clientes', 'tab-data-conceptos', 'tab-data-miscelaneos', 'tab-data-checkout'],
    }
  },
  methods: {
    ...superMethods,
    prevTab() {
      if (this.tab > 0) {
        this.tab--;
        const triggerEl = document.querySelector('a[href="#' + this.tabs[this.tab] + '"]');
        const tabTrigger = new bootstrap.Tab(triggerEl);
        tabTrigger.show();
      }
      
      if (this.tab == 0) {
        document.querySelector('#prev-tab').setAttribute('disabled', true);
      } else {
        document.querySelector('#next-tab').removeAttribute('disabled');
      }
    },
    nextTab() {
      if (this.tab < this.tabs.length - 1) {
        this.tab++;
        const triggerEl = document.querySelector('a[href="#' + this.tabs[this.tab] + '"]');
        const tabTrigger = new bootstrap.Tab(triggerEl);
        tabTrigger.show();
      }
      if (this.tab >= this.tabs.length - 1) {
        document.querySelector('#next-tab').setAttribute('disabled', true);
      } else {
        document.querySelector('#prev-tab').removeAttribute('disabled');
      }
    },
    
    createCliente() {
      this.toStorage();
      location.href = '/clientes/create/';
    },
    updateCliente(id) {
      this.toStorage();
      location.href = '/clientes/show/?id=' + id;
    },
    searchCliente() {
      fetch(this.api + 'cliente/find/' + this.buscadores.cliente, {
        'method': 'GET',
        'mode': 'cors'
      }).then( (data) => {
        return data.json();
      }).then( (json) => {
        console.log(json);
        if (json.success) {
          this.resultados.clientes = json.data;
        } else {
          console.error(json.message);
        }
      });
    },
    selectCliente(id) {
      fetch(this.api + 'cliente/' + id, {
        method: 'GET',
        mode: 'cors'
      }).then(data => data.json())
      .then( json => {
        if (json.success) {
          console.log(json);
          this.cotizacion.cliente = json.data;
        } else {
          console.error(json.message);
        }
      })
    },
    changeCliente() {
      this.cotizacion.cliente = null;
    },
    
    createConcepto() {
      this.toStorage();
      location.href = '/conceptos/create/';
    },
    updateConcepto(id) {
      this.toStorage();
      location.href = '/conceptos/show/?id=' + id;
    },
    searchConcepto() {
      fetch(this.api + 'concepto/find/' + this.buscadores.concepto, {
        'method': 'GET',
        'mode': 'cors'
      }).then( (data) => {
        return data.json();
      }).then( (json) => {
        if (json.success) {
          this.resultados.conceptos = json.data;
        } else {
          console.error(json.message);
        }
      });
    },
    selectConcepto(id) {
      fetch(this.api + 'concepto/' + id, {
        'method': 'GET',
        'mode': 'cors'
      }).then( (data) => {
        return data.json();
      }).then( (json) => {
        if (json.success) {
          if (this.cotizacion.conceptos.has(json.data._id)) {
            const c = this.cotizacion.conceptos.get(json.data._id);
            c.total += json.data.precio;
            c.cantidad += 1;
            this.cotizacion.conceptos.set(json.data._id, c);
          } else {
            this.cotizacion.conceptos.set(json.data._id, {concepto:{...json.data}, cantidad: 1, total: json.data.precio, id: json.data._id});
          }
        } else {
          console.error(json.message);
        }
      })
      .catch( (err) => {
        console.error(err);
      });
    },
    removeConcepto(id) {
      this.cotizacion.conceptos.delete(id);
    },
    addOneConcepto(id) {
      if (this.cotizacion.conceptos.has(id)) {
        const c = this.cotizacion.conceptos.get(id);
        c.total += c.concepto.precio;
        c.cantidad += 1;
        this.cotizacion.conceptos.set(id, c);
      }
    },
    removeOneConcepto(id) {
      if (this.cotizacion.conceptos.has(id)) {
        const c = this.cotizacion.conceptos.get(id);
        c.total -= c.concepto.precio;
        c.cantidad -= 1;
        this.cotizacion.conceptos.set(id, c);
        if (c.cantidad == 0) {
          this.removeConcepto(id);
        }
      }
    },
    
    guardar() {
      const cotizacion = this.cotizacion;
      const send = {
        cliente : cotizacion.cliente._id,
        conceptos : [],
        retencionISR: cotizacion.retencionISR,
        retencionIVA: cotizacion.retencionIVA,
        observaciones: cotizacion.observaciones,
        _entrega: cotizacion.entrega.dias + ',' + cotizacion.entrega.entr
      };
      
      cotizacion.conceptos.forEach( (concepto) => {
        send.conceptos.push({
          concepto: concepto.concepto._id,
          cantidad: concepto.cantidad
        });
      });
      
      console.log(JSON.stringify(send, null, 2));
      
      fetch(this.api + 'cotizacion/', {
        'method': 'POST',
        'headers': {
          'content-type': 'application/json',
        },
        'mode': 'cors',
        'body': JSON.stringify(send)
      }).then( (data) => {
        return data.json();
      }).then( (json) => {
        if (json.success) {
          console.log(json.data);
          const url = this.api + 'cotizacion/print/' + json.data.id;
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.target = '_blank'
          a.download = 'Cotizacion ' + json.data.id + '.pdf';
          document.body.appendChild(a);
          a.click();
          location.href = '/cotizaciones/'
        } else {
          alert.error(json.message);
        }
      });
    },
    
    toStorage() {
      const cotizacion = {
        id: this.cotizacion.id,
        fecha: this.cotizacion.fecha,
        cliente: this.cotizacion.cliente,
        conceptos: Array.from(this.cotizacion.conceptos.values()),
        retencionISR: this.cotizacion.retencionISR,
        retencionIVA: this.cotizacion.retencionIVA,
        entrega: this.cotizacion.entrega,
        observaciones: this.cotizacion.observaciones
      }
      
      localStorage.setItem('ls-cotizacion', JSON.stringify(cotizacion));
      localStorage.setItem('ls-cotizacion-tab', this.tab - 1);
    },
    fromStorage() {
      const cotizacion = JSON.parse(localStorage.getItem('ls-cotizacion'));
      const tab = parseInt(localStorage.getItem('ls-cotizacion-tab'));
      localStorage.removeItem('ls-cotizacion');
      localStorage.removeItem('ls-cotizacion-tab');
      if (cotizacion) {
        const conceptos = cotizacion.conceptos;
        cotizacion.conceptos = new Map();
        conceptos.forEach( concepto => {
          cotizacion.conceptos.set(concepto.id, concepto);
        });
        
        this.cotizacion = cotizacion;
      }
      
      if (tab >= 0) {
        console.log(tab);
        this.tab = tab;
        this.nextTab();
      }
    }
  },
  computed: {
    productos() {
      let cant = 0;
      
      this.cotizacion.conceptos.forEach( (concepto) => {
        cant += concepto.cantidad;
      });
      
      return cant;
    },
    subtotal() {
      let sub = 0;
      
      this.cotizacion.conceptos.forEach( (concepto) => {
        sub += concepto.total;
      });
      
      return sub;
    },
    IVA() {
      return this.subtotal * 0.16;
    },
    retencionIVA() {
      if (this.cotizacion.retencionIVA) {
        return -this.IVA;
      }
      return 0;
    },
    ISR() {
      if (this.cotizacion.retencionISR == '-1') {
        return false;
      }
      return -(this.subtotal * (this.cotizacion.retencionISR / 100));
    },
    total() {
      return this.subtotal + this.IVA + this.retencionIVA + this.ISR;
    }
  },
}).mount('#app');