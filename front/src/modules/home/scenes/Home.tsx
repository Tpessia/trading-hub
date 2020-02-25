import React from 'react';
import { Typography } from 'antd';

const { Title, Text, Paragraph } = Typography

export default class Home extends React.Component {
    render() {
        return (
            <>
                <Title level={1}>Home</Title>
                <Paragraph>
                    <Text >
                        At some point there will be some instructions here and a friendly welcome message :)
                    </Text>
                </Paragraph>
            </>
        )
    }
}
