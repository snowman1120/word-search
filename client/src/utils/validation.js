export const isEmpty = (value) => {
    if(!value) return true;
    if(typeof value === 'string') {
        if(!value || value.trim() === '') return true;
        return false;
    } else if(typeof value === 'object') {
        return Object.keys(value).every(key => isEmpty(value[key]))
    } 
}