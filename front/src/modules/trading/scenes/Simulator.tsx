import { Button, Col, Input, Row, Typography } from 'antd';
import React from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import io from 'socket.io-client';
import CodeEditor from "../../common/components/CodeEditor";
import ConsoleReadOnly from '../../common/components/ConsoleReadOnly';
import InputMask from '../../common/components/InputMask';
import InputNumberMask from '../../common/components/InputNumberMask';
import ConfigService from '../../common/services/ConfigService';
import ConsoleService from '../../common/services/ConsoleService';
import { getFirstOfYear, getIsoString, getDateOnly } from '../../common/utils/date.utils';
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
    statusData: ITradingData<IStockData>['status'][],
    result: IClientResult<IStockData> | null,
}

export default class Simulator extends React.Component<Props, State> {
    state: State = {
        data: {
            tickers: ['PETR4'],
            start: getIsoString(getFirstOfYear(new Date())),
            end: getIsoString(getDateOnly(new Date())),
            balance: 100000
        },
        code: initialCode,
        messages: [],

        server: null,
        running: false,
        statusData: [],
        result: null
    }

    get progressPercent() {
        if (this.state.statusData.length === 0) return 0

        const statusData = this.state.statusData
        const progress = statusData[statusData.length - 1].progress

        const percent = (progress.current / progress.total) * 100
        return +percent.toFixed(0)
    }

    //#region Lifecycle

    componentDidUpdate() {
        (window as any).server = this.state.server
    }

    componentWillUnmount() {
        this.state.server?.disconnect()
    }

    //#endregion

    //#region Handlers

    handleConnect = () => {
        return new Promise((res, rej) => {
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

        if (this.state.server) {
            this.bindEvents()

            this.setState({
                running: true,
                messages: [],
                statusData: [],
                result: null
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
            this.setState({ server: null })
        } else {
            console.warn('No connection found!')
        }
    }

    handleEditorChange = (value: string, event: any) => {
        this.setState({ code: value })
    }

    //#endregion

    //#region Helpers

    updateData(data: Partial<ITradingStart>) {
        this.setState(state => ({
            data: {
                ...state.data,
                ...data
            }
        }))
    }

    bindEvents() {
        if (!this.state.server) return

        const server = this.state.server

        server.off(TradingInputMessage.Data).on(TradingInputMessage.Data, (data: ITradingData<IStockData>) => {
            this.setState(state => ({
                statusData: [...state.statusData, data.status]
            }))
        })

        server.off(TradingInputMessage.End).on(TradingInputMessage.End, this.handleEnd)

        server.off(TradingInputMessage.Result)
            .on(TradingInputMessage.Result, (result: IClientResult<IStockData>) => {
                this.setState({ result })
            })
    }

    //#endregion

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
                                    prefix: 'R$', thousandSeparator: '.', decimalSeparator: ',',
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
                            <InputMask
                                maskProps={{
                                    mask: '9999-99-99T99:99:99',
                                    value: this.state.data.start,
                                    onChange: e => this.updateData({ start: e.target.value })
                                }}
                                inputProps={{
                                    addonBefore: 'Start',
                                    type: 'text',
                                }}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <InputMask
                                maskProps={{
                                    mask: '9999-99-99T99:99:99',
                                    value: this.state.data.end,
                                    onChange: e => this.updateData({ end: e.target.value })
                                }}
                                inputProps={{
                                    addonBefore: 'End',
                                    type: 'text',
                                }}
                            />
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
                        <Row>
                            <Col xs={24}>
                                <div
                                    className="well-dark"
                                    style={{ height: '245px', marginBottom: '5px', display: 'flex' }}
                                >
                                    {this.state.running ? (
                                        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                            <div style={{ width: '150px' }}>
                                                <CircularProgressbarWithChildren
                                                    value={this.progressPercent}
                                                    strokeWidth={4}
                                                    background
                                                    backgroundPadding={2}
                                                    styles={buildStyles({
                                                        strokeLinecap: 'butt', // 'round' | 'butt'
                                                        pathTransitionDuration: 0.1,
                                                        textSize: '16px', pathColor: 'white',
                                                        trailColor: 'transparent', backgroundColor: '#1890ff'
                                                    })}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: '1.75rem', fontWeight: 500,
                                                            color: 'white', cursor: 'default'
                                                        }}
                                                    >{this.progressPercent}</span>
                                                </CircularProgressbarWithChildren>
                                            </div>
                                        </div>
                                    ) : (
                                            <div>
                                                Balance: {this.state.result?.status.balance}
                                                <br />
                                                Net: {this.state.result?.status.net}
                                                <br />
                                                Profit: {this.state.result?.status.profit}
                                                <br />
                                                Var: {this.state.result?.status.var}
                                                <br />
                                                Portfolio: {JSON.stringify(this.state.result?.status.portfolio)}
                                            </div>
                                        )}
                                </div>
                            </Col>
                            <Col xs={24}>
                                <ConsoleReadOnly className="well-dark" value={this.state.messages} style={{ height: '245px', marginTop: '5px' }} />
                            </Col>
                        </Row>
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
