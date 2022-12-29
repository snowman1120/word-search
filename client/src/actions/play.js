import api from '../utils/api';

export const getWords = async (error, callback) => {
    try {
        const res = await api.get('/word');
        callback(res.data);
    } catch (err) {
        console.log(err.message);
        error(err.message);
        callback([]);
    }

    // try {
    //     const res = await api.get('/word/test');
    //     callback(res.data);
    // } catch (err) {
    //     console.log(err.message);
    //     error(err.message);
    //     callback([]);
    // }
};

export const startPlay = async ( error, callback ) => {
    try {
        const res = await api.post('/play/start');
        callback(res.data);
    } catch (err) {
        console.log(err.message);
        error(err.message);
    }
}
export const endPlay = async ( error, playId, callback ) => {
    try {
        const res = await api.post('/play/end', {id: playId});
        callback(res.data);
    } catch (err) {
        console.log(err.message);
        error(err.message);
    }
}

export const getPlays = async (error, callback) => {
    try {
        const res = await api.get('/play');
        callback(res.data);
    } catch(err) {
        console.log(err.message);
        error(err.message);
    }
}