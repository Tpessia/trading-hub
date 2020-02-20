export const initialCode = 
`server.off('data').on('data', (data) => {
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

server.off('error').on('error', (result) => {
    console.error(result)
})

server.off('warning').on('warning', (result) => {
    console.warn(result)
})

server.off('end').on('end', (result) => {
    setState(state => ({ result }))

    console.log(result)
})`