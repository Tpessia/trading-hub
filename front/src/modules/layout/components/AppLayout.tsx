import { Button, Drawer, Icon, Layout } from 'antd';
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import AppBarMenu from './AppBarMenu';
import './AppLayout.scss';
import logo from '../../../assets/logo64.png';
import variables from '../../../variables';
import LayoutContext from '../context/LayoutContext';

const { Header, Content, Footer } = Layout;

interface State {
  width: number,
  height: number,
  visible: boolean
}

class AppLayout extends React.Component<RouteComponentProps, State> {
  state: State = {
    width: window.innerWidth,
    height: window.innerHeight,
    visible: false
  }

  get isMobile() {
    return this.state.width < variables.sizeMd
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  updateDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      visible: !this.isMobile && this.state.visible ? false : this.state.visible
    })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  handleClose = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { location } = this.props

    return (

      <LayoutContext.Provider
        value={{
          screenHeight: this.state.height,
          screenWidth: this.state.width,
          isMobile: this.isMobile,
        }}
      >
        <Layout className="layout">
          <Header
            style={{
              position: 'fixed',
              zIndex: 1000,
              width: '100%',
              padding: this.isMobile ? '0 0 0 15px' : '0 50px'
            }}
          >
            <div style={{ float: 'left' }}>
              <img src={logo} alt="Logo" style={{ float: 'left' }} />
            </div>
            {this.isMobile ? (
              <Button
                type="primary"
                style={{
                  float: 'right',
                  height: '100%',
                  width: '3.5rem',
                  borderRadius: 0
                }}
                onClick={this.showDrawer}
              >
                <Icon type="menu" />
              </Button>
            ) : <AppBarMenu horizontal={true} pathname={location.pathname} />
            }
          </Header>

          <Drawer
            headerStyle={{ padding: '16px' }}
            bodyStyle={{ padding: 0 }}
            title="Trading Hub"
            placement="right"
            closable={false}
            onClose={this.handleClose}
            visible={this.state.visible}
          >
            <AppBarMenu horizontal={false} pathname={location.pathname} onSelect={this.handleClose} />
          </Drawer>

          <Content className="content" style={{ marginTop: '64px' }}>
            <div style={{
              minHeight: 'calc(100vh - 69px - 64px - 1rem)',
              overflowX: 'hidden', marginTop: '1rem',
              display: 'flex', flexDirection: 'column'
            }}>
              {this.props.children}
            </div>
          </Content>

          <Footer style={{ textAlign: 'center' }}>
            Trading Hub ©2020 Created by <a href="https://github.com/Tpessia/" target="_blank" rel="noopener noreferrer">Thiago Pessia</a>
          </Footer>
        </Layout>
      </LayoutContext.Provider>
    );
  }
}

export default withRouter(props => <AppLayout {...props} />)