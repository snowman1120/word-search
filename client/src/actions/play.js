import api from '../utils/api';

export const getWords = async (callback) => {
    // try {
    //     const res = await api.get('/word');
    //     callback(res.data);
    // } catch (err) {
    //     console.log(err);
    //     callback([]);
    // }

    try {
        const res = await api.get('/word/test');
        callback(res.data);
    } catch (err) {
        console.log(err);
        callback([]);
    }
};