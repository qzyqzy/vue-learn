const regText = /\{\{(.*)\}\}/; // 匹配 {{ }}
const regV = /^v-(.*)$/; // 匹配 v- 

// 观察者
// 包含 订阅与发布两个方法
// 要监听属性时触发订阅方法以实时监听属性
// 数据变化时触发发布方法已更新视图
function Watcher() {
	// 存储要监听的对象 对象为 Observerable的实例对象
	this.watchList = [];
}
Watcher.tempSubscript = ''; // Observerable的实例对象
// 发布更新视图
Watcher.prototype.notify = function() {
	this.watchList.forEach((list) => {
		list.updata();
	})
}
// 订阅监听
Watcher.prototype.subscirpt = function() {
	this.watchList.push(Watcher.tempSubscript);
}
// 可观察对象 
// propName 当前属性、node当前节点、data 数据
// 包含更新方法
function Observerable(keyName, node, data) {
	this.$node = node;
	this.$data = data;
	this.$keyName = keyName;
}

Observerable.prototype.updata = function() {
	if(this.$node.nodeType == 1) {
		this.$node.value = this.$data[this.$keyName];
	} else if(this.$node.nodeType == 3) {
		//替换当前节点的内容
		this.$node.nodeValue = this.$data[this.$keyName];
	}
}

// 创建 MyVue构造函数
// options参数为一个对象  如下所示
/*{
	el: '#app',
	data() {
		return {
			name: 'qzy',
		}
	},
	template: `<div><input type="text" v-model="name" />{{name}}</div>`
}*/

function MyVue(options = {}) {
	this.$options = options; // 参数对象
	this.$el = options.el; // 接收dom元素
	this.$template = options.template; // 渲染的模板字符串
	let dataFn = options.data; // 此刻的data接收的为一个函数
	this.$data = dataFn(); // 获得函数返回的对象数据
	this.observer(this.$data); // 数据劫持
	this.compile(); //编辑模板、解析dom
	// 让this代理this.$data 可以直接使用 .属性  而不是使用  .$data.属性去改变值
	for(let key in this.$data) {
		Object.defineProperty(this, key, {
			enumerable: true,
			get() {
				return this.$data[key]
			},
			set(newValue) {
				this.$data[key] = newValue
			}
		})
	}
}

// 检测数据是否为对象
MyVue.isObject = function(obj) {
	if(!obj || typeof obj !== 'object') {
		return false
	}
	return true
}

// 数据劫持
MyVue.observer = function(obj) {
	// 数据不为对象时返回
	if(!MyVue.isObject(obj)) {
		return
	}
	// 循环对象中的每一个key并劫持
	// 所以在vue中直接新增属性不会监听其变化
	let watcherOwner = new Watcher(); //创建观察者
	for(let key in obj) {
		let defaultValue = obj[key]; //获取初始值
		// 递归操作 如果数据嵌套很多的话 会存在大量闭包 会影响性能
		MyVue.isObject(defaultValue) && MyVue.observer(defaultValue); // 初始值为对象时 也要数据劫持
		Object.defineProperty(obj, key, {
			enumerable: true,
			get() {
				console.log(`属性${key},获取触发`)
				// 如果此时观察者对象存在,添加关联,添加到队列中,然后将其置空
				if(Watcher.tempSubscript) {
					watcherOwner.subscirpt();
					Watcher.tempSubscript = '';
				}
				return defaultValue
			},
			set(newValue) {
				console.log(`属性${key},设置触发`)
				defaultValue = newValue
				MyVue.isObject(defaultValue) && MyVue.observer(defaultValue); // 新值为对象时 也要数据劫持
				watcherOwner.notify() // 数据改变时,通知观察者对象发布更新视图
			}
		})
	}
}
// 数据劫持
// obj为要劫持的对象数据
MyVue.prototype.observer = function(obj) {
	MyVue.observer(obj)
}

// data 数据 取值时用
// node 节点列表
MyVue.compile = function(node, vm) {
	let data = vm.$data;
	// 获取节点并将类数组的结果转化为真正的数组
	let childNodesArr = [].slice.call(node)
	// 循环每一层节点
	childNodesArr.forEach((nodeItem) => {
		let text = nodeItem.textContent; //获取节点中的内容
		// 如果为文本节点且正则能够匹配
		if(nodeItem.nodeType == 3 && (regText.test(text))) {
			// 获取匹配到的节点内容
			let result = regText.exec(text);
			if(result) {
				let keyName = result[1].trim(); // 数据格式如下 text
				// 处理文本节点
				vm.textDom(keyName, nodeItem)
			}
		} else if(nodeItem.nodeType == 1) {
			// input 节点
			// attributes 获取元素上的属性 如 type v-model 
			let attributes = nodeItem.attributes;
			if(!attributes) {
				return
			}
			let attrArr = [].slice.call(attributes)
			attrArr.forEach((attrItem) => {
				let result = regV.exec(attrItem.name)
				if(result) {
					// 例如 v-model v-if v-show 匹配后截取model,if,show,根据不同的指令做不同的动作
					vm.moduleAction[result[1]](attrItem.value, nodeItem, vm.$data)
				}
			})
		}

		// 如果当前节点存在子节点
		if(nodeItem.childNodes) {
			MyVue.compile(nodeItem.childNodes, vm)
		}

	})
}
// 匹配到文本节点处理
MyVue.prototype.textDom = function(key, node) {
	// 实例化观察者对象 再下一步赋值时会触发订阅
	Watcher.tempSubscript = new Observerable(key, node, this.$data)
	node.nodeValue = this.$data[key]
}

// 匹配input节点
MyVue.prototype.moduleAction = {
	model: function(key, node, data) {
		// 实例化观察者对象 再下一步赋值时会触发订阅
		Watcher.tempSubscript = new Observerable(key, node, data)
		node.value = data[key];
		let that = this
		node.addEventListener('input', function(e) {
			data[key] = e.target.value;
		})
	}
}

// 编译模板、解析dom
MyVue.prototype.compile = function() {
	let el = document.querySelector(this.$el); // 获取编译的范围
	// 解析传递进入的字符串模板
	let templateDom = document.createElement('div')
	templateDom.innerHTML = this.$template;
	let fragment = document.createDocumentFragment(); //创建文档片段，存储获取到的dom元素
	let child;
	while(child = templateDom.firstChild) {
		fragment.appendChild(child)
	}
	MyVue.compile(fragment.childNodes, this); // 解析dom
	// 返回内存中的文档片段
	el.appendChild(fragment);
}