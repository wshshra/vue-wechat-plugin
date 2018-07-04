# vue-wechat-plugin
vue微信公众号授权插件

# 依赖
> 基于vue2.0+, vue-router2.0+

# 使用步骤
## 1.npm安装

```
npm i vue-wechat-plugin -S
```
或
```
yarn add vue-wechat-plugin
```
## 2.引入

```
import Vue from 'vue'
import VueRouter from 'vue-router'
import wechatPlugin from 'vue-wechat-plugin'
import axios from 'axios'

// 路由配置
let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      meta: {
        wechatAuth: true // 如果此路由需要微信授权请设置为true,默认为false
      },
    }
  ]
})

Vue.use(VueRouter)

// 微信授权插件初始化
Vue.use(wechatPlugin , {
  router, // 路由实例对象
  appid: '', // 您的微信appid
  responseType: 'code', // 返回类型，请填写code
  scope: 'snsapi_userinfo', // 应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid），snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且，即使在未关注的情况下，只要用户授权，也能获取其信息）
  redirectUri: 'https://test.com/', //微信回调地址
  getCodeCallback (next, code) {
    // 用户同意授权后回调方法
    // code：用户同意授权后，获得code值
    // code说明： code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
    // next： 无论access_token是否获取成功,一定要调用该方法
    // next说明：next方法接收两个参数
    // 参数1(必填，切换到的路由地址，空字符串为当前路由，指定切换对象 next('/') 或者 next({ path: '/' })
    // 参数2为通过code值请求后端获取access_token的结果，true或者false，默认为false
    axios.get('通过code值换取access_token后端接口地址', {
      params: {
        code,
        state: ''
      },
    }).then(response => {
      let data = response.data
      let result = data.result; //后端返回的获取accessToken成功或失败，布尔型
      if (result) {
        next('', code); // 获取access_toeken成功
      } else {
        next('/login'); // 获取access_token失败
      }
    }).catch(() => {
      next('/login'); // ajax出现错误
    })
  },
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
```

# 授权流程
```
graph TD
in((进入))-->requireAuth{判断路由是否需要鉴权}
requireAuth--不需要-->next
requireAuth--需要-->checkAuth{判断是否已经授权}
checkAuth--已经授权-->type{授权类型}
type--网址参数-->存入sessionStorge
存入sessionStorge-->回调函数
type--sessionStorge-->next
checkAuth--未授权-->授权
授权-->checkQuery{校验参数}
checkQuery--不符合-->error
checkQuery--符合-->组装url
组装url-->请求后台获取accesstoken接口
```

# 关于本插件
由于需要开发公众号，已有插件不能满足需求，遂造轮子
本插件大量参考vue-wechat-auth