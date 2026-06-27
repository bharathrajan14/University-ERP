// ─────────────────────────────────────────────────────────────────
//  HOMEPAGE COMPONENT
//
//  This is a PAGE component — its job is composition, not UI.
//  It assembles section components into the correct order and
//  provides no visual markup of its own beyond a <> Fragment.
//
//  The distinction between page components and UI components:
//
//    UI components (Navbar, Hero, StatsBar):
//      → Know how to look and behave
//      → Live in src/components/
//
//    Page components (HomePage, LoginPage, RegisterPage):
//      → Know which components to compose and in what order
//      → Know which data to fetch for this page (future tasks)
//      → Live in src/pages/
//
//  This separation means you can rearrange the page by editing
//  ONE file (HomePage.jsx) without touching any component.
// ─────────────────────────────────────────────────────────────────
import Navbar   from '../components/Navbar';
import Hero     from '../components/Hero';
import StatsBar from '../components/StatsBar';

const HomePage = () => {
  return (
    // React Fragment (<>) lets us return multiple siblings without
    // adding an extra <div> to the DOM.
    //
    // Why avoid extra divs?
    //   • Cleaner DOM — easier to inspect and style
    //   • Avoids breaking CSS layouts that depend on direct child
    //     selectors (e.g. flexbox, grid)
    <>
      {/* Navbar renders at the top — position: sticky in its CSS
          keeps it visible on scroll. */}
      <Navbar />

      {/* <main> is a semantic landmark. There should be exactly ONE
          <main> per page. It wraps the primary content and lets
          screen readers jump directly to it via a keyboard shortcut. */}
      <main>
        <Hero />
        <StatsBar />
      </main>
    </>
  );
};

export default HomePage;
