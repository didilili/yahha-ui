import {
  Bell,
  Inbox,
  MousePointer2,
  PanelTop,
  SlidersHorizontal,
  TextCursorInput,
} from 'lucide-react';
import lounge from './assets/lounge.png';
import reading from './assets/reading.png';
import rest from './assets/rest.png';

export const themes = [
  { value: 'pink', label: '粉色' },
  { value: 'blue', label: '浅蓝' },
  { value: 'yellow', label: '浅黄' },
] as const;
export const themeNames = { pink: '粉色', blue: '浅蓝', yellow: '浅黄' };
export const navigation = [
  { id: 'buttons', label: '按钮', Icon: MousePointer2 },
  { id: 'fields', label: '输入框', Icon: TextCursorInput },
  { id: 'choices', label: '分段筛选', Icon: SlidersHorizontal },
  { id: 'dialog', label: '弹窗', Icon: PanelTop },
  { id: 'empty', label: '空状态', Icon: Inbox },
  { id: 'feedback', label: '提示消息', Icon: Bell },
];
export const scenes = {
  read: {
    image: reading,
    title: '一起，翻两页书。',
    description: '不着急，一点点进步也很棒。',
    tag: '学习时间',
  },
  make: {
    image: lounge,
    title: '有个小点子，试试看！',
    description: '和朋友一起，把想法慢慢做出来。',
    tag: '动手时间',
  },
  rest: {
    image: rest,
    title: '现在，休息一下。',
    description: '今天已经很努力了，先把自己照顾好。',
    tag: '放空时间',
  },
};
export type SceneName = keyof typeof scenes;
export type Notice = { title: string; description?: string; tone: 'success' | 'info' | 'error' };
export const feedback: Record<Notice['tone'], Notice> = {
  success: {
    title: '小心愿，已经收好啦。',
    description: '下次再来，也能继续这份好心情。',
    tone: 'success',
  },
  info: { title: '稍等一下，大家还在路上。', description: '可以先做一点别的事情。', tone: 'info' },
  error: { title: '这次没成功，再试一次吧。', description: '刚刚写下的内容还在。', tone: 'error' },
};

export type Notify = (notice: Notice) => void;
