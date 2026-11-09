import { Input } from 'yahha-ui';

export default function TextFieldCustomization() {
  return (
    <>
      <style>{`
        .yahha-example-nickname-field {
          width: 100%;
          max-width: 360px;
        }
        .yahha-example-nickname-hint {
          padding: 8px 12px;
          border-radius: 8px;
          background: #fff0f6;
          color: #49313d;
        }
      `}</style>
      <Input
        label="手记署名"
        defaultValue="库米"
        maxLength={12}
        hint="用朋友们认识的名字，最多 12 个字符。"
        className="yahha-example-nickname-field"
        classNames={{ hint: 'yahha-example-nickname-hint' }}
      />
    </>
  );
}
