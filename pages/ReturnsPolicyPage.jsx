import React, { useContext } from 'react';
import { ThemeContext } from '../src/contexts/ThemeContext';
import ReturnsPolicySection from '../components/ReturnsPolicySection';

const ReturnsPolicyPage = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-kora text-indigo'} min-h-screen`}>
      <ReturnsPolicySection />
    </div>
  );
};

export default ReturnsPolicyPage;



