import {
  Accordion,
  Badge,
  Button,
  Checkbox,
  EmptyState,
  Heading,
  IconButton,
  Pagination,
  RadioGroup,
  Select,
  Tabs,
  Toast,
  Tooltip,
} from 'yahha-ui';

/** These opt-ins must also exist in the installed declaration files. */
export const decoratedComponents = (
  <>
    <Button loading loadingVariant="biscuit">
      保存
    </Button>
    <IconButton aria-label="保存" loading loadingVariant="dots" />
    <Checkbox label="接收来信" highlightSelected />
    <RadioGroup
      label="频率"
      options={[]}
      value="weekly"
      onValueChange={() => {}}
      highlightSelected
    />
    <Select label="分类" options={[]} selectedIndicator="stamp" />
    <Heading decoration="underline">章节</Heading>
    <Badge tone="success" appearance="stamp">
      已完成
    </Badge>
    <Tabs label="栏目" items={[]} appearance="ink" />
    <Pagination currentPage={1} totalPages={2} onPageChange={() => {}} appearance="circled" />
    <Accordion items={[]} appearance="soft" />
    <Tooltip trigger={<Button>说明</Button>} content="补充说明" showArrow={false} />
    <Toast title="已保存" open onClose={() => {}} appearance="receipt" />
    <EmptyState title="暂无手记" motif="paper" />
  </>
);

// @ts-expect-error A loading appearance cannot introduce a character asset.
const invalidLoading = <Button loadingVariant="animal" />;
// @ts-expect-error Checked is a native state, not a decoration preset string.
const invalidHighlight = <Checkbox label="来信" highlightSelected="paper" />;
// @ts-expect-error A standalone arrow flag does not add a Tooltip artwork mode.
const invalidArrow = <Tooltip trigger={<Button>说明</Button>} content="说明" showArrow="none" />;
// @ts-expect-error Existing artwork remains caller content, not a named character motif.
const invalidMotif = <EmptyState title="暂无手记" motif="chiikawa" />;
void invalidLoading;
void invalidHighlight;
void invalidArrow;
void invalidMotif;
