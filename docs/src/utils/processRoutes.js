export default function processRoutes(routes, path) {
  const versionMatch = path.match(/^\/docs\/(v[0-9]+)\//);
  const docsVersion = versionMatch ? versionMatch[1] : null;

  const preprocessedRoutes = routes.filter(
    route =>
      !route.slug.startsWith('/docs/') ||
      route.slug.startsWith(`/docs/${docsVersion}/`) ||
      route.slug.match(/^\/docs\/v[0-9]+\/$/)
  );

  return preprocessedRoutes;
}
