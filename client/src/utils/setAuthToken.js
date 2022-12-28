import api from './api';

// store our JWT in LS and set axios headers if we do have a token

const setAuthToken = (metaAccount) => {
  if (metaAccount) {
    api.defaults.headers.common['x-auth-token'] = metaAccount;
    localStorage.setItem('metaAccount', metaAccount);
  } else {
    delete api.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('metaAccount');
  }
};

export default setAuthToken;
