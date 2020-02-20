import React from 'react';
import io from 'socket.io-client';
import IClientResult from '../models/dtos/IClientResult';
import IStockData from '../models/dtos/IStockData';
import ITradingData from "../models/dtos/ITradingData";
import ITradingStart from '../models/dtos/ITradingStart';
import { initialCode } from '../models/InitialCode';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

interface Props {

}

interface State {
    ticker: string,
    start: string,
    end: string,
    balance: number,
    code: string,
    tradingData: ITradingData<IStockData>[],
    server: SocketIOClient.Socket | null,
    result: IClientResult<IStockData> | null,
}

export default class Trading extends React.Component<Props, State> {
    state: State = {
        ticker: 'PETR4',
        start: '2020-02-01T00:00:00',
        end: '2020-02-17T00:00:00',
        balance: 100000,
        code: initialCode,
        server: null,
        tradingData: [],
        result: null
    }

    readonly gateway = 'ws://localhost:3001/trading'

    componentDidUpdate() {
        (window as any).server = this.state.server;
        (window as any).setState = this.setState.bind(this);
        // this.state.server?.off('data').on('data', (data: IStockData) => {
        //     this.setState(state => ({
        //         tradingData: [...state.tradingData, data]
        //     }))

        //     this.state.server?.emit('action', 'buy')
        // })

        // this.state.server?.off('end').on('end', (result: ITradingResult) => {
        //     this.setState(state => ({ result }))
        // })
    }

    connect() {
        if (!this.state.server)
            this.setState({
                server: io(this.gateway)
            })
        else
            console.warn('Server already connected!')
    }

    disconnect() {
        if (this.state.server) {
            this.state.server.disconnect()
            this.setState({
                server: null,
                tradingData: []
            })
        } else {
            console.warn('No connection found!')
        }
    }

    start() {
        if (this.state.server) {
            this.setState({ tradingData: [] })

            // eslint-disable-next-line
            eval(this.state.code)

            this.state.server.emit('start', {
                tickers: [this.state.ticker],
                balance: 100000,
                start: this.state.start,
                end: this.state.end
            } as ITradingStart)
        } else {
            console.warn('No connection found!')
        }
    }

    handleEditorChange = (value: string, event: any) => {
        this.setState({ code: value })
    }

    render() {
        const list = this.state.tradingData.map((e, i) => <li key={i}>{JSON.stringify(e)}</li>)
        return (
            <>
                <label style={{ 'padding': '0 10px 0 0' }}>Ticker</label>
                <input type="text" value={this.state.ticker} onChange={e => this.setState({ ticker: e.target.value })}/>
                <br />
                <label style={{ 'padding': '0 10px 0 0' }}>Start</label>
                <input type="text" value={this.state.start} onChange={e => this.setState({ start: e.target.value })}/>
                <br />
                <label style={{ 'padding': '0 10px 0 0' }}>End</label>
                <input type="text" value={this.state.end} onChange={e => this.setState({ end: e.target.value })}/>
                <br />
                <label style={{ 'padding': '0 10px 0 0' }}>Balance</label>
                <input type="number" value={this.state.balance} onChange={e => this.setState({ balance: +e.target.value })}/>

                <AceEditor
                    mode="javascript"
                    theme="monokai"
                    value={this.state.code}
                    onChange={this.handleEditorChange}
                    name="code_editor"
                    editorProps={{ $blockScrolling: true }}
                />

                <button disabled={!!this.state.server} onClick={() => this.connect()}>Connect</button>
                <button disabled={!this.state.server} onClick={() => this.start()}>Start</button>
                <button disabled={!this.state.server} onClick={() => this.disconnect()}>Disconnect</button>

                <h3>DATA</h3>

                <ul>
                    {list}
                </ul>

                <h3>RESULT</h3>

                {JSON.stringify(this.state.result)}
            </>
        );
    }
}