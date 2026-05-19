import { Nav } from "../Nav";
import { Footer } from "../Footer";
import { RouteProgress } from "../RouteProgress";

const PageWrap = "div";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RouteProgress />
      <PageWrap className="container page">
        <Nav />
        {children}
        <Footer />
      </PageWrap>
    </>
  );
}
