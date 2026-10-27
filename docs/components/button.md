# Button / IconButton

`Button` 渲染原生 `<button>`；`IconButton` 使用同一个按钮实现，适合仅有图标的操作。

## Props 与默认值

- `ButtonProps` 继承原生 button 属性，含 `ref`、`disabled`、`onClick`、`name`、`form` 等；`type` 默认为 `"button"`，表单提交需显式写 `type="submit"`。
- `variant`：`"primary" | "secondary" | "ghost"`，默认 `"primary"`。
- `size`：`"sm" | "md" | "lg"`，默认 `"md"`。
- `loading` 默认 `false`；为 `true` 时禁用按钮、设置 `aria-busy`，并用三墨点在视觉上替换 `startIcon`。前图标隐藏后保留图标空间，按钮文字和 `endIcon` 继续显示；没有前图标时墨点放在已有内边距中，加载切换不增加按钮宽高。
- `startIcon`、`endIcon` 接收 `ReactNode`，包装元素对辅助技术隐藏；操作含义由按钮文字说明。
- `IconButtonProps` 不含 `startIcon` / `endIcon`，必须传入 `aria-label`，图标放在 `children` 中。
- `IconButton` 加载时用同一组三墨点替换原图标，保留固定点击区和 `aria-label`；普通 Button 加载时继续保留文字。

`ref` 指向原生 button；`className` 与 `style` 也作用于该 button。组件没有内部业务状态，`loading` 和 `disabled` 由调用方控制。

## 默认视觉与状态

- `primary` 使用主题浅色面、2px 深墨轮廓、细亮边与 3px 硬底边，按下时底边收短；`secondary` 为奶白平面描边；`ghost` 保持轻量。
- 按钮采用圆钝轮廓，三种尺寸的最小高度依次为 `sm` 36px、`md` 44px、`lg` 52px；IconButton 使用相同尺寸的方形点击区域。相应控件字阶为 12 / 14 / 16px、行框为 16 / 20 / 24px；长文字可增高。
- 文字按钮的前后 SVG 图标按 `sm / md / lg` 使用 16 / 18 / 20px 图框；IconButton 的直接 SVG 图标使用 18 / 20 / 22px 图框。图框在原点击区域内居中，不撑高按钮；保留 SVG 的 `viewBox` 与长宽比。自定义文字、表情或其他插槽内容不按 SVG 尺寸强制缩放。
- 通过原生 `aria-pressed` 表达收藏等切换状态时，按钮会显示选中提示；状态仍由调用方维护。
- 选中状态保留浅色面与内侧墨线，三种变体在悬停时使用同一档强调色。悬停只表示可以操作，不撤回收藏状态；键盘焦点另用外侧 2px 轮廓表示。
- 按下时用 60ms 压低 1px 并收短底边，松手用 150ms 回位；不额外缩放或弹跳。选中按钮按住时仍保留内侧墨线，不临时出现外侧底边。
- 普通禁用按钮保留可读文字，并移除底边阴影。加载按钮保留原有视觉层次和文字或可访问名称，同时拦截激活。
- 加载墨点与 Spinner 使用一致的三墨点图形和透明度节拍，不移动文字或点击区域。悬停反馈只在支持悬停的设备上生效；减少动效时取消按压位移，并显示静止墨点。

## 使用与排版

- 同一组任务保留一个主要操作，例如“发表留言”；保存草稿等并列操作使用 `secondary`，暂缓或次要操作使用 `ghost`。三个变体的文字与点击尺度相同，层次来自填色、轮廓和按压底边。
- `sm` 用于正文附近的紧凑操作，`md` 用于常规表单和文章动作，`lg` 用于需要更明显的入口。36 / 44 / 52px 是短文字的最小高度；长名称在容器内完整换行，按钮自然增高，前后图标保留自己的空间。
- 图标辅助辨认动作，文字应独立说明含义；没有文字的操作改用带 `aria-label` 的 `IconButton`。不要只用星形或颜色表示收藏是否成功。
- 加载期间保持按钮名称稳定，例如一直使用“保存草稿”，在按钮外用 `role="status"` 提供“正在保存”与完成结果。更改文字也会更改固有宽度，组件不会替业务文案预留宽度；有前图标时，三墨点替换它并保留图标空间。
- `style={{ width: '100%' }}` 可以适配窄栏；保留组件自身的 padding、行框与轮廓。按钮不截断操作名称，也不需要通过缩小字号来适配手机。

## 示例

```tsx
import { useState } from 'react';
import { Button, IconButton, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';

export function ButtonExample() {
  const [saved, setSaved] = useState(false);

  return (
    <ThemeProvider theme="chiikawa">
      <Button aria-pressed={saved} onClick={() => setSaved(!saved)}>
        {saved ? '已收藏' : '收藏这篇文章'}
      </Button>
      <IconButton
        aria-label="取消文章收藏"
        variant="ghost"
        disabled={!saved}
        onClick={() => setSaved(false)}
      >
        <span aria-hidden="true">×</span>
      </IconButton>
    </ThemeProvider>
  );
}
```

## 键盘约定

保留原生按钮的 Tab 聚焦和 Enter / Space 激活行为。禁用与加载按钮不能聚焦或点击。图标按钮的 `aria-label` 应描述动作，例如“关闭提示”。
