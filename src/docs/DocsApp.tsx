/*
 * Alpine Admin — Documentation app
 * Self-contained: imports nothing from outside src/docs/ (except React + lucide-react).
 * To remove: delete src/docs/ and the /docs/* route + root redirect in src/App.tsx.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { DocsLayout } from './components/DocsLayout';
import { IntroductionPage } from './pages/IntroductionPage';
import { GettingStartedPage } from './pages/GettingStartedPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { AuthPage } from './pages/AuthPage';
import { ThemingPage } from './pages/ThemingPage';
import { DeploymentPage } from './pages/DeploymentPage';

export default function DocsApp() {
  return (
    <Routes>
      <Route element={<DocsLayout />}>
        <Route index element={<Navigate to="introduction" replace />} />
        <Route path="introduction" element={<IntroductionPage />} />
        <Route path="getting-started" element={<GettingStartedPage />} />
        <Route path="architecture" element={<ArchitecturePage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="theming" element={<ThemingPage />} />
        <Route path="deployment" element={<DeploymentPage />} />
      </Route>
    </Routes>
  );
}
