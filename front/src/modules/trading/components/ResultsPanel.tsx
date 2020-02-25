import { Icon, Result } from 'antd';
import React, { HTMLAttributes } from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import IClientResult from '../models/dtos/IClientResult';
import IStockData from '../models/dtos/IStockData';
import ResultsGrid from './ResultsGrid';
import './ResultsPanel.scss';

interface Props<T extends IStockData> extends HTMLAttributes<HTMLDivElement> {
    running: boolean,
    progress: number,
    totalSteps: number,
    variation: number,
    result: IClientResult<T> | null
}

export default class ResultsPanel<T extends IStockData> extends React.Component<Props<T>> {
    lastUpdate = new Date()
    skipedUpdates = 0

    shouldComponentUpdate(nextProps: Props<T>) {
        const skipUpdate = () => {
            this.skipedUpdates++
            return false
        }

        const update = () => {
            this.lastUpdate = new Date()
            this.skipedUpdates = 0
            return true
        }

        if (this.props.running !== nextProps.running)
            return update()

        // if (this.state.showPortfolio !== nextState.showPortfolio)
        //     return update()

        const secsPastUpdate = ((new Date()).getTime() - this.lastUpdate.getTime()) / 1000
        if (secsPastUpdate > 5)
            return update()

        const stepsToUpdate = Math.floor(this.props.totalSteps / 100)
        if (this.skipedUpdates >= stepsToUpdate)
            return update()

        return skipUpdate()
    }

    render() {
        const { style, running, progress, totalSteps, variation, result, ...rest } = this.props

        return (
            <div {...rest} style={{ display: 'flex', width: '100%', ...style }} className={rest.className + ' results-panel'}>
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
                                <ResultsGrid result={result} />
                            )}
                    </>
                ) : (
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <Result
                                icon={<Icon type="info-circle" theme="filled" />}
                                title="No Result Available"
                                subTitle="Your simulation's result will appear here"
                            />
                        </div>
                    )}
            </div>
        )
    }
}
