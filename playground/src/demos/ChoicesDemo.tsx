import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Badge, SegmentedControl } from '../../../src/index';
import { scenes, type SceneName } from '../data';
import { Art, DemoSection } from '../shared';

export function ChoicesDemo() {
  const [scene, setScene] = useState<SceneName>('read');
  const currentScene = scenes[scene];
  return (
    <DemoSection
      id="choices"
      title="今天，想做点什么？"
      component="SegmentedControl"
      description="在几个小选项之间切换，让角色跟着场景一起变化。"
      code={
        '<SegmentedControl label="切换日常场景"\n  value={scene} onValueChange={setScene}\n  options={[{ value: "read", label: "一起学习" },\n    { value: "make", label: "动手试试" },\n    { value: "rest", label: "休息一会儿" }]} />'
      }
    >
      <div className="scene-stage">
        <div className="scene-toolbar">
          <SegmentedControl<SceneName>
            className="scene-picker"
            classNames={{ options: 'scene-picker-options', option: 'scene-picker-option' }}
            label="切换日常场景"
            value={scene}
            onValueChange={setScene}
            options={[
              { value: 'read', label: '一起学习' },
              { value: 'make', label: '动手试试' },
              { value: 'rest', label: '休息一会儿' },
            ]}
          />
          <span>用方向键，也能切换</span>
        </div>
        <div className="scene-world" data-scene={scene}>
          <div className="scene-copy">
            <Badge tone="accent">{currentScene.tag}</Badge>
            <h3>{currentScene.title}</h3>
            <p>{currentScene.description}</p>
            <span className="scene-little-line">
              <BookOpen size={15} />
              小小日常，也值得认真对待。
            </span>
          </div>
          <Art src={currentScene.image} />
        </div>
      </div>
    </DemoSection>
  );
}
