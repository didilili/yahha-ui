export const cx = (...values: (string | undefined | false)[]) => values.filter(Boolean).join(' ');
