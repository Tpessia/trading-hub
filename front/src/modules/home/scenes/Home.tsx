import { Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography

export default class Home extends React.Component {
    render() {
        return (
            <>
                <Title level={1}>Home</Title>
                <Paragraph>
                    <ol>
                        <li>
                            Open the <Link to='/simulator'>Simulator</Link>
                        </li>
                        <li>
                            Select a group of stocks to simulate, separated by comma (e.g. PETR4, ITUB4)
                        </li>
                        <li>
                            Select a range to run the strategy
                        </li>
                        <li>
                            Insert your strategy code using JavaScript, listening with "server.on('event', message => {'{ }'})" to "data", "result", "warning" or "fail"
                        </li>
                        <li>
                            Use "loadScript(url)" to inject a dependency and "console.print(message)" to log on the Console Panel
                        </li>
                        <li>
                            Press Start
                        </li>
                        <li>
                            Check the results on the Results Panel
                        </li>
                    </ol>
                </Paragraph>

                <Title level={3}>Start Schema</Title>
                <Paragraph>
                    Client to Server, sent automatically on "Start" button press
                </Paragraph>
                <Paragraph>
                    <pre>
{`{
    tickers: string[],
    market: 'br' | 'usa',
    balance: number,
    start: string,
    end: string
}`}
                    </pre>
                </Paragraph>

                <Title level={3}>Data Schema</Title>
                <Paragraph>
                    Server to Client, sent after each client action, with the stock data for the next day in the queue
                </Paragraph>
                <Paragraph>
                    <pre>
{`{
    data: {
        ticker: string,
        data: {
            date: Date,
            volume: number,
            open: number,
            high: number,
            low: number,
            close: number,
            adjOpen: number,
            adjHigh: number,
            adjLow: number,
            adjClose: number
        },
    },
    status: {
        progress: {
            current: number,
            total: number
        },
        portfolio: Dictionary<{
            size: number,
            avgCost: number
        }>,
        balance: number,
        net: number,
        profit: number,
        var: number
    }
}`}
                    </pre>
                </Paragraph>

                <Title level={3}>Action Schema</Title>
                <Paragraph>
                    Client to Server, sent by the client after receiving some data
                </Paragraph>
                <Paragraph>
                    <pre>
{`{
    type: 'buy' | 'sell' | 'null',
    size?: number // empty if type = 'null'
}`}
                    </pre>
                </Paragraph>

                <Title level={3}>Result Schema</Title>
                <Paragraph>
                    Server to Client, sent when the simulation is over
                </Paragraph>
                <Paragraph>
                    <pre>
{`{
    initialBalance: number,
    orders: {
        action: {
            type: 'buy' | 'sell' | 'null',
            size?: number // empty if action.type = 'null'
        },
        orderData: {
            ticker: string,
            data: {
                date: Date,
                volume: number,
                open: number,
                high: number,
                low: number,
                close: number,
                adjOpen: number,
                adjHigh: number,
                adjLow: number,
                adjClose: number
            }
        },
        orderResult?: { // present only if action.type = 'sell'
            profit: number
        }
    }[],
    status: {
        progress: {
            current: number,
            total: number
        },
        portfolio: Dictionary<{
            size: number,
            avgCost: number
        }>,
        balance: number,
        net: number,
        profit: number,
        var: number
    }
}`}
                    </pre>
                </Paragraph>
            </>
        )
    }
}
