import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker/interface';
import React from "react";
import './DatePickerAddon.scss';

export interface DatePickerAddonProps extends DatePickerProps {
    addonBefore?: React.ReactNode
}

export default class DatePickerAddon extends React.Component<DatePickerAddonProps> {
    render() {
        const picker = (
            <DatePicker
                style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    display: 'table-cell',
                    overflow: 'hidden',
                    float: 'left',
                    width: '100%',
                    marginBottom: '0',
                    textAlign: 'inherit',
                    ...this.props.style
                }}
                {...this.props}
            />
        )

        return (
            <>
                {this.props.addonBefore ? (
                    <span className="ant-input-group-wrapper">
                        <span className="ant-input-wrapper ant-input-group">
                            <div className="ant-input-group-addon">{this.props.addonBefore}</div>
                            {picker}
                        </span>
                    </span>
                ) : picker}
            </>
        )
    }
}