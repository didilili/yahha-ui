import { Accordion } from 'yahha-ui';

export default function AccordionBasic() {
  return (
    <Accordion
      defaultValue={['rss']}
      items={[
        {
          value: 'rss',
          title: '如何订阅这个小站？',
          content: (
            <p style={{ margin: 0 }}>把本站的 RSS 地址添加到你的阅读器，有新文章时就能看到更新。</p>
          ),
        },
        {
          value: 'comments',
          title: '我可以给文章留言吗？',
          content: (
            <p style={{ margin: 0 }}>可以在文章下方分享想法。联系表单适合需要单独回复的内容。</p>
          ),
        },
        {
          value: 'frequency',
          title: '多久更新一次？',
          content: <p style={{ margin: 0 }}>没有固定频率。遇到值得记下的小事，就会慢慢写出来。</p>,
        },
      ]}
    />
  );
}
