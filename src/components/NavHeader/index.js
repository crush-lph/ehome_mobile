import { NavBar } from 'antd-mobile'
import './index.scss'
import { withRouter } from 'react-router-dom'
// 导入prop-types校验包
import propTypes from 'prop-types'
//默认情况下，只有路由Route 直接渲染的组件才能够获取到路由信息(比如history.go()等) 如果需要在其他组件中获取到路由信息可以通过withRouter 高阶组件来获取 

const NavHeader = ({ children, history, onLeftClick }) => {

  NavHeader.propTypes = {
    children: propTypes.string.isRequired,
    onLeftClick: propTypes.func
  }
  const defaultHandler = () => { console.log('点击了左侧按钮'); }
  return (
    <NavBar
      className='navbar'
      mode="light"
      icon={<i className='iconfont icon-back'></i>}
      onLeftClick={onLeftClick || defaultHandler}
    >{children}</NavBar>
  );
}

export default withRouter(NavHeader);

