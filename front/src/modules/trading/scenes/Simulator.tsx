import { Button, Col, Input, Row, Typography } from 'antd';
import React from 'react';
import io from 'socket.io-client';
import CodeEditor from "../../common/components/CodeEditor";
import ConsoleReadOnly from '../../common/components/ConsoleReadOnly';
import InputNumberMask from '../../common/components/InputNumberMask';
import ConfigService from '../../common/services/ConfigService';
import ConsoleService from '../../common/services/ConsoleService';
import IClientResult from '../models/dtos/IClientResult';
import IStockData from '../models/dtos/IStockData';
import ITradingData from "../models/dtos/ITradingData";
import ITradingStart from '../models/dtos/ITradingStart';
import { TradingInputMessage, TradingOutputMessage } from '../models/dtos/TradingMessage';
import { initialCode } from '../models/InitialCode';

const { Title } = Typography

interface Props {

}

interface State {
    data: ITradingStart,
    code: string,
    messages: string[],

    server: SocketIOClient.Socket | null,
    running: boolean,
    tradingData: ITradingData<IStockData>[],
    result: IClientResult<IStockData> | null,
}

export default class Simulator extends React.Component<Props, State> {
    state: State = {
        data: {
            tickers: ['PETR4'],
            start: '2020-02-01T00:00:00',
            end: '2020-02-17T00:00:00',
            balance: 100000
        },
        code: initialCode,
        messages: [],

        server: null,
        running: false,
        tradingData: [],
        result: null
    }

    componentDidUpdate() {
        (window as any).server = this.state.server;
        (window as any).setState = this.setState.bind(this);
    }

    componentWillUnmount() {
        this.state.server?.disconnect()
    }

    handleConnect = () => {
        return new Promise((res,rej) => {
            if (!this.state.server)
                this.setState({
                    server: io(ConfigService.config.wsUrl + 'trading')
                }, res)
            else {
                console.warn('Server already connected!')
                rej()
            }
        })
    }

    handleStart = async () => {
        await this.handleConnect()
        this.state.server?.on(TradingInputMessage.End, this.handleEnd)

        if (this.state.server) {
            this.setState({
                running: true,
                messages: [],
                tradingData: []
            })

            ConsoleService.addCallback('simulator', message => {
                this.setState(state => ({
                    messages: [
                        ...state.messages,
                        JSON.stringify(message)
                    ]
                }))
            })
            ConsoleService.disableConsole()

            // eslint-disable-next-line
            eval(this.state.code)

            this.state.server.emit(TradingOutputMessage.Start, this.state.data)
        } else {
            console.warn('No connection found!')
        }
    }

    handleStop = () => {
        if (this.state.server) {
            this.state.server.emit(TradingOutputMessage.Stop)
        } else {
            console.warn('No connection found!')
        }
    }

    handleEnd = () => {
        ConsoleService.removeCallback('simulator')
        ConsoleService.enableConsole()
        
        this.setState({ running: false })

        if (this.state.server) {
            this.handleDisconnect()
        } else {
            console.warn('No connection found!')
        }
    }

    handleDisconnect = () => {
        if (this.state.server) {
            this.state.server.disconnect()
            this.setState({
                server: null,
                tradingData: [],
                result: null
            })
        } else {
            console.warn('No connection found!')
        }
    }

    updateData(data: Partial<ITradingStart>) {
        this.setState(state => ({
            data: {
                ...state.data,
                ...data
            }
        }))
    }

    handleEditorChange = (value: string, event: any) => {
        this.setState({ code: value })
    }

    render() {
        return (
            <>
                <Title level={1} style={{ paddingTop: '1rem' }}>Simulator</Title>

                <Input.Group style={{ margin: '.7rem 0' }}>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 0 }]}>
                        <Col xs={24} sm={12} md={6}>
                            <Input addonBefore="Ticker" type="text" value={this.state.data.tickers[0]} onChange={e => this.updateData({ tickers: [e.target.value] })} />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <InputNumberMask
                                maskProps={{
                                    prefix: 'R$',
                                    thousandSeparator: '.',
                                    decimalSeparator: ',',
                                    defaultValue: this.state.data.balance,
                                    onValueChange: (values) => this.updateData({ balance: values.floatValue })
                                }}
                                inputProps={{
                                    addonBefore: 'Balance',
                                    type: 'text'
                                }}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Input addonBefore="Start" type="text" value={this.state.data.start} onChange={e => this.updateData({ start: e.target.value })} />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Input addonBefore="End" type="text" value={this.state.data.end} onChange={e => this.updateData({ end: e.target.value })} />
                        </Col>
                    </Row>
                </Input.Group>

                <Row gutter={[{ xs: 0, sm: 0, md: 0, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 0 }]}>
                    <Col xs={24} lg={12}>
                        <CodeEditor
                            defaultValue={this.state.code}
                            value={this.state.code}
                            onChange={this.handleEditorChange}
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <ConsoleReadOnly value={this.state.messages} />
                    </Col>
                </Row>

                <div style={{ margin: '0.7rem -.3rem' }}>
                    <Button style={{ margin: '0 .3rem 0 .3rem' }} disabled={this.state.running} onClick={this.handleStart}>Start</Button>
                    <Button style={{ margin: '0 .3rem 0 .3rem' }} disabled={!this.state.running} onClick={this.handleStop}>Stop</Button>
                </div>
            </>
        );
    }
}
