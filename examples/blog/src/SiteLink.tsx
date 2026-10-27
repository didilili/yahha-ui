import { Link, type LinkProps } from 'yahha-ui';
import { navigate } from './router';

export function SiteLink({
  to,
  onClick,
  restoreReadingPosition,
  ...props
}: Omit<LinkProps, 'href'> & { to: string; restoreReadingPosition?: boolean }) {
  return (
    <Link
      {...props}
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === '_blank'
        )
          return;
        if (to.startsWith('#/')) {
          event.preventDefault();
          navigate(to, { restoreReadingPosition });
        }
      }}
    />
  );
}
