export default defineAppConfig({
  pages: [
    'pages/treatment/index',
    'pages/checkin/index',
    'pages/compare/index',
    'pages/mine/index',
    'pages/treatmentDetail/index',
    'pages/photoDetail/index',
    'pages/compareDetail/index',
    'pages/reminder/index',
    'pages/message/index',
    'pages/privacy/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FBF5F7',
    navigationBarTitleText: '美丽成长册',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#9B8B98',
    selectedColor: '#D4A0B8',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/treatment/index',
        text: '疗程'
      },
      {
        pagePath: 'pages/checkin/index',
        text: '打卡'
      },
      {
        pagePath: 'pages/compare/index',
        text: '对比'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
