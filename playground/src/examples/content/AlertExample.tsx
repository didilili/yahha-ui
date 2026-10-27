import { Alert } from 'yahha-ui';

export default function AlertExample() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Alert title="阅读提示">这篇文章包含一些个人记录，可以慢慢读。</Alert>
      <Alert tone="success" title="草稿已保存">
        下次打开时可以继续编辑。
      </Alert>
      <Alert tone="warning" title="还有一项没有填写">
        补充联系邮箱后再提交。
      </Alert>
      <Alert tone="error" title="这次没有发送成功">
        内容仍保留在输入框中，请稍后重试。
      </Alert>
    </div>
  );
}
