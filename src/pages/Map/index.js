import AntTabBar from 'antd-mobile/lib/tab-bar';
import { Component } from 'react';
import './index.scss'
import NavHeader from '../../components/NavHeader'

class Map extends Component {
  state = {}
  componentDidMount () {
    // 创建地图实例
    const map = new window.BMapGL.Map('container')
    // 设置中心点坐标
    const point = new window.BMapGL.Point(116.404, 39.915)
    // 初始化地图
    map.centerAndZoom(point, 15)
  }
  render () {
    return (<div className='map'>
      <NavHeader onLeftClick={() => {
        this.props.history.go(-1)
      }}>
        地图找房
      </NavHeader>
      <div id="container"></div>
    </div>)
  }
}

export default Map;