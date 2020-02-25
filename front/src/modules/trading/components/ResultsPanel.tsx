import { Card, Icon, Result, Statistic } from 'antd';
import { format } from 'currency-formatter';
import React, { HTMLAttributes } from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import IClientResult from '../models/dtos/IClientResult';
import IStockData from '../models/dtos/IStockData';
import './ResultsPanel.scss';

interface Props<T extends IStockData> extends HTMLAttributes<HTMLDivElement> {
    running: boolean,
    progress: number,
    totalSteps: number,
    variation: number,
    result: IClientResult<T> | null
}

interface State {
    showPortfolio: boolean
}

export default class ResultsPanel<T extends IStockData> extends React.Component<Props<T>, State> {
    state: State = {
        showPortfolio: false
    }

    skipedUpdates = 0

    shouldComponentUpdate(nextProps: Props<T>, nextState: State) {
        if (this.props.running !== nextProps.running)
            return true

        if (this.state.showPortfolio !== nextState.showPortfolio)
            return true

        const stepsToUpdate = Math.floor(this.props.totalSteps / 100)
        if (this.skipedUpdates < stepsToUpdate) {
            this.skipedUpdates++
            return false
        }

        this.skipedUpdates = 0
        return true
    }

    formatCurrency = (num: number | undefined) => num !== undefined ? format(num, { code: 'BRL' }) : format(0, { code: 'BRL' })

    render() {
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

        const statValueStyle: React.CSSProperties = {
            fontSize: '1.3rem'
        }

        const { running, progress, totalSteps, variation, result, ...rest } = this.props

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
            <div {...rest} style={{ ...rest.style, display: 'flex', width: '100%' }} className={rest.className + ' results-panel'}>
                {result || running ? (
                    <>
                        {running ? (
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ width: '150px' }}>
                                    <CircularProgressbarWithChildren
                                        value={progress}
                                        strokeWidth={4}
                                        background
                                        backgroundPadding={2}
                                        styles={buildStyles({
                                            strokeLinecap: 'butt', // 'round' | 'butt'
                                            pathTransitionDuration: 0.05,
                                            textSize: '16px', pathColor: 'white',
                                            trailColor: 'transparent', backgroundColor: '#1890ff'
                                        })}
                                    >
                                        <span
                                            style={{
                                                fontSize: '1.75rem', fontWeight: 500,
                                                color: 'white', cursor: 'default'
                                            }}
                                        >{variation + '%'}</span>
                                    </CircularProgressbarWithChildren>
                                </div>
                            </div>
                        ) : (
                                <TransitionGroup style={{ display: 'flex', width: '100%' }} >
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
                                                bordered={false}
                                                style={cardStyle}
                                                headStyle={{ padding: '0 15px' }}
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
                                                <Card.Grid className="result-grid">
                                                    <Statistic
                                                        style={statStyle} valueStyle={statValueStyle}
                                                        title="Balance" value={this.formatCurrency(result?.status.balance)}
                                                    />
                                                </Card.Grid>
                                                <Card.Grid className="result-grid">
                                                    <Statistic
                                                        style={statStyle} valueStyle={statValueStyle}
                                                        title="Net" value={this.formatCurrency(result?.status.net)}
                                                    />
                                                </Card.Grid>
                                                <Card.Grid className="result-grid">
                                                    <Statistic
                                                        style={statStyle} valueStyle={statValueStyle}
                                                        title="Profit" value={this.formatCurrency(result?.status.profit)}
                                                    />
                                                </Card.Grid>
                                                <Card.Grid className="result-grid">
                                                    <Statistic
                                                        style={statStyle} valueStyle={statValueStyle}
                                                        title="Var" value={result?.status.var.toFixed(5)}
                                                    />
                                                </Card.Grid>
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
                                                    bodyStyle={{ overflowY: 'auto' }}
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
                            )}
                    </>
                ) : (
                        <Result
                            icon={<Icon type="info-circle" theme="filled" />}
                            title="No Result Available"
                            subTitle="Your simulation's result will appear here"
                            style={{ width: '100%' }}
                        />
                    )}
            </div>
        )
    }
}
