import AvatarExample from '../../examples/content/AvatarExample';
import avatarSource from '../../examples/content/AvatarExample.tsx?raw';
import AvatarPicture from '../../examples/content/AvatarPicture';
import avatarPictureSource from '../../examples/content/AvatarPicture.tsx?raw';
import { defineComponentPage } from '../page';
import { nativeRows, example } from '../page-helpers';

export default defineComponentPage('avatar', {
  importCode: "import { Avatar } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于文章署名、作者介绍和个人资料，以姓名或图片标识人物。需要进入作者页面时，在身份行中提供明确的链接。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        example(
          'avatar-fallback',
          '尺寸与文字回退',
          '比较三档尺寸、完整长姓名与匿名回退；姓名放在头像旁，图形保留短标记。空白姓名显示问号，并使用“匿名用户”作为可访问名称。',
          AvatarExample,
          avatarSource,
        ),
        example(
          'avatar-picture',
          '图片失败与恢复',
          '点击按钮模拟解码失败，再恢复有效的本地图片。加载中或失败时保留姓名回退，头像区域保持 64px。',
          AvatarPicture,
          avatarPictureSource,
        ),
      ],
    },
    {
      id: 'design',
      title: '头像与完整署名',
      content: (
        <p>
          头像内保留简短标记，完整姓名和简介放在旁边。姓名较长时，可用 fallback
          指定一个更容易辨认的字或缩写；关注、联系等操作放在身份信息之外。
        </p>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'AvatarProps',
          rows: [
            {
              name: 'name',
              type: 'string',
              required: true,
              description:
                '去除首尾空白后作为可访问名称；为空时使用匿名用户。默认回退取前两个 Unicode 字符。',
            },
            {
              name: 'src',
              type: 'string',
              description: '去除首尾空白后的图片地址；为空不创建 img，地址变化后重新尝试加载。',
            },
            {
              name: 'fallback',
              type: 'ReactNode',
              defaultValue: 'name 前两个字符；空姓名为 ?',
              description: '图片缺失、加载中或失败时的装饰内容。',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              defaultValue: "'md'",
              description: '默认 32 / 44 / 64px。',
            },
            ...nativeRows('span'),
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '姓名、图片回退与恢复',
      content: (
        <ul>
          {[
            'name 为整个头像提供可访问名称，内部图片和回退内容均为装饰。空白姓名的可访问名称为“匿名用户”，默认显示问号。',
            '缺图、加载中和加载失败时保留回退内容；更换 src 后重新加载，新图片就绪后替换回退。头像尺寸在这个过程中保持不变。',
            'fallback 只放展示内容，不放链接或按钮。头像不接收 children，也不透传原生 img 属性。',
          ].map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ),
    },
  ],
});
