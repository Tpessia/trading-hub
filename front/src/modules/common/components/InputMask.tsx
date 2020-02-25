import { Input } from "antd";
import { InputProps } from "antd/lib/input";
import React from "react";
import ReactInputMask, { Props as ReactInputMaskProps } from 'react-input-mask';

interface Props {
    maskProps: ReactInputMaskProps,
    inputProps: Omit<InputProps, 'value' | 'defaultValue' | 'onChange'>
}

export default class InputMask extends React.Component<Props> {
    render() {
        const { maskProps, inputProps } = this.props
        
        return (
            <ReactInputMask
                {...maskProps}
            >
                {(maskedProps: any) => {
                    return <Input {...maskedProps} {...inputProps} />
                }}
            </ReactInputMask>
        )
    }
}