import { Icon, Menu } from "antd";
import React from "react";

interface Props {
    onClick?: () => void
}

export default class AppBarButton extends React.Component<Props> {
    render() {
        return (
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={['button']}
            >
                <Menu.Item
                    key="button"
                    style={{ lineHeight: '64px', float: 'right' }}
                    onClick={this.props.onClick}
                >
                    <Icon type="menu" style={{ margin: 0 }} />
                </Menu.Item>
            </Menu>
        )
    }
}