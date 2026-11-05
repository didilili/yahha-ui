import { Icon, Text } from 'yahha-ui';

export default function IconCustom() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', gap: 32 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
        <Text size="sm" tone="muted">
          自定坐标
        </Text>
        <Icon
          size="lg"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13.5 2.5c-4-.7-8.2.8-9.2 4.4-.7 2.5.7 4.6 3.2 4.6 3.7 0 6.5-4 6-9Z" />
          <path d="m2.5 13.5 7.7-7.7" />
        </Icon>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
        <Text size="sm" tone="muted">
          多色路径
        </Text>
        <Icon size={32}>
          <path
            d="m4.5 5.5 15 .3-.2 13-15-.3Z"
            fill="#def2ff"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="m4.8 5.8 7.1 6 7.3-5.7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16.5" cy="17.5" r="3.5" fill="#f8bed2" />
        </Icon>
      </div>
    </div>
  );
}
