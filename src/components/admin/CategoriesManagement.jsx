import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight, ChevronDown, ChevronRight } from 'lucide-react';
import CategoryModal from './CategoryModal';
import { useCategoryContext } from '../../contexts/CategoryContext';

const CategoriesManagement = ({
  categories,
  searchTerm,
  setSearchTerm,
  onEditCategory,
  onDeleteCategory,
  onToggleCategoryStatus,
  deletingCategoryId,
  updatingCategoryId,
  onAddCategory,
  isSubmitting,
  editingCategory
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const { categoriesWithSubcategories, loading: loadingCategories, refreshCategoriesWithSubcategories } = useCategoryContext();

  useEffect(() => {
    if (editingCategory) {
      setIsModalOpen(true);
    }
  }, [editingCategory]);

  const toggleCategoryExpansion = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (editingCategory) {
      onEditCategory(null);
    }
  };

  const handleAddCategorySubmit = async (formData, imageFile, categoryId) => {
    try {
      await onAddCategory(formData, imageFile, categoryId);
      handleCloseModal();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const getStatusClass = (isActive) => {
    return isActive 
      ? 'bg-green-500/10 text-green-700 border border-green-500/20'
      : 'bg-terracotta/10 text-terracotta border border-terracotta/20';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const filterCategories = (categories, searchTerm) => {
    if (!searchTerm) return categories;
    
    return categories.filter(category => {
      const matchesMain = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubcategories = category.subcategories?.some(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return matchesMain || matchesSubcategories;
    });
  };

  const filteredCategories = filterCategories(categoriesWithSubcategories, searchTerm);

  const renderCategoryRow = (category, isSubcategory = false, level = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    return (
      <React.Fragment key={category.id}>
        <tr className={`hover:bg-kora-light transition-colors group ${isSubcategory ? 'bg-indigo/[0.02]' : ''}`}>
          <td className="py-4 px-6 text-indigo">
            <div className="flex items-center gap-3" style={{ paddingLeft: `${level * 24}px` }}>
              {!isSubcategory && hasSubcategories && (
                <button
                  onClick={() => toggleCategoryExpansion(category.id)}
                  className="p-1 hover:bg-indigo/10 rounded-none transition-colors text-indigo/60"
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              )}
              {!isSubcategory && !hasSubcategories && <div className="w-6" />}
              
              <div className="w-10 h-10 border border-indigo/10 bg-indigo/5 rounded-none overflow-hidden p-0.5 flex-shrink-0">
                {category.imageUrl ? (
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-full object-cover rounded-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo/20">
                    <Search size={14} />
                  </div>
                )}
              </div>

              <div>
                <div className="font-bold text-sm tracking-tight">{category.name}</div>
                {category.description && (
                  <div className="text-[10px] text-indigo/40 uppercase font-bold tracking-widest max-w-[200px] truncate">{category.description}</div>
                )}
              </div>
            </div>
          </td>
          <td className="py-4 px-6 text-indigo/60 text-[10px] uppercase font-bold tracking-widest">
            {isSubcategory ? 'Sub' : 'Main'}
          </td>
          <td className="py-4 px-6">
            <span className={`inline-flex px-3 py-1 rounded-none text-[10px] uppercase font-bold tracking-widest ${getStatusClass(category.isActive)}`}>
              {getStatusText(category.isActive)}
            </span>
          </td>
          <td className="py-4 px-6 text-indigo/40 font-bold tabular-nums text-xs">
            {category.subcategories?.length || 0}
          </td>
          <td className="py-4 px-6 text-right">
            <div className="flex items-center justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              <button
                onClick={() => onToggleCategoryStatus(category.id)}
                disabled={updatingCategoryId === category.id}
                className="p-2 border border-indigo/20 text-indigo hover:bg-indigo hover:text-kora rounded-none transition-colors disabled:opacity-50"
                title={category.isActive ? 'Deactivate' : 'Activate'}
              >
                {updatingCategoryId === category.id ? (
                  <div className="animate-spin rounded-none h-4 w-4 border-b-2 border-current mx-auto"></div>
                ) : category.isActive ? (
                  <ToggleRight size={16} />
                ) : (
                  <ToggleLeft size={16} />
                )}
              </button>
              <button
                onClick={() => onEditCategory(category)}
                className="p-2 border border-indigo/20 text-indigo hover:bg-indigo hover:text-kora rounded-none transition-colors"
                title="Edit Category"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDeleteCategory(category.id)}
                disabled={deletingCategoryId === category.id}
                className="p-2 border border-terracotta/20 text-terracotta hover:bg-terracotta hover:text-white rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Category"
              >
                {deletingCategoryId === category.id ? (
                  <div className="animate-spin rounded-none h-4 w-4 border-b-2 border-current mx-auto"></div>
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </td>
        </tr>
        
        {!isSubcategory && isExpanded && category.subcategories?.map(subcategory => 
          renderCategoryRow(subcategory, true, level + 1)
        )}
      </React.Fragment>
    );
  };

  return (
    <>
      <div className="bg-kora border border-indigo/10 rounded-none shadow-md overflow-hidden">
        <div className="p-6 border-b border-indigo/10 bg-kora-light">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-auto flex-grow max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo/40" size={20} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
              />
            </div>
            <button
              onClick={handleAddCategory}
              disabled={isSubmitting}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#4C0E0E] text-white rounded-none hover:bg-terracotta transition-all text-[10px] uppercase font-bold tracking-[0.2em] shadow-lg shadow-maroon/10 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-none h-5 w-5 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add Category
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#4C0E0E] text-white">
              <tr>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Category</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Type</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Status</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Subs</th>
                <th className="text-right py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo/10 text-indigo">
              {loadingCategories ? (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="animate-spin rounded-none h-10 w-10 border-b-2 border-indigo"></div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Search size={48} className="text-indigo/10" />
                      <p className="text-indigo/40 text-sm italic">
                        {searchTerm ? 'No matches found.' : 'Your category list is empty.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map(category => renderCategoryRow(category))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddCategorySubmit}
        category={editingCategory}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default CategoriesManagement;

