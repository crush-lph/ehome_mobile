import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
// 导入antd-mobile样式
import 'antd-mobile/dist/antd-mobile.css'

import './assets/fonts/iconfont.css'
// 全局样式需要放在组件库样式之后导入，这样样式才会覆盖生效
import './index.css';
import 'react-virtualized/styles.css'
// window.addEventListener('touchmove', handler, { passive: false })
// 应该将组件的导入放在最后，防止样式被覆盖
import App from './App';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
