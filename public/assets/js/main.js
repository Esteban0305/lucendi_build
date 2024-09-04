const {createApp} = Vue;

const superData = {
  api: 'http://localhost:3000/api/',
  error: {
    code: 200,
    message: '',
    userMessage: ''
  },
  params: {},
  loading: true,
};

const superMethods = {
  money(money) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(money);
  },
  restoreError() {
    return {
      code: 200,
      message: '',
      userMessage: ''
    }
  }
}

const superCreated = () => {
  const params = new URLSearchParams(location.search);
    
  params.forEach((v, k) => {
    superData.params[k] = v;
  });
}