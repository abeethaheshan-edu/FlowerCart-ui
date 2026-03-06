export function resolvePath(template, params, query) {
  let path = template;

  if (params !== undefined && params !== null) {
    const values = Array.isArray(params) ? params : [params];

    path = values.reduce((acc, value, index) => {
      const placeholder = `{param${index + 1}}`;

      if (!acc.includes(placeholder)) {
        console.warn(`[resolvePath] "${placeholder}" not found in template: "${template}"`);
        return acc;
      }

      return acc.replaceAll(placeholder, encodePathSegment(String(value)));
    }, template);

    const remaining = path.match(/\{param\d+\}/g);
    if (remaining) {
      console.warn(
        `[resolvePath] unfilled placeholders in "${template}": ${remaining.join(', ')}. ` +
          `Received ${values.length} param(s).`,
      );
    }
  }

  if (query && typeof query === 'object') {
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    if (queryString) path = `${path}?${queryString}`;
  }

  return path;
}

function encodePathSegment(value) {
  return value
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}
