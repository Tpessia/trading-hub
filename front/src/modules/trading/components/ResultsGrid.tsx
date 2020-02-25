import { Card, Icon, Statistic, Tooltip } from 'antd';
import { format } from 'currency-formatter';
import React, { HTMLAttributes } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import variables from '../../../variables';
import IClientResult from '../models/dtos/IClientResult';
import IStockData from '../models/dtos/IStockData';
import './ResultsGrid.scss';

interface Props<T extends IStockData> extends HTMLAttributes<HTMLDivElement> {
    result: IClientResult<T> | null
}

interface State {
    showPortfolio: boolean
}

export default class ResultsGrid<T extends IStockData> extends React.Component<Props<T>, State> {
    state: State = {
        showPortfolio: false
    }

    formatCurrency = (num: number | undefined) => num !== undefined ? format(num, { code: 'BRL' }) : format(0, { code: 'BRL' })
    formatVar = (num: number | undefined) => num !== undefined ? ((num - 1) * 100).toFixed(2) + '%' : '0.00%'

    render() {
        const { result, style, ...rest } = this.props

        const cardStyle: React.CSSProperties = {
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }

        const cardTitleStyle: React.CSSProperties = {
            position: 'relative',
            textAlign: 'center',
            fontSize: '2rem',
            lineHeight: '40px'
        }

        const iconStyle: React.CSSProperties = {
            position: 'absolute',
            fontSize: '1.5rem',
            marginTop: '3px',
            padding: '5px'
        }

        const statStyle: React.CSSProperties = {
            overflowX: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%'
        }

        const statStyleSuccess: React.CSSProperties = {
            color: variables.success,
            fontWeight: 500
        }

        const statStyleError: React.CSSProperties = {
            color: variables.error,
            fontWeight: 500
        }

        const statValueStyle: React.CSSProperties = {
            fontSize: '1.3rem'
        }

        const getVarStyle = () => {
            if (!result?.status.var) return {}
            if (result?.status.var === 1)
                return {}
            else if (result?.status.var > 1)
                return statStyleSuccess
            return statStyleError
        }

        const getProfitStyle = () => {
            if (!result?.status.profit) return {}
            if (result?.status.profit === 0)
                return {}
            else if (result?.status.profit > 0)
                return statStyleSuccess
            return statStyleError
        }

        const portfolio = this.props.result?.status.portfolio
        const portfolioList = portfolio && this.state.showPortfolio ? Object.entries(portfolio).map(e => (
            <React.Fragment key={e[0]}>
                <Card.Grid className="portfolio-grid">
                    <Statistic
                        style={statStyle} valueStyle={statValueStyle}
                        title={`${e[0]} Size`} value={e[1].size}
                    />
                </Card.Grid>
                <Card.Grid className="portfolio-grid">
                    <Statistic
                        style={statStyle} valueStyle={statValueStyle}
                        title={`${e[0]} Avg Cost`} value={this.formatCurrency(e[1].avgCost)}
                    />
                </Card.Grid>
            </React.Fragment>
        )) : null

        return (
            <TransitionGroup {...rest} style={{ display: 'flex', width: '100%', ...style }} >
                {!this.state.showPortfolio ? (
                    <CSSTransition
                        key="1"
                        appear={true}
                        in={true}
                        exit={false}
                        timeout={300}
                        classNames={'fade'}
                    >
                        <Card
                            className="ant-card-contain-grid"
                            bordered={false}
                            style={cardStyle}
                            headStyle={{ padding: '0 15px' }}
                            bodyStyle={{ height: '100%', display: 'flex' }}
                            title={(
                                <div style={cardTitleStyle}>
                                    <Icon
                                        type="arrow-right"
                                        style={{ ...iconStyle, right: 0 }}
                                        onClick={() => this.setState({ showPortfolio: true })}
                                    />
                                    <span>Results</span>
                                </div>
                            )}
                        >
                            <div className="result-grid-wrapper">
                                <Card.Grid className="result-grid">
                                    <Statistic
                                        style={statStyle} valueStyle={statValueStyle}
                                        value={this.formatCurrency(result?.status.balance)}
                                        title={(
                                            <div>
                                                <span>Balance</span>
                                                <Tooltip title="Total available balance on account">
                                                    <Icon
                                                        type="question-circle" theme="filled"
                                                        style={{ float: 'right', marginTop: '2px' }}
                                                    />
                                                </Tooltip>
                                            </div>
                                        )}
                                    />
                                </Card.Grid>
                                <Card.Grid className="result-grid">
                                    <Statistic
                                        style={statStyle} valueStyle={statValueStyle}
                                        value={this.formatCurrency(result?.status.net)}
                                        title={(
                                            <div>
                                                <span>Net</span>
                                                <Tooltip title="Account Balance + Portfolio Balance">
                                                    <Icon
                                                        type="question-circle" theme="filled"
                                                        style={{ float: 'right', marginTop: '2px' }}
                                                    />
                                                </Tooltip>
                                            </div>
                                        )}
                                    />
                                </Card.Grid>
                                <Card.Grid className="result-grid">
                                    <Statistic
                                        style={statStyle} valueStyle={{ ...statValueStyle, ...getProfitStyle() }}
                                        value={this.formatCurrency(result?.status.profit)}
                                        title={(
                                            <div>
                                                <span>Profit</span>
                                                <Tooltip title="Realized Profit">
                                                    <Icon
                                                        type="question-circle" theme="filled"
                                                        style={{ float: 'right', marginTop: '2px' }}
                                                    />
                                                </Tooltip>
                                            </div>
                                        )}
                                    />
                                </Card.Grid>
                                <Card.Grid className="result-grid">
                                    <Statistic
                                        style={statStyle} valueStyle={{ ...statValueStyle, ...getVarStyle() }}
                                        value={this.formatVar(result?.status.var)}
                                        title={(
                                            <div>
                                                <span>Var</span>
                                                <Tooltip title="Net / Initial Balance">
                                                    <Icon
                                                        type="question-circle" theme="filled"
                                                        style={{ float: 'right', marginTop: '2px' }}
                                                    />
                                                </Tooltip>
                                            </div>
                                        )}
                                    />
                                </Card.Grid>
                            </div>
                        </Card>
                    </CSSTransition>
                ) : (
                        <CSSTransition
                            key="2"
                            in={true}
                            exit={false}
                            timeout={300}
                            classNames={'fade'}
                        >
                            <Card
                                bordered={false}
                                className='ant-card-contain-grid'
                                style={cardStyle}
                                headStyle={{ padding: '0 15px' }}
                                bodyStyle={{ overflowY: 'auto', flex: '1' }}
                                title={(
                                    <div style={cardTitleStyle}>
                                        <Icon
                                            type="arrow-left"
                                            style={{ ...iconStyle, left: 0 }}
                                            onClick={() => this.setState({ showPortfolio: false })}
                                        />
                                        <span>Portfolio</span>
                                    </div>
                                )}
                            >
                                {portfolioList}
                            </Card>
                        </CSSTransition>
                    )}
            </TransitionGroup>
        )
    }
}
