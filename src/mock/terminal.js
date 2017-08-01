import Mock from 'mockjs';


const List = [];
const count = 10;


for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    no: /\d{10}/,
    'state|1': [1, 0],
    name: '@cname',
    address: '@county(true)',
    date: '@datetime',
    'alarmPhone|1': ['13531544954', '13632250649', '15820292420', '15999905612']
  }));
}

export default {
  getTerminalList: () => List,
  getArticle: () => ({
    no: 120000000001,
    author: { key: 'mockPan' },
    source_name: '原创作者',
    category_item: [{ key: 'global', name: '全球' }],
    comment_disabled: false,
    content: '<p>我是测试数据我是测试数据</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
    content_short: '我是测试数据',
    display_time: +new Date(),
    image_uri: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
    platforms: ['a-platform'],
    source_uri: 'https://github.com/PanJiaChen/vue-element-admin',
    status: 'published',
    tags: [],
    title: ''
  })
};
