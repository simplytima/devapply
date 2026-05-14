import { Plus } from 'lucide-react';

const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-110 group"
    >
      <Plus size={24} />
    </button>
  );
};

export default FloatingActionButton;