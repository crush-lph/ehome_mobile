import { Component } from 'react';
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
import axios from 'axios'

import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
import './index.scss'
import { getCurrentCity } from '../../utils';
/*
轮播图存在的bug
1、重新加载后不会自动播放
2、从其他路由返回的时候，高度不够
原因:轮播图数据是动态加载的，加载前后数量不一致导致的问题

解决方法: 
1、在state中添加表示轮播图加载完成的数据
2、在轮播如数据加载完成时，修改该数据状态值为true
3、只有在轮播图数据加载完成的情况下，才渲染轮播图组件
*/

const navs = [
  {
    id: 1,
    imgSrc: nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    imgSrc: nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    imgSrc: nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    imgSrc: nav4,
    title: '去出租',
    path: '/home/list'
  },
]


// 获取地理位置信息
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    console.log("当前位置信息:", pos);
  });
} else {
  // 当前浏览器不支持定位服务
  console.log("error");
}


class Index extends Component {
  state = {
    // 轮播图状态数据
    swipers: [],
    imgHeight: 212,
    isSwiperLoaded: false,
    groups: [],
    news: [],
    cityName: '上海',
  }

  // 获取租房小组数据
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    // console.log(res);
    this.setState({
      groups: res.data.body
    })
  }

  // 获取轮播图的数据
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    this.setState({
      swipers: res.data.body,
      isSwiperLoaded: true
    })
  }

  // 获取最新资讯
  async getNews() {
    const res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    // console.log(res.data);
    this.setState({
      news: res.data.body
    })
  }

  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()

    // 通过ip定位获取当前城市名称
    const curCity = await getCurrentCity()
    this.setState({
      cityName: curCity.label
    })
    // const currentCity = new window.BMapGL.LocalCity()
    // currentCity.get(async res => {
    //   console.log('当前城市信息', res);
    //   const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
    //   console.log(result);
    //   this.setState({
    //     cityName: result.data.body.label,
    //     cityValue: result.data.body.value
    //   })
    // })


  }

  //最新资讯渲染
  renderNews() {
    return this.state.news.map(item => (
      <Flex className='news-item' key={item.id}>
        <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
        <Flex className='news-slogan' direction='column' justify='between'>
          <h3 className='news-title'>{item.title}</h3>
          <Flex className='info' justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </Flex>
    ))
  }

  // 轮播图渲染
  renderSwipers() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://www.alipay.com"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event('resize'));
            this.setState({ imgHeight: 'auto' });
          }}
        />
      </a>
    ))
  }

  // 导航渲染
  renderNavs() {
    return navs.map(item => (
      <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
        <img src={item.imgSrc} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
  }

  render() {
    return (
      <div className='index'>
        {/* 轮播图 */}
        <div className='swiperbox'>
          {
            this.state.isSwiperLoaded ? <Carousel autoplay infinite >
              {this.renderSwipers()}
            </Carousel> : ''
          }

          {/* 顶部搜索  */}
          <Flex className='search-box'>
            <Flex className='search'>
              <div className='location' onClick={() => this.props.history.push('/citylist')}>
                <span className='cityName'>{this.state.cityName}</span>
                <i className='inconfont icon-arrow'></i>
              </div>
              <div className='form' onClick={() => this.props.history.push('/search')}>
                <i className='iconfont icon-seach'></i>
                <span className='text'>请输入小区或地址</span>
              </div>
            </Flex>
            <i className='iconfont icon-map' onClick={() => this.props.history.push('map')}></i>
          </Flex>
        </div>

        {/* 导航菜单 */}
        <Flex className='nav'>
          {this.renderNavs()}
        </Flex>

        {/* 租房小组 */}
        <div className='groups'>
          <div className='title'>
            <h3>租房小组</h3><span className='more'>更多</span>
          </div>

          <Grid data={this.state.groups} columnNum={2} square={false} hasLine={false}
            renderItem={item => (
              <Flex className='group-item' justify='around'>
                <div className='slogan'>
                  <p>{item.title}</p>
                  <span>{item.desc}</span>
                </div>

                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="lg">{this.renderNews()}</WingBlank>
        </div>


      </div>
    );
  }
}

export default Index;