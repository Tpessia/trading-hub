import { Menu } from 'antd';
import React from 'react';
import { Link } from "react-router-dom";
import { ClickParam } from 'antd/lib/menu';

interface Props {
    horizontal: boolean,
    pathname: string,
    onSelect?: (param: ClickParam) => void
}

export default class AppBarMenu extends React.Component<Props> {
    render() {
        const { horizontal, pathname } = this.props

        const style: React.CSSProperties = horizontal
            ? {
                lineHeight: '64px',
                float: 'right'
            }
            : {
                lineHeight: '64px',
                width: '100%'
            }

        return (
            <Menu
                theme="dark"
                mode={horizontal ? 'horizontal' : 'vertical'}
                style={style}
                selectedKeys={[pathname]}
                onClick={this.props.onSelect}
            >
                <Menu.Item key="/">
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="/simulator">
                    <Link to="/simulator">Simulator</Link>
                </Menu.Item>
            </Menu>
        );
    }
}