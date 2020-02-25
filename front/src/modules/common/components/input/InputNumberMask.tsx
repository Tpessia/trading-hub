import { Input } from "antd";
import { InputProps } from "antd/lib/input";
import React from "react";
import NumberFormat, { NumberFormatProps } from 'react-number-format';

interface Props {
    maskProps: NumberFormatProps,
    inputProps: InputProps
}

export default class InputNumberMask extends React.Component<Props> {
    shouldComponentUpdate(nextProps: Props) {
        return false
    }

    render() {
        const { maskProps, inputProps } = this.props

        return (
            <NumberFormat
                {...maskProps}
                customInput={props => <Input {...inputProps} {...props} />}
            />
        )
    }
}