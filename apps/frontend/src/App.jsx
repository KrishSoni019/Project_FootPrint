import LandingPage from "./features/landing/LandingPage";

/**
 * App
 * At this stage of the project there's only one route: the public landing
 * page. React Router and authenticated routes get added in Phase B, once
 * auth exists — wiring routing in now, before there's a second page to
 * route to, would be complexity with nothing to justify it yet.
 */
function App() {
  return <LandingPage />;
}

export default App;
