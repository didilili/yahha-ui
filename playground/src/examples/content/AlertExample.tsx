import { Alert, Text } from 'yahha-ui';

const notices = [
  { tone: 'info', title: '阅读提示', description: '这篇文章包含一些个人记录，可以慢慢读。' },
  { tone: 'success', title: '草稿已保存', description: '下次打开时可以继续编辑。' },
  { tone: 'warning', title: '还有一项没有填写', description: '补充联系邮箱后再提交。' },
  { tone: 'error', title: '发送失败', description: '内容仍保留在输入框中，请稍后重试。' },
] as const;

export default function AlertExample() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {notices.map(({ tone, title, description }) => (
        <div key={tone} style={{ display: 'grid', gap: 8 }}>
          <Text size="sm" tone="muted">
            {tone === 'info'
              ? '信息'
              : tone === 'success'
                ? '成功'
                : tone === 'warning'
                  ? '警告'
                  : '错误'}
            {tone === 'info' ? '（默认）' : ''}
          </Text>
          <Alert tone={tone} title={title}>
            {description}
          </Alert>
        </div>
      ))}
    </div>
  );
}
