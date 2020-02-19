import React from 'react';
import io from 'socket.io-client';

interface Props {

}

interface State {
    server: SocketIOClient.Socket | null,
    messages: (string | number)[]
}

export default class Trading extends React.Component<Props, State> {
    state: State = {
        server: null,
        messages: []
    }

    componentDidUpdate() {
        this.state.server?.off('next-data').on('next-data', (msg: number) => {
            this.setState(state => ({
                messages: [...state.messages, msg]
            }))

            this.state.server?.emit('next-action', 'buy')
        })

        this.state.server?.off('end').on('end', (msg: string) => {
            this.setState(state => ({
                messages: [...state.messages, msg]
            }))
        })
    }

    connect() {
        if (!this.state.server)
            this.setState({
                server: io('ws://localhost:3001/trading')
            })
        else
            console.warn('Server already connected!')
    }

    disconnect() {
        if (this.state.server) {
            this.state.server.disconnect()
            this.setState({
                server: null,
                messages: []
            })
        } else {
            console.warn('No connection found!')
        }
    }

    start() {
        if (this.state.server) {
            this.setState({
                messages: []
            })
            this.state.server.emit('start', 'teste')
        } else {
            console.warn('No connection found!')
        }
    }

    render() {
        const list = this.state.messages.map((e,i) => <li key={i}>{e}</li>)
        return (
            <>
                <button disabled={!!this.state.server} onClick={() => this.connect()}>Connect</button>
                <button disabled={!this.state.server} onClick={() => this.start()}>Start</button>
                <button disabled={!this.state.server} onClick={() => this.disconnect()}>Disconnect</button>
                <ul>
                    {list}
                </ul>
            </>
        );
    }
}