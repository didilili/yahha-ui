import { Avatar } from 'yahha-ui';

const picture =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#d7eaf5"/><text x="40" y="53" text-anchor="middle" font-size="40" fill="#462e31">米</text></svg>',
  );

export default function AvatarBasic() {
  return <Avatar name="库米" src={picture} />;
}
