const assets = 'https://assets.qinmei.org';
const images = `${assets}/images`;
const videos = `${assets}/videos`;

const numArr = [...new Array(100).keys()].map(item => item.toString().padStart(3, '0'));

export default {
  favicon: `${images}/favicon.ico`,
  logo: `${images}/logo.svg`,
  github: 'https://github.com/Qinmei',
  qinVideo: 'https://qinvideo.org',
  bg: `${images}/bg.jpeg`,
  videobg: `${images}/video.jpg`,
  reactPic: numArr.slice(1, 4).map(item => `${images}/react/code-${item}.jpg`),
  qinvideoPic: numArr.slice(1, 13).map(item => `${images}/qinvideo/demo-${item}.jpg`),
  qinplayerPic: numArr.slice(1, 6).map(item => `${images}/qinplayer/demo-${item}.png`),
  video: {
    install: `${videos}/install.mp4`,
  },
};
