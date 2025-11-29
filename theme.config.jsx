export default {
  logo: (
    <span
      style={{
        fontWeight: 700,
        fontSize: "1.25rem",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      Abishek Maharajan Docs
    </span>
  ),
  font: false, // Use Inter from layout
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
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Abishek Maharajan Documentation" />
      <meta
        property="og:description"
        content="Technical documentation and portfolio architecture"
      />
    </>
  ),
  primaryHue: 222,
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
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
