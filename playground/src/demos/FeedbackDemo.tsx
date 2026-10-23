import { useState } from 'react';
import { ArrowUpRight, Bell } from 'lucide-react';
import { Button, SegmentedControl, Toast } from '../../../src/index';
import { feedback, type Notice, type Notify } from '../data';
import { DemoSection } from '../shared';

export function FeedbackDemo({ notify }: { notify: Notify }) {
  const [tone, setTone] = useState<Notice['tone']>('success');
  const [previewVisible, setPreviewVisible] = useState(true);
  return (
    <DemoSection
      id="feedback"
      title="每件小事，都有回应。"
      component="Toast"
      description="成功、提醒、出错，用简短的话说清楚。一次只出现一条，不打断手上的事。"
      code={
        '<Toast open={open} onClose={() => setOpen(false)}\n  tone="success" title="小心愿，已经收好啦。"\n  description="下次再来，也能继续这份好心情。" />'
      }
    >
      <div className="feedback-stage">
        <div className="feedback-toolbar">
          <SegmentedControl<Notice['tone']>
            className="feedback-picker"
            classNames={{ options: 'feedback-picker-options', option: 'feedback-picker-option' }}
            label="提示消息类型"
            value={tone}
            onValueChange={(value) => {
              setTone(value);
              setPreviewVisible(true);
            }}
            options={[
              { value: 'success', label: '成功' },
              { value: 'info', label: '提醒' },
              { value: 'error', label: '出错' },
            ]}
          />
          <Button
            className="feedback-demo-trigger"
            variant="ghost"
            size="sm"
            onClick={() => {
              setPreviewVisible(false);
              notify(feedback[tone]);
            }}
          >
            弹出这条消息
            <ArrowUpRight size={14} />
          </Button>
        </div>
        <div className="toast-preview">
          {previewVisible ? (
            <Toast open onClose={() => setPreviewVisible(false)} {...feedback[tone]} />
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setPreviewVisible(true)}>
              再显示一次
            </Button>
          )}
        </div>
        <p className="feedback-note">
          <Bell size={13} />
          下面是静态样张；点「弹出这条消息」，试试页面角落的提示。
        </p>
      </div>
    </DemoSection>
  );
}
