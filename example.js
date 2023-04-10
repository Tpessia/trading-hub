loadScript('https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.6.0/math.min.js')

console.print('Start')

server.on('data', (data) => {
    let size = Math.floor(data.status.balance / data.data.data.close);
    if (data.status.balance === 100000) size = size / 2;
    
    /*
    console.print(data.data.data.date);
    console.print(data.data.ticker);
    console.print(data.status.portfolio);
    console.print(size);
    console.print(data.status.balance);
    */
    
    let emited = false;
    
    if (
        (data.data.ticker === 'IVVB11' && data.status.portfolio['IVVB11'].size === 0)
        ||
        (data.data.ticker === 'BOVA11' && data.status.portfolio['BOVA11'].size === 0)
    ) {
        server.emit('action', {
            type: 'buy',
            size: size
        });
        emited = true;
    }
    
    const sellDate = new Date(data.data.data.date).getTime() > new Date(2021, 8, 10).getTime();
    const position = data.status.portfolio['IVVB11'].size || data.status.portfolio['BOVA11'].size;
    
    if (sellDate && position) {
        server.emit('action', {
            type: 'sell',
            size: position
        });
    }
    
    if (!emited) {
        server.emit('action', {
            type: null,
            size: null
        });
    }
})

server.on('result', (result) => { console.print(result); })

server.on('warning', (result) => { console.print(result); })

server.on('fail', (result) => { console.print(result); })