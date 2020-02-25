import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker/interface';
import React from "react";
const { RangePicker } = DatePicker

interface Props extends RangePickerProps {
    addonBefore?: React.ReactNode
}

export default class RangePickerAddon extends React.Component<Props> {
    render() {
        const picker = (
            <RangePicker
                style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    display: 'table-cell',
                    overflow: 'hidden',
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