import { Select } from 'yahha-ui';

export default function SelectPortalCustomization() {
  return (
    <>
      <style>{`
        .yahha-example-archive-field {
          width: 100%;
          max-width: 360px;
        }
        .yahha-example-archive-popup {
          background: #f1f8ff;
        }
        .yahha-example-archive-option {
          font-weight: 600;
        }
      `}</style>
      <Select
        label="手记分类"
        defaultValue="reading"
        hint="给这篇手记选一个归档位置。"
        className="yahha-example-archive-field"
        classNames={{
          popup: 'yahha-example-archive-popup',
          option: 'yahha-example-archive-option',
        }}
        options={[
          { value: 'walking', label: '散步手记' },
          { value: 'reading', label: '阅读摘记' },
          { value: 'travel', label: '旅行记录（稍后开放）', disabled: true },
        ]}
      />
    </>
  );
}
