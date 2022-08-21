const assets = 'https://assets.qinmei.org';
const images = `${assets}/web/images`;

const numArr = [...new Array(100).keys()].map(item => item.toString().padStart(3, '0'));

export default {
  favicon: `${images}/common/favicon.ico`,
  logo: `${images}/common/logo.svg`,
  github: 'https://github.com/Qinmei',
  qinVideo: 'https://qinvideo.org',
  bg: `${images}/common/bg.jpeg`,
  reactPic: numArr.slice(1, 4).map(item => `${images}/react/code-${item}.jpg`),
};
