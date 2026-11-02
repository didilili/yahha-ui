export const blogHref =
  import.meta.env.VITE_BLOG_URL?.trim() ||
  (import.meta.env.DEV ? 'http://127.0.0.1:4186/' : './blog/');

export const repositoryHref = 'https://github.com/didilili/yahha-ui';
export const feedbackHref = `${repositoryHref}/issues/new?template=bug_report.yml`;
