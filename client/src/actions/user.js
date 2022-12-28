import api from 'utils/api';
import setAuthToken from 'utils/setAuthToken';

export const getUser = async ( account, error, next ) => {
    try {
        const res = await api.get(`/users/${account}`);
        next(res.data);
    } catch (err) {
        console.log(err.message);
        error(err.message);
    }
};

export const register = async ( account, error, next ) => {
    try {
        const res = await api.post('/users/register', { account });
        next(res.data);
    } catch (err) {
        console.log(err.message);
        error(err.message);
    }
};

export const authenticate = async ( data, error, next ) => {
    try {
        const res = await api.post('/auth', data);
        next(res.data.token);
    } catch (err) {
        console.log(err.message);
        error(err.message);
    }
};

export const loadUser = async ( callback ) => {
    try {
        const res = await api.get('/auth');
        callback( res.data );
    } catch (err) {
        console.log(err.message);
        logout();
    }
};

export const logout = () => {
    setAuthToken(null);
}