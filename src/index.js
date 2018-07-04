import wechatAuth from './wechatAuth';

export default {
		install (Vue, options) {
			let router = options.router;
			let wechatPlugin = new wechatAuth(options)
			if (!router) return false;

			//绑定到路由上
			router.beforeEach((to, from, next) => {
				if(to.matched.some(record => record.meta.wechatAuth)) {// 判断是否需要授权
					if(window.sessionStorage.getItem('wxcode')){// 判断是否已经有授权
						next();
					}else if(to.query.code){ //判断是否是微信的回调地址
						wechatPlugin.getCodeCallback(next, to.query.code);
					}else{ //去获取code
						wechatPlugin.getCode();
					}
				}else{
					next();
				}
			});
		}
}