import moment from 'moment';
import React from 'react';
import DatePickerAddon, { DatePickerAddonProps } from './DatePickerAddon';

interface Props {
    wrapper?: (node: JSX.Element) => JSX.Element,
    startWrapper?: (node: JSX.Element) => JSX.Element,
    endWrapper?: (node: JSX.Element) => JSX.Element,
    startProps?: DatePickerAddonProps,
    endProps?: DatePickerAddonProps
}

interface State {
    endOpen: boolean
}

export default class RangePickerGroup extends React.Component<Props, State> {
    state: State = {
        endOpen: false
    }

    disabledStartDate = (startValue: moment.Moment | null) => {
        const endValue = this.props.endProps?.value

        if (!startValue || !endValue)
            return false

        return startValue.valueOf() > endValue.valueOf()
    }

    disabledEndDate = (endValue: moment.Moment | null) => {
        const startValue = this.props.startProps?.value

        if (!endValue || !startValue)
            return false

        return endValue.valueOf() <= startValue.valueOf()
    }

    handleStartOpenChange = (open: boolean) => {
        if (!open) this.setState({ endOpen: true })
    }

    handleEndOpenChange = (open: boolean) => {
        this.setState({ endOpen: open })
    }

    render() {
        const { endOpen } = this.state

        let start = (
            <DatePickerAddon
                {...this.props.startProps}
                disabledDate={this.disabledStartDate}
                onOpenChange={this.handleStartOpenChange}
            />
        )

        let end = (
            <DatePickerAddon
                {...this.props.endProps}
                disabledDate={this.disabledEndDate}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
            />
        )

        if (this.props.startWrapper)
            start = this.props.startWrapper(start)

        if (this.props.endWrapper)
            end = this.props.endWrapper(end)

        const elem = (
            <>
                {start}
                {end}
            </>
        )

        return (
            <>
                {this.props.wrapper ? this.props.wrapper(elem) : elem}
            </>
        )
    }
}