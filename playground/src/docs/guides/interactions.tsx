import ButtonDeleteDraft from '../../examples/foundations/ButtonDeleteDraft';
import buttonDeleteDraftSource from '../../examples/foundations/ButtonDeleteDraft.tsx?raw';
import IconButtonReadingList from '../../examples/foundations/IconButtonReadingList';
import iconButtonReadingListSource from '../../examples/foundations/IconButtonReadingList.tsx?raw';
import IconComposition from '../../examples/foundations/IconComposition';
import iconCompositionSource from '../../examples/foundations/IconComposition.tsx?raw';
import CheckboxReadingTopics from '../../examples/new-forms/CheckboxReadingTopics';
import checkboxReadingTopicsSource from '../../examples/new-forms/CheckboxReadingTopics.tsx?raw';
import CheckboxReadingList from '../../examples/new-forms/CheckboxReadingList';
import checkboxReadingListSource from '../../examples/new-forms/CheckboxReadingList.tsx?raw';
import BadgeStatus from '../../examples/foundations/BadgeStatus';
import badgeStatusSource from '../../examples/foundations/BadgeStatus.tsx?raw';
import AlertAction from '../../examples/content/AlertAction';
import alertActionSource from '../../examples/content/AlertAction.tsx?raw';
import ToastTimer from '../../examples/feedback/ToastTimer';
import toastTimerSource from '../../examples/feedback/ToastTimer.tsx?raw';
import HeadingArticle from '../../examples/content/HeadingArticle';
import headingArticleSource from '../../examples/content/HeadingArticle.tsx?raw';
import TabsCounts from '../../examples/navigation/TabsCounts';
import tabsCountsSource from '../../examples/navigation/TabsCounts.tsx?raw';
import MenuControlled from '../../examples/floating/MenuControlled';
import menuControlledSource from '../../examples/floating/MenuControlled.tsx?raw';
import ToastBasic from '../../examples/feedback/ToastBasic';
import toastBasicSource from '../../examples/feedback/ToastBasic.tsx?raw';
import RadioGroupCommentSignature from '../../examples/new-forms/RadioGroupCommentSignature';
import radioGroupCommentSignatureSource from '../../examples/new-forms/RadioGroupCommentSignature.tsx?raw';
import type { DocPage } from '../types';
import { guideMetadata } from '../guide-catalog';

const page: DocPage = {
  ...guideMetadata('interactions'),
  sections: [
    {
      id: 'actions',
      title: '操作与焦点',
      content: <p>确认、移除与关闭后，保留可继续操作的入口。</p>,
      examples: [
        {
          id: 'button-delete-draft',
          title: '删除确认与恢复',
          description: '确认后删除本地草稿，取消时保留，删除后可恢复。',
          component: ButtonDeleteDraft,
          source: buttonDeleteDraftSource,
        },
        {
          id: 'icon-button-reading-list',
          title: '收藏列表与焦点恢复',
          description: '筛选收藏后移除当前项，焦点移到相邻操作或恢复入口。',
          component: IconButtonReadingList,
          source: iconButtonReadingListSource,
        },
        {
          id: 'controlled',
          title: '菜单触发器移除与恢复',
          description: '移出草稿时转到恢复入口，恢复后返回新菜单按钮。',
          component: MenuControlled,
          source: menuControlledSource,
        },
        {
          id: 'basic',
          title: '清单操作与提示回焦',
          description: '点击提示内的操作查看清单，关闭后仍可从常驻入口访问。',
          component: ToastBasic,
          source: toastBasicSource,
        },
      ],
    },
    {
      id: 'lists',
      title: '筛选与清单',
      content: <p>用同一份本地数据组织筛选、收藏、批量操作与栏目计数。</p>,
      examples: [
        {
          id: 'icon-composition',
          title: '搜索与逐项收藏',
          description: '提交关键词筛选本地手记，点击收藏切换状态；清空后回到输入框。',
          component: IconComposition,
          source: iconCompositionSource,
        },
        {
          id: 'checkbox-reading-topics',
          title: '多选筛选与地址同步',
          description: '勾选多项筛选内容，通过链接或浏览器返回恢复条件。',
          component: CheckboxReadingTopics,
          source: checkboxReadingTopicsSource,
        },
        {
          id: 'checkbox-reading-list',
          title: '批量操作与失败恢复',
          description: '选择文章后确认移出；本地模拟失败时保留选择，支持重试。',
          component: CheckboxReadingList,
          source: checkboxReadingListSource,
        },
        {
          id: 'counts',
          title: '栏目计数与清单操作',
          description: '归档清单中的手记，数量标记与两个面板同步更新。',
          component: TabsCounts,
          source: tabsCountsSource,
        },
      ],
    },
    {
      id: 'feedback',
      title: '表单与反馈',
      content: (
        <p>
          条件字段、保存失败、重试和撤销由各示例管理。统一字段绑定、校验、提交与重置见{' '}
          <a href="#/components/form">Form 表单</a>，使用 FormData 自行取值和管理状态见{' '}
          <a href="#/guides/forms">原生表单接入</a>。
        </p>
      ),
      examples: [
        {
          id: 'radio-comment-signature',
          title: '条件字段与表单值',
          description: '切换选项控制昵称字段，按实际表单值预览署名；本例不发布留言。',
          component: RadioGroupCommentSignature,
          source: radioGroupCommentSignatureSource,
        },
        {
          id: 'badge-status',
          title: '表单校验与状态摘要',
          description: '根据摘要检查结果切换标记。',
          component: BadgeStatus,
          source: badgeStatusSource,
        },
        {
          id: 'alert-action',
          title: '订阅设置与失败重试',
          description: '首次模拟订阅失败，重试后成功；保留已选项，不实际订阅。',
          component: AlertAction,
          source: alertActionSource,
        },
        {
          id: 'timer-and-action',
          title: '计时提示与撤销',
          description:
            '8 秒撤销窗口中，进度条表示已用时；悬停、聚焦或页面进入后台时暂停，恢复后继续剩余时间。',
          component: ToastTimer,
          source: toastTimerSource,
        },
      ],
    },
    {
      id: 'chapters',
      title: '章节导航与分享',
      content: <p>在文章层级之外，组织目录、定位与复制章节地址。</p>,
      examples: [
        {
          id: 'heading-reading-layout',
          title: '章节导航与分享',
          description: '定位章节、复制章节地址；复制失败时可手动复制。',
          component: () => <HeadingArticle hrefPrefix="#/guides/interactions?section=" />,
          source: headingArticleSource,
        },
      ],
    },
  ],
};
export default page;
