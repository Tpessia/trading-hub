import { Input } from 'antd';
import { TextAreaProps } from "antd/lib/input";
import { merge } from "lodash-es";
import React from "react";

const { TextArea } = Input;

interface Props extends TextAreaProps {
    value: string | string[]
}

export default class ConsoleReadOnly extends React.Component<Props> {
    style: React.CSSProperties = {
        width: '100%',
        cursor: 'default',
        resize: 'none'
    }

    stringify = (value: string[]) => value.join('\n-------------\n')

    render() {
        const { value, style, ...rest } = this.props

        return (
            <TextArea
                {...rest}
                style={merge(this.style, this.props.style)}
                value={this.props.value instanceof Array ? this.stringify(this.props.value) : this.props.value}
            />
        )
    }
}