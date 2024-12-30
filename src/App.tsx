import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import MapView from './pages/MapView';
import About from './pages/About';
import Help from './pages/Help';
import Contact from './pages/Contact';
import Press from './pages/Press';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Accessibility from './pages/Accessibility';
import Careers from './pages/Careers';
import Investors from './pages/Investors';
import ResidentServices from './pages/ResidentServices';
import DeveloperServices from './pages/DeveloperServices';
import CouncilServices from './pages/CouncilServices';
import Auth from './pages/Auth';
import AuthSuccess from './pages/AuthSuccess';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Cookies from './pages/Cookies';

// Content pages
import PlanningBasics from './pages/content/PlanningBasics';
import LocalPlans from './pages/content/LocalPlans';
import SustainableDevelopment from './pages/content/SustainableDevelopment';
import PlanningAppeals from './pages/content/PlanningAppeals';
import HeritageConservation from './pages/content/HeritageConservation';
import PlanningAuthorities from './pages/content/PlanningAuthorities';

import SavedPage from './pages/saved';
import ApplicationsDashboardMapPage from './pages/applications/dashboard/map';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/applications/dashboard/map" element={<ApplicationsDashboardMapPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/press" element={<Press />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/resident-services" element={<ResidentServices />} />
        <Route path="/developer-services" element={<DeveloperServices />} />
        <Route path="/council-services" element={<CouncilServices />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<Auth />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Content pages */}
        <Route path="/content/planning-basics" element={<PlanningBasics />} />
        <Route path="/content/local-plans" element={<LocalPlans />} />
        <Route path="/content/sustainable-development" element={<SustainableDevelopment />} />
        <Route path="/content/planning-appeals" element={<PlanningAppeals />} />
        <Route path="/content/heritage-conservation" element={<HeritageConservation />} />
        <Route path="/content/planning-authorities" element={<PlanningAuthorities />} />
        <Route path="/saved" element={<SavedPage />} />
      </Routes>
    </Router>
  );
};

export default App;
