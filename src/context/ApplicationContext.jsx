import { createContext, useContext, useState, useEffect } from 'react';

const ApplicationContext = createContext();

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within ApplicationProvider');
  }
  return context;
};

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('applications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  const addApplication = (application) => {
    const newApplication = {
      id: Date.now(),
      ...application,
      createdAt: new Date().toISOString(),
    };
    setApplications([newApplication, ...applications]);
  };

  const updateApplication = (id, updatedData) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, ...updatedData } : app
    ));
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const getStats = () => {
    const total = applications.length;
    const interviews = applications.filter(app => app.status === 'interview').length;
    const accepted = applications.filter(app => app.status === 'accepted').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    return { total, interviews, accepted, rejected };
  };

  const getRecentApplications = (limit = 3) => {
    return applications.slice(0, limit);
  };

  return (
    <ApplicationContext.Provider value={{
      applications,
      addApplication,
      updateApplication,
      deleteApplication,
      getStats,
      getRecentApplications,
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};