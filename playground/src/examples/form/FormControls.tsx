import { useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  FormError,
  Input,
  RadioGroup,
  SegmentedControl,
  Select,
  Switch,
  Text,
  Textarea,
} from 'yahha-ui';

type Preferences = {
  title: string;
  description: string;
  category: string | null;
  newsletter: boolean;
  frequency: string;
  summary: boolean;
  view: string;
};

const initialValues: Preferences = {
  title: '河边散步小记',
  description: '记录树影和路边新开的花。',
  category: 'journal',
  newsletter: true,
  frequency: 'weekly',
  summary: false,
  view: '',
};

export default function FormControls() {
  const [result, setResult] = useState<{ values: Preferences; message: string } | null>(null);

  return (
    <Form
      aria-label="手记展示设置"
      initialValues={initialValues}
      style={{ display: 'grid', gap: 20, maxWidth: 520 }}
      onReset={() => setResult(null)}
      onSubmit={(values) =>
        setResult({
          values: { ...values },
          message: `读取结果：${values.title} · ${values.category} · ${values.newsletter ? '订阅更新' : '暂不订阅'} · ${values.view}`,
        })
      }
    >
      {(form) => (
        <>
          <Input {...form.input('title')} label="手记标题" required />
          <Textarea {...form.input('description')} label="简短介绍" rows={2} />
          <Select
            {...form.choice('category')}
            label="文章分类"
            required
            options={[
              { value: 'journal', label: '生活手记' },
              { value: 'reading', label: '读书笔记' },
            ]}
          />
          <Checkbox {...form.checked('newsletter')} label="订阅更新" />
          <RadioGroup
            {...form.choice('frequency')}
            label="来信频率"
            options={[
              { value: 'weekly', label: '每周一封' },
              { value: 'monthly', label: '每月精选' },
            ]}
          />
          <div>
            <Switch
              {...form.checked('summary', { errorPlacement: 'external' })}
              label="显示文章摘要"
              required
              hint="本例要求开启后提交。"
            />
            <FormError name="summary" />
          </div>
          <div>
            <SegmentedControl
              {...form.choice('view', { errorPlacement: 'external' })}
              label="默认视图"
              required
              options={[
                { value: 'list', label: '列表' },
                { value: 'cards', label: '卡片' },
              ]}
            />
            <FormError name="view" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button type="submit">读取设置</Button>
            <Button type="reset" variant="secondary">
              重置设置
            </Button>
          </div>
          <Text size="sm" tone="muted" role="status">
            {result && JSON.stringify(result.values) === JSON.stringify(form.values)
              ? result.message
              : ''}
          </Text>
        </>
      )}
    </Form>
  );
}
