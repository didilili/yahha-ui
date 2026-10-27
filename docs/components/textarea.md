# Textarea 多行输入

用于留言、评论、个人简介和需要换行的轻量表单。

边框与错误底色同步使用 150ms 过渡，焦点轮廓立即显示，输入区域不位移，也不通过高度动画表达错误。禁用、减少动效及强制颜色下直接呈现静态状态；可通过 `rows` 设置可见行数，也可纵向调整高度。

默认使用白底、2px 深墨线与安静的长框轮廓，不带投影。标签、提示和错误说明统一使用 4px 水平文字留白，与 TextField、Select 保持相同起点；多行内容保持清楚的阅读行高。

## Props 与默认值

- `label`：`ReactNode`，必填。可见标签，自动关联 textarea。
- `hint / error`：`ReactNode`。辅助和错误说明，与 aria-describedby 合并；error 设置 aria-invalid。
- `rows`：`number`，默认 `4`。原生可见行数。
- `value / defaultValue`：`string | readonly string[] | number`。沿用 React textarea 原生值类型；受控模式搭配 onChange。通常使用 string。
- `onChange`：`ChangeEventHandler<HTMLTextAreaElement>`。原生变化事件。
- `disabled / readOnly / required`：`boolean`，默认 `false（原生）`。原生禁用、只读和必填约束。
- `name / form / maxLength / 其他 textarea 属性`：`ComponentPropsWithRef<"textarea">`。直接作用于 textarea，保留原生输入与表单语义。
- `className`：`string`。根字段 div 的附加类名。
- `classNames`：`{ label?, textarea?, hint?, error? }`。各部分附加类名，每个值为 string。
- `ref / style`：`Ref<HTMLTextAreaElement> / CSSProperties`。作用于真实 textarea。默认 resize: vertical，style 可覆盖。
- `id`：`string`，默认 `自动生成`。textarea 的 ID，用于标签及提示关联。

## 示例

已在应用入口导入 `yahha-ui/style.css` 并由 `ThemeProvider` 包裹时：

```tsx
import { Textarea } from 'yahha-ui';

export function TextareaBasic() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Textarea
        label="给作者留言"
        name="message"
        placeholder="想说的话，可以慢慢写……"
        rows={4}
        hint="支持换行，可以拖动底边调整高度。"
      />
    </div>
  );
}
```

## 键盘与交互

保留 Tab、文字选择、复制和多行编辑的原生行为；Enter 换行，组件不会将 Enter 解释为提交。

## 状态、样式与能力边界

不自动调整高度，不内置富文本、发送请求、字数限制或校验规则。maxLength、rows 与样式由调用方配置；受控值需由调用方重置。

高度由 rows、文字和内边距共同决定，允许纵向调整；rows=1 的短单行与常规 44px 字段对齐。桌面字阶为 14px / 20px，手机或粗指针为 16px / 24px。多行内容不裁成固定单行高度，禁用与只读保持各自原生语义。
