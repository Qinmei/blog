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
      title: 'React源码',
      path: '/react',
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
    ],
    '/react': [
      {
        title: '总览',
        children: ['react/code/01', 'react/code/02'],
      },
      {
        title: '架构设计',
        children: ['react/status/todo'],
      },
      {
        title: '理论实战',
        children: ['react/status/todo'],
      },
    ],
  },
  hash: true,
  ssr: {},
  exportStatic: {},
  styles: [`*{box-sizing: border-box;color:#2c3e50} strong{color:#4569d4} img{width:100%}`],
});
