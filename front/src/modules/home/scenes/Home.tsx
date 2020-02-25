import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography

export default class Home extends React.Component {
    render() {
        return (
            <>
                <Title level={1}>Home</Title>
                <Paragraph>
                    <Text>
                        <ol>
                            <li>
                                Open the <Link to='/simulator'>Simulator</Link>
                            </li>
                            <li>
                                Select a group of brazilian stocks to simulate, separated by comma (e.g. PETR4, ITUB4)
                            </li>
                            <li>
                                Select a range to run the strategy
                            </li>
                            <li>
                                Insert your strategy code using JavaScript (use "loadScript(url)" to inject a dependencie and "console.print(message)" to log on the Console Panel)
                            </li>
                            <li>
                                Press Start
                            </li>
                            <li>
                                Check the results on the Results Panel
                            </li>
                        </ol>
                    </Text>
                </Paragraph>
            </>
        )
    }
}
