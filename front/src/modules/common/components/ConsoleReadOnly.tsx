import React from "react";
import { Input } from 'antd';
import { merge } from "lodash-es";

const { TextArea } = Input;

interface Props {
    styles?: React.CSSProperties,
    value: string | string[]
}

export default class ConsoleReadOnly extends React.Component<Props> {
    styles: React.CSSProperties = {
        width: '100%',
        height: '500px',
        cursor: 'default'
    }

    stringify = (value: string[]) => value.join('\n-------------\n')

    render() {
        return (
            <TextArea
                style={merge(this.styles, this.props.styles)}
                value={this.props.value instanceof Array ? this.stringify(this.props.value) : this.props.value}
            />
        )
    }
}