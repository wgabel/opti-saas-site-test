export default function NotFound() {
  return (
    <main className="container">
      <h1>Page not found</h1>
      <p>
        No published content exists at this URL. Check that the page is published in Optimizely CMS and
        that its URL starts with the locale, e.g. <code>/en/about</code>.
      </p>
    </main>
  );
}
