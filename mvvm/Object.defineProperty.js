//  访问器属性

let person = {
	_age: 18
}
Object.defineProperty(person, 'age', {
	configurable: true,
	enumerable: true, // 是否可枚举
	get() {
		console.log('获取时触发')
		return this._age
	},
	set(newValue) {
		console.log('设置新值时触发')
		this._age = newValue
	}
})

for(let key in person) {
	console.log(key)
}
console.log(person.age)
person.age = 15;