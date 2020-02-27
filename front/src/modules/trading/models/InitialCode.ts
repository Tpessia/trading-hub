export const initialCode = 
`loadScript('https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.6.0/math.min.js')

console.print('Start')

server.on('data', (data) => {
    const rnd = math.randomInt(0, 10)

    if (rnd > 4)
        server.emit('action', {
            type: 'buy',
            size: 100
        })
    else
        server.emit('action', {
            type: 'sell',
            size: 100
        })
})

server.on('result', (result) => { })

server.on('warning', (result) => { })

server.on('fail', (result) => { })`