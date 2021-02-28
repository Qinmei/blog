import { defineConfig } from 'dumi';
import config from './config';

export default defineConfig({
  title: 'Qinmei',
  favicon: config.favicon,
  logo: config.logo,
  outputPath: 'dist',
  mode: 'site',
  navs: [
    {
      title: '博客',
      path: '/blog',
    },
    {
      title: 'QinVideo',
      path: config.qinVideo,
    },
    {
      title: 'Github',
      path: config.github,
    },
  ],
  menus: {
    '/blog': [
      {
        title: 'Js基础',
        children: ['blog/javascript/01', 'blog/javascript/02', 'blog/javascript/03'],
      },
      {
        title: 'React进阶',
        children: [
          'blog/react/01',
          'blog/react/02',
          'blog/react/03',
          'blog/react/04',
          'blog/react/05',
        ],
      },
      {
        title: 'React源码',
        children: ['blog/code/01', 'blog/code/02'],
      },
      {
        title: 'leetcode',
        children: ['blog/leetcode/01'],
      },
      {
        title: '开源项目',
        children: ['blog/github/qinvideo', 'blog/github/qinplayer'],
      },
    ],
  },
  hash: true,
  ssr: {},
  exportStatic: {},
  styles: [`*{box-sizing: border-box;color:#2c3e50} strong{color:#4569d4} img{width:100%}`],
});
