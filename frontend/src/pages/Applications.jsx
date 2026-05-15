import { useState, useEffect } from 'react';
import { useApplications } from '../context/ApplicationContext';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationForm from '../components/ApplicationForm';
import FloatingActionButton from '../components/FloatingActionButton';
import ExportButton from '../components/ExportButton';

const Applications = () => {
  const { applications, addApplication, updateApplication, deleteApplication } = useApplications();
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  useEffect(() => {
    const handleOpenForm = () => {
      setEditingApp(null);
      setShowForm(true);
    };
    
    window.addEventListener('openAddForm', handleOpenForm);
    return () => window.removeEventListener('openAddForm', handleOpenForm);
  }, []);

  const handleEdit = (app) => {
    setEditingApp(app);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteApplication(id);
    }
  };

  const handleSubmit = (data) => {
    if (editingApp) {
      updateApplication(editingApp.id, data);
    } else {
      addApplication(data);
    }
    setEditingApp(null);
  };

  return (
    <div className="text-white p-6">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-slate-400 mt-1">
            Manage all your job applications in one place
          </p>
        </div>
        <ExportButton applications={applications} />
      </div>

      {/* Applications Table */}
      <ApplicationTable
        applications={applications}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => {
        setEditingApp(null);
        setShowForm(true);
      }} />

      {/* Form Modal */}
      {showForm && (
        <ApplicationForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingApp(null);
          }}
          initialData={editingApp}
        />
      )}
    </div>
  );
};

export default Applications;