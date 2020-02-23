import { Input } from "antd";
import { InputProps } from "antd/lib/input";
import React from "react";
import ReactInputMask, { Props as ReactInputMaskProps } from 'react-input-mask';

interface Props {
    maskProps: ReactInputMaskProps,
    inputProps: InputProps
}

export default class InputMask<T> extends React.Component<Props> {
    render() {
        const { maskProps, inputProps } = this.props

        return (
            <ReactInputMask {...maskProps}>
              { (maskedProps: any) => {
                  console.log(maskedProps)
                  return <Input {...maskedProps} {...inputProps} />
              } }
            </ReactInputMask>
          )
    }
}