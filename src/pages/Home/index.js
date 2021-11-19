import { Component } from 'react';
import { Route } from 'react-router-dom'
import News from '../News'
import Index from '../Index'
import Profile from '../Profile';
import HouseList from '../HouseList';
import { TabBar } from 'antd-mobile';
import './index.scss'

class index extends Component {
  state = {
    // 默认选中的tab菜单
    selectedTab: this.props.location.pathname,
    // 控制tabbar的显示和隐藏
    // hidden: false,
    // 控制是否全屏
    // fullScreen: true,
    tabbarItem: [
      {
        title: '首页',
        icon: 'icon-ind',
        path: '/home'
      },
      {
        title: '找房',
        icon: 'icon-findHouse',
        path: '/home/list'
      },
      {
        title: '资讯',
        icon: 'icon-infom',
        path: '/home/news'
      },
      {
        title: '我的',
        icon: 'icon-my',
        path: '/home/profile'
      }
    ]
  }

  // 渲染每个tabbar.item的内容
  renderTabBarItem() {
    return this.state.tabbarItem.map(item => <TabBar.Item
      title={item.title}
      key={item.title}
      icon={
        <i className={`iconfont ${item.icon}`} />
      }
      selectedIcon={
        <i className={`iconfont ${item.icon}`} />
      }
      selected={this.state.selectedTab === item.path}
      // badge={1}
      onPress={() => {
        this.setState({
          selectedTab: item.path,
        });
        this.props.history.push(item.path)
      }}

    />)
  }

  // 点击和第一次加载home组件的时候才更改tabbar的选中状态，
  // 当路由发生更新的时候没有做处理
  // 在cdu中更新state必须要加判断，否则会死循环
  componentDidUpdate(prevProps) {
    // console.log(prevProps);
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }

  render() {
    return (<div className='home'>
      {/* Home */}
      <Route path='/home/news' component={News}></Route>
      <Route path='/home/profile' component={Profile}></Route>
      <Route path='/home/list' component={HouseList}></Route>
      <Route exact path='/home' component={Index}></Route>

      {/* <div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', bottom: 0 } : { height: 400 }}> */}
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#21b97a"
        barTintColor="white"
        hidden={this.state.hidden}
        noRenderContent={true}
      >
        {this.renderTabBarItem()}
      </TabBar>
    </div>)
  }
}

export default index;