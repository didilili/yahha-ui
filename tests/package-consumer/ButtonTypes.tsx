import { BookmarkIcon, Button, IconButton, type ButtonProps, type IconButtonProps } from 'yahha-ui';

const softButton: ButtonProps = { appearance: 'soft', children: '收藏文章' };
const softIconButton: IconButtonProps = { appearance: 'soft', 'aria-label': '收藏文章' };

// @ts-expect-error Button uses functional icons; animal decoration is not a public property.
const invalidButton: ButtonProps = { decoration: 'cat' };
// @ts-expect-error IconButton keeps a single functional glyph, without corner decoration.
const invalidIconButton: IconButtonProps = { 'aria-label': '收藏文章', decoration: 'paw' };

void invalidButton;
void invalidIconButton;

export const validButtons = (
  <>
    <Button {...softButton} startIcon={<BookmarkIcon />} />
    <IconButton {...softIconButton}>
      <BookmarkIcon />
    </IconButton>
  </>
);
