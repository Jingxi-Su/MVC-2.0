import './app1.css'
import $ from 'jquery'

const eventBus = $(window)
// 数据相关都放到m
const m = {
  data: {
    n: parseInt(localStorage.getItem('n'))//拿到上一次的数据并把localStorage里面的字符串改为int
  },
  create() {},
  delete() {},
  update(data) {
    Object.assign(m.data, data)//把data的所有属性复制给m.data
    eventBus.trigger('m:updated')//触发事件
    localStorage.setItem('n', m.data.n)
  },
  get() {}
}
// 视图相关都放到v
const v = {
  el: null,//容器
//初始化html
  html: `
  <div>
    <div class="output">
      <span id="number">{{n}}</span>
    </div>
    <div class="actions">
      <button id="add1">+1</button>
      <button id="minus1">-1</button>
      <button id="mul2">*2</button>
      <button id="divide2">÷2</button>
    </div>
  </div>
`,
  init(container) {
    v.el = $(container)
  },
  //初始化数据
  render(n) {
    if (v.el.children.length !== 0) v.el.empty()
    $(v.html.replace('{{n}}', n))
      .appendTo(v.el)
  }
}
// 其他都c
const c = {
  init(container) {
    v.init(container)
    v.render(m.data.n) // view = render(data)
    c.autoBindEvents()
    eventBus.on('m:updated', () => {//监听事件
      console.log('here')
      v.render(m.data.n)//渲染
    })
  },
  events: {
    'click #add1': 'add',
    'click #minus1': 'minus',
    'click #mul2': 'mul',
    'click #divide2': 'div',
  },
  add() {
    m.update({n: m.data.n + 1})
  },
  minus() {
    m.update({n: m.data.n - 1})
  },
  mul() {
    m.update({n: m.data.n * 2})
  },
  div() {
    m.update({n: m.data.n / 2})
  },
  autoBindEvents() {
    for (let key in c.events) {
      const value = c[c.events[key]]//对应的函数,key是冒号前的，c.events[key]就是key对应的event（冒号后）
      const spaceIndex = key.indexOf(' ')//得到第一个空格的索引
      const part1 = key.slice(0, spaceIndex)
      const part2 = key.slice(spaceIndex + 1)
      v.el.on(part1, part2, value)
    }
  }
}

export default c

