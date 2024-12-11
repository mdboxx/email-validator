import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import SingleValidation from '../pages/SingleValidation';
import BulkValidation from '../pages/BulkValidation';
import Results from '../pages/Results';
import SmtpPage from '../pages/SmtpPage';
import SettingsPage from '../pages/SettingsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/validate" element={<SingleValidation />} />
      <Route path="/bulk" element={<BulkValidation />} />
      <Route path="/results" element={<Results />} />
      <Route path="/smtp" element={<SmtpPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
};

export default AppRoutes;