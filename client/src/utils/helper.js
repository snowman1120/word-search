export const  numberWithCommas = (x) => {
    if(!x) return ''
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const convertRegularNumber10 = (number) => {
    if(number < 10) return '0' + number;
    return number;
}

export const convertSeconds2DHMS = (time) => {
    let remainSeconds = time;
    let days = Math.floor(remainSeconds / 86400);
    remainSeconds = remainSeconds - days * 86400;
    let hours = Math.floor(remainSeconds / 3600);
    remainSeconds = remainSeconds - hours * 3600;
    let minutes = Math.floor(remainSeconds / 60);
    let seconds = remainSeconds - minutes * 60;

    days = convertRegularNumber10(days);
    hours = convertRegularNumber10(hours);
    minutes = convertRegularNumber10(minutes);
    seconds = convertRegularNumber10(seconds);
    
    return {
        days, hours, minutes, seconds
    }
}

export const mile2km = (mile) => {
    return 1.609344 * mile;
}

export function getPosElement(el, mode = "default") {
    if(!el) return null;
    const rect = el.getBoundingClientRect();

    if(mode === 'default')
        return {
            x: rect.left,
            y: rect.top
        }
    if(mode === 'center')
        return {
            x: rect.left + window.scrollX + rect.width / 2,
            y: rect.top + window.scrollY + rect.height / 2,
        }
};


export function drawLine(ctx, begin, end, stroke = 'black', width = 1) {
    if (stroke) {
        ctx.strokeStyle = stroke;
    }

    if (width) {
        ctx.lineWidth = width;
    }

    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(...begin);
    ctx.lineTo(...end);
    ctx.stroke();
}

export function reverseString(str) {
    var newString = "";

    for (var i = str.length - 1; i >= 0; i--) { 
        newString += str[i]; 
    }
    return newString; 
}

export const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
};