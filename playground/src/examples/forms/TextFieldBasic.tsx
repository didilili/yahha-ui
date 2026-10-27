import { TextField } from 'yahha-ui';

export default function TextFieldBasic() {
  return (
    <TextField
      label="博客名称"
      name="blogName"
      defaultValue="我的小小记录"
      placeholder="给你的博客起一个名字"
      autoComplete="off"
    />
  );
}
