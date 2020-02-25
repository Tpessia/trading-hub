import { Button, Col, Input, Row, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import io from 'socket.io-client';
import { isString } from 'util';
import CodeEditor from "../../common/components/CodeEditor";
import ConsoleReadOnly from '../../common/components/ConsoleReadOnly';
import DatePickerAddon from '../../common/components/date/DatePickerAddon';
import InputNumberMask from '../../common/components/input/InputNumberMask';
import ConfigService from '../../common/services/ConfigService';
import ConsoleService from '../../common/services/ConsoleService';
import { getDateOnly, getFirstOfYear, getIsoString } from '../../common/utils/date.utils';
import ResultsPanel from '../components/ResultsPanel';
import IClientResult from '../models/dtos/IClientResult';
import IStockData from '../models/dtos/IStockData';
import ITradingData from "../models/dtos/ITradingData";
import ITradingStart from '../models/dtos/ITradingStart';
import { TradingInputMessage, TradingOutputMessage } from '../models/dtos/TradingMessage';
import { initialCode } from '../models/InitialCode';
import './Simulator.scss';

const { Title } = Typography

interface Props {

}

interface State<T extends IStockData> {
    data: ITradingStart,
    code: string,
    messages: string[],

    server: SocketIOClient.Socket | null,
    running: boolean,
    statusData: ITradingData<T>['status'][],
    result: IClientResult<T> | null,
}

export default class Simulator<T extends IStockData = IStockData> extends React.Component<Props, State<T>> {
    state: State<T> = {
        data: {
            tickers: ['PETR4','ITUB4'],
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

    get totalSteps() {
        if (this.state.statusData.length === 0) return 0

        const statusData = this.state.statusData
        const progress = statusData[0].progress

        return progress.total
    }

    get currentProgress() {
        if (this.state.statusData.length === 0) return 0

        const statusData = this.state.statusData
        const progress = statusData[statusData.length - 1].progress

        const percent = (progress.current / progress.total) * 100
        return +percent.toFixed(0)
    }

    get currentVar() {
        if (this.state.statusData.length === 0) return 0

        const statusData = this.state.statusData
        const variation = statusData[statusData.length - 1].var

        const percent = (variation - 1) * 100
        return +percent.toFixed(2)
    }

    //#region Lifecycle

    componentDidMount() {
        ConsoleService.addCallback('simulator', message => {
            this.setState(state => ({
                messages: [
                    ...state.messages,
                    isString(message) ? message : JSON.stringify(message)
                ]
            }))
        })
    }

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

            ConsoleService.enableConsole()

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
        ConsoleService.disableConsole()

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

        server.off(TradingInputMessage.Data).on(TradingInputMessage.Data, (data: ITradingData<T>) => {
            this.setState(state => ({
                statusData: [...state.statusData, data.status]
            }))
        })

        server.off(TradingInputMessage.End).on(TradingInputMessage.End, this.handleEnd)

        server.off(TradingInputMessage.Result)
            .on(TradingInputMessage.Result, (result: IClientResult<T>) => {
                this.setState({ result })
            })
    }

    //#endregion

    render() {
        return (
            <>
                <Title level={1}>Simulator</Title>

                <Input.Group style={{ margin: '.7rem 0' }}>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 0 }]}>
                        <Col xs={24} sm={12} md={6}>
                            <Input
                                addonBefore="Ticker"
                                type="text"
                                value={this.state.data.tickers.join(',')}
                                onChange={e => this.updateData({ tickers: e.target.value.split(',') })}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <InputNumberMask
                                maskProps={{
                                    prefix: 'R$', thousandSeparator: '.', decimalSeparator: ',',
                                    decimalScale: 2, fixedDecimalScale: true,
                                    defaultValue: this.state.data.balance,
                                    onValueChange: values => this.updateData({ balance: values.floatValue })
                                }}
                                inputProps={{
                                    addonBefore: 'Balance',
                                    type: 'text'
                                }}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <DatePickerAddon
                                addonBefore="Start"
                                allowClear={false}
                                value={moment(this.state.data.start)}
                                onChange={(date, dateStr) => this.updateData({
                                    start: `${dateStr}T00:00:00`
                                })}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <DatePickerAddon
                                addonBefore="End"
                                allowClear={false}
                                value={moment(this.state.data.end)}
                                onChange={(date, dateStr) => this.updateData({
                                    end: `${dateStr}T00:00:00`
                                })}
                            />
                        </Col>
                    </Row>
                </Input.Group>

                <Row
                    className="simulator-wrapper"
                    style={{ flexGrow: 1, display: 'flex' }}
                    gutter={[
                        { xs: 0, sm: 0, md: 0, lg: 32 },
                        { xs: 8, sm: 16, md: 24, lg: 0 }
                    ]}
                >
                    <Col xs={24} lg={12} style={{ display: 'flex' }}>
                        <CodeEditor
                            className="code-editor"
                            style={{ height: 'auto', width: '100%' }}
                            defaultValue={this.state.code}
                            value={this.state.code}
                            onChange={this.handleEditorChange}
                        />
                    </Col>
                    <Col xs={24} lg={12} style={{ display: 'flex', flexDirection: 'column' }}>
                        <Row style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Col xs={24} style={{ flex: '1' }}>
                                <ResultsPanel<T>
                                    className="output-box box-dark"
                                    style={{ marginBottom: '12px', display: 'flex' }}
                                    running={this.state.running}
                                    totalSteps={this.totalSteps}
                                    progress={this.currentProgress}
                                    variation={this.currentVar}
                                    result={this.state.result}
                                />
                            </Col>
                            <Col xs={24} style={{ flex: '1' }}>
                                <ConsoleReadOnly
                                    className="output-box box-dark"
                                    style={{ marginTop: '12px', boxShadow: 'none' }}
                                    value={this.state.messages}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <div style={{ margin: '0.7rem -.3rem 0' }}>
                    <Button
                        style={{ margin: '0 .3rem' }}
                        disabled={this.state.running}
                        onClick={this.handleStart}
                    >Start</Button>
                    <Button
                        style={{ margin: '0 .3rem' }}
                        disabled={!this.state.running}
                        onClick={this.handleStop}
                    >Stop</Button>
                </div>
            </>
        );
    }
}
