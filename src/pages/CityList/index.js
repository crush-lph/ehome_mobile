import React, { Component, } from 'react';
import { NavBar, Toast } from 'antd-mobile'
import './index.scss'
import axios from 'axios'
import { getCurrentCity } from '../../utils'
import { List, AutoSizer } from 'react-virtualized'
import NavHeader from '../../components/NavHeader';

// 城市列表高度常量
const CITYIND_HEIGHT = 36
const CITYNAME_HEIGHT = 52
const HOUSE_CITY = ['北京', '上海', '深圳', '广州']
// 格式化数据的方法
const formatCityData = (list) => {
  const cityList = {}
  // const cityIndex = []
  // 1、遍历list数组
  // 2、获取每一个城市的首字母
  // 3、判断cityList中是否有该分类
  // 4、如果有直接push 如果没有，先创建数组，然后把当前城市信息添加到数组中
  list.forEach(item => {
    const first = item.short.substr(0, 1)
    if (cityList[first]) {
      cityList[first].push(item)
    } else {
      cityList[first] = [item]
    }
  })
  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex
  }
}

// 格式化城市索引
const formatCityIndex = (letter) => {
  return letter === '#' ? '当前定位' : letter === 'hot' ? '热门城市' : letter.toUpperCase()
}



class CityList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cityIndex: [],
      cityList: {},
      activeIndex: 0
    }
    this.cityListComponent = React.createRef()
  }

  // 获取城市列表
  async getCityList () {
    const res = await axios.get(`http://localhost:8080/area/city?level=1`)
    console.log(res);
    const { cityList, cityIndex } = formatCityData(res.data.body)
    const hotRes = await axios.get('http://localhost:8080/area/hot')
    // console.log(hotRes);
    cityIndex.unshift('hot')
    cityList['hot'] = hotRes.data.body
    const curCity = await getCurrentCity()
    cityList['#'] = [curCity]
    cityIndex.unshift('#')
    this.setState({
      cityList: cityList,
      cityIndex: cityIndex
    })

    console.log(cityList);
    console.log(cityIndex);
    console.log(curCity);

  }

  changeCity ({ label, value }) {
    // console.log(curCity);
    if (HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem('ehome_city', JSON.stringify({ label, value }))
      this.props.
        history.go(-1)
    } else {
      // console.log('该城市暂无房源');
      Toast.info('该城市暂无房源数据', 1, null, false);
    }
  }
  // list渲染函数
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引值
    isScrolling, // 当前项是否正在滚动中
    isVisible, // 当前项在list中时可见的This row is visible within the List (eg it is not an overscanned row)
    style, // 一定要给每一行数据添加该样式，作用是指定每一行的位置 Style object to be applied to row (to position it)
  }) => {
    const { cityIndex, cityList } = this.state

    // const formatCityIndex = () => {
    //   return cityIndex[index] === '#' ? '当前城市' : cityIndex[index] === 'hot' ? '热门城市' : cityIndex[index].toUpperCase()
    // }
    const letter = cityIndex[index]
    const citys = cityList[letter]
    // console.log(cityList[letter]);
    return (
      <div key={key} style={style} className='city'>
        <div className='cityInd'>{formatCityIndex(cityIndex[index])}</div>
        {citys.map(city => (
          <div className='cityName' key={city.value} onClick={() => { this.changeCity(city) }}> {city.label}</div>
        ))}

      </div>
    );
  }

  async componentDidMount () {
    await this.getCityList()
    // 调用这个方法的时候，需要保证List组件中已经有数据可，如哦List中数据为空，就会导致这个方法报错
    // 只要保证这个方法是在获取到数据之后调用的即可
    this.cityListComponent.current.measureAllRows()
  }

  // 创建动态计算每一行高度的方法
  getRowHeight = ({ index }) => {
    // console.log(index);
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]
    const cityLen = cityList[letter].length
    return cityLen * CITYNAME_HEIGHT + CITYIND_HEIGHT
  }

  // 索引点击事件
  hanldeClickIndex = (index) => {
    // console.log(index);
    this.cityListComponent.current.scrollToRow(index)
    // this.setState({
    //   activeIndex: index
    // })
  }

  // 获取list组件中渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      // console.log('startIndex', startIndex);
      this.setState({
        activeIndex: startIndex
      })
    }
  }

  // 渲染右侧城市索引
  renderCityIndex () {
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item, index) => (
      <li className='index-item' key={item} onClick={() => this.cityListComponent.current.scrollToRow(index)}>
        <span className={activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
      </li>
    ))
  }

  render () {
    return (
      <div className='cityList'>
        <NavHeader onLeftClick={() => this.props.history.go(-1)}>城市选择</NavHeader>


        {/* 城市列表 */}
        <AutoSizer>
          {
            ({ width, height }) => (
              <List
                ref={this.cityListComponent}
                width={width}
                height={height}
                rowCount={this.state.cityIndex.length}
                rowHeight={this.getRowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment='start'
              />
            )
          }
        </AutoSizer>

        {/* 右侧索引 */}
        <ul className='city-index'>
          {this.renderCityIndex()}
        </ul>

      </div >
    )
  }
}

export default CityList;

// 长列表性能优化
// 1、懒渲染 
// 每次只渲染一部分，等渲染的数据即将滚动完时，在渲染下面部分
// 优点：每次只渲染一部分数据，速度快
// 缺点 数量大时，页面中依然存在大量dom节点 ，占用内存过多，降低浏览器渲染性能，导致页面卡顿
// 使用场景：数据量不大的情况
// 2、 可视区域渲染
// 原理 之渲染页面可视区域的列表项，非可视区域的数据完全不渲染，在滚动列表时动态更新列表项
//  使用场景: 一次性展示大量数据的情况 (比如：大表格、微博、聊天应用等)