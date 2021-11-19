import './App.css';

// 导入要使用的组件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
// import { Button } from 'antd-mobile'
import Home from './pages/Home';
import CityList from './pages/CityList';
import Map from './pages/Map'

function App() {
  return (
    <Router>
      <div className="App">

        {/* 配置导航菜单 */}
        {/* <ul>
          <li><Link to='/home'>首页</Link></li>
          <li><Link to='/CityList'>城市选择</Link></li>
        </ul> */}

        {/* 配置路由 */}
        <Route exact path='/' render={() => <Redirect to='/home' />}></Route>
        <Route path='/home' component={Home}></Route>
        <Route path='/citylist' component={CityList}></Route>
        <Route path='/map' component={Map}></Route>
      </div>
    </Router>

  );
}

export default App;
