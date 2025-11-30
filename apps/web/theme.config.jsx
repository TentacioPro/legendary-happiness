export default {
  logo: <span style={{ fontWeight: 700, fontSize: "1.25rem" }}>Abishek Maharajan Docs</span>,
  font: false, // Use Inter from layout for better performance
  project: {
    link: "https://github.com/TentacioPro",
  },
  docsRepositoryBase: "https://github.com/TentacioPro/legendary-happiness",
  footer: {
    text: <span>{new Date().getFullYear()} © Abishek Maharajan</span>,
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Abishek Maharajan Docs",
    };
  },
  head: () => (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Abishek Maharajan Documentation" />
      <meta
        property="og:description"
        content="Technical documentation and portfolio architecture"
      />
      {/* Performance hint */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </>
  ),
  primaryHue: 222,
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
    autoCollapse: true, // Auto-collapse inactive sections
  },
  toc: {
    backToTop: true,
    float: true, // Floating TOC for better performance
  },
  search: {
    placeholder: 'Search documentation...',
  },
  navigation: {
    prev: true,
    next: true,
  },
  editLink: {
    text: "Edit this page on GitHub →",
  },
  feedback: {
    content: "Question? Give us feedback →",
    labels: "feedback",
  },
};
