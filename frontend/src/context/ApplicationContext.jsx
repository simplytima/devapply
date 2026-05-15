import { createContext, useContext, useState, useEffect } from 'react';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../services/api';
import { useAuth } from './AuthContext';

const ApplicationContext = createContext();

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within ApplicationProvider');
  }
  return context;
};

export const ApplicationProvider = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadApplications();
    } else {
      setApplications([]);
    }
  }, [user]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const addApplication = async (application) => {
    try {
      const newApplication = await createApplication(application);
      setApplications([newApplication, ...applications]);
      return newApplication;
    } catch (error) {
      console.error('Failed to add application:', error);
      throw error;
    }
  };

  const updateApplicationById = async (id, updatedData) => {
    try {
      const updated = await updateApplication(id, updatedData);
      setApplications(applications.map(app => 
        app._id === id ? updated : app
      ));
      return updated;
    } catch (error) {
      console.error('Failed to update application:', error);
      throw error;
    }
  };

  const deleteApplicationById = async (id) => {
    try {
      await deleteApplication(id);
      setApplications(applications.filter(app => app._id !== id));
    } catch (error) {
      console.error('Failed to delete application:', error);
      throw error;
    }
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
      loading,
      addApplication,
      updateApplication: updateApplicationById,
      deleteApplication: deleteApplicationById,
      getStats,
      getRecentApplications,
      refreshApplications: loadApplications,
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};