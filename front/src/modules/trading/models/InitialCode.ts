export const initialCode = 
`server.on('data', (data) => {
    setState(state => ({
        tradingData: [...state.tradingData, data]
    }))

    console.log(data)

    const rnd = Math.floor(Math.random() * 10)

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

server.on('error', (result) => {
    console.error(result)
})

server.on('warning', (result) => {
    console.warn(result)
})

server.on('result', (result) => {
    setState(state => ({ result }))

    console.log(result)
})`