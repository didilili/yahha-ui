import type { ComponentPropsWithRef } from 'react';
import cloud from '../examples/scenes/artwork/decorative-elements/titles/cloud-note.svg?no-inline';
import tag from '../examples/scenes/artwork/decorative-elements/titles/folded-tag.svg?no-inline';
import washi from '../examples/scenes/artwork/decorative-elements/titles/washi-note.svg?no-inline';
import ribbon from '../examples/scenes/artwork/decorative-elements/titles/soft-ribbon.svg?no-inline';
import flower from '../examples/scenes/artwork/decorative-elements/dividers/flower-line.svg?no-inline';
import star from '../examples/scenes/artwork/decorative-elements/dividers/star-thread.svg?no-inline';
import cloudRule from '../examples/scenes/artwork/decorative-elements/dividers/cloud-scallop.svg?no-inline';
import ink from '../examples/scenes/artwork/decorative-elements/dividers/uneven-stroke.svg?no-inline';
import tags from '../examples/scenes/artwork/decorative-elements/dividers/tag-garland.svg?no-inline';
import './decorative-elements.css';

const titlePictures = { cloud, tag, washi, ribbon };
const rulePictures = { flower, star, cloud: cloudRule, ink, tags };

/** Website decoration; the real heading retains its name, ref and native semantics. */
export function DecorativeTitle({
  as: Tag = 'h2',
  variant = 'cloud',
  className = '',
  children,
  ...props
}: ComponentPropsWithRef<'h2'> & {
  as?: 'h2' | 'h3';
  variant?: keyof typeof titlePictures;
}) {
  return (
    <Tag {...props} className={`decorative-title ${className}`}>
      <img src={titlePictures[variant]} width="320" height="96" alt="" />
      <span>{children}</span>
    </Tag>
  );
}

/** Decorative rule only; it never replaces a semantic content boundary. */
export function DecorativeRule({
  variant = 'flower',
  className = '',
}: {
  variant?: keyof typeof rulePictures;
  className?: string;
}) {
  return (
    <img
      className={`decorative-rule ${className}`}
      src={rulePictures[variant]}
      alt=""
      width="600"
      height={variant === 'tags' ? 60 : 48}
    />
  );
}
