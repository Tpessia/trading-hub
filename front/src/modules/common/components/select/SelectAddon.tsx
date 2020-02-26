import { Select } from 'antd';
import { SelectProps, SelectValue } from 'antd/lib/select';
import React from "react";

export interface SelectAddonProps<T> extends SelectProps<T> {
    addonBefore?: React.ReactNode
}

export default class SelectAddon<T = SelectValue> extends React.Component<SelectAddonProps<T>> {
    render() {
        const { addonBefore, style, ...rest } = this.props

        const select = (
            <Select<T>
                {...(rest as any)}
                style={{
                    width: '100%',
                    ...style
                }}
            />
        )

        return (
            <>
                {addonBefore ? (
                    <span className="ant-input-group-wrapper">
                        <span className="ant-input-wrapper ant-input-group">
                            <div className="ant-input-group-addon">{addonBefore}</div>
                            {select}
                        </span>
                    </span>
                ) : select}
            </>
        )
    }
}