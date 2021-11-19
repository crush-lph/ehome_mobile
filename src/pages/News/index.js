import { Component } from 'react';
import { Flex, WingBlank } from 'antd-mobile'
import axios from 'axios'

class News extends Component {
  state = {
    news: []
  }

  async getNews () {
    const res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    // console.log(res.data);
    this.setState({
      news: res.data.body
    })
  }

  componentDidMount () {
    this.getNews()
  }

  renderNews () {
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

  render () {
    return (
      <div className="news">
        <h3 className="group-title">最新资讯</h3>
        <WingBlank size="lg">{this.renderNews()}</WingBlank>
      </div>
    )
  }
}

export default News;