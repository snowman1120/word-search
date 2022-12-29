import api from '../utils/api';

export const getWords = async (callback) => {
    // try {
    //     const res = await api.get('/word');
    //     callback(res.data);
    // } catch (err) {
    //     console.log(err.message);
    //     callback([]);
    // }

    try {
        const res = await api.get('/word/test');
        callback(res.data);
    } catch (err) {
        console.log(err.message);
        callback([]);
    }
};

export const startPlay = async ( callback ) => {
    try {
        const res = await api.post('/play/start');
        callback(res.data);
    } catch (err) {
        console.log(err.message);
    }
}
export const endPlay = async ( playId, callback ) => {
    try {
        const res = await api.post('/play/end', {id: playId});
    } catch (err) {
        console.log(err.message);
    }
}