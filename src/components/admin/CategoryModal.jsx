import React, { useState, useEffect, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { getMainCategories } from '../../firebase/services/categoryService';

const CategoryModal = ({ isOpen, onClose, onSubmit, category, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: null,
    isActive: true,
    imageUrl: ''
  });
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchMainCategories();
      if (category) {
        setFormData({
          name: category.name || '',
          description: category.description || '',
          parentId: category.parentId || null,
          isActive: category.isActive !== undefined ? category.isActive : true,
          imageUrl: category.imageUrl || ''
        });
        setImagePreview(category.imageUrl || null);
        setImageFile(null);
      } else {
        setFormData({ name: '', description: '', parentId: null, isActive: true, imageUrl: '' });
        setImagePreview(null);
        setImageFile(null);
      }
    }
  }, [isOpen, category]);

  const fetchMainCategories = async () => {
    try {
      setLoading(true);
      const cats = await getMainCategories();
      const filtered = category ? cats.filter(c => c.id !== category.id) : cats;
      setMainCategories(filtered);
    } catch (error) {
      console.error('Error fetching main categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPG, PNG, and WEBP files are allowed.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData, imageFile, category?.id);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto py-8 p-4 animate-in fade-in transition-all">
      <div className="bg-kora border border-indigo/20 rounded-none w-full max-w-md shadow-2xl my-auto">
        <div className="flex justify-between items-center px-6 py-5 border-b border-indigo/10">
          <h2 className="font-serif text-2xl text-indigo uppercase tracking-widest">
            {category ? 'Edit Category' : 'New Category'}
          </h2>
          <button
            onClick={onClose}
            className="text-indigo/40 hover:text-terracotta transition-colors p-2 hover:bg-indigo/5 rounded-none"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">
              Category Designation *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
              placeholder="Enter category name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">
              Narrative / Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors resize-none"
              placeholder="Enter category description"
            />
          </div>

          {/* Category Image Upload */}
          <div>
            <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">
              Visual Asset
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-indigo/10 rounded-none overflow-hidden cursor-pointer hover:border-indigo/40 transition-colors bg-kora-light"
              style={{ height: '130px' }}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-indigo/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="text-white text-center">
                      <Camera size={28} className="mx-auto mb-1" />
                      <p className="text-[10px] uppercase font-bold tracking-widest">Update Visual</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo/20">
                  <Camera size={36} className="mb-2" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">Upload Visual Asset</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">
              Hierarchy / Parent
            </label>
            <select
              name="parentId"
              value={formData.parentId || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo appearance-none transition-colors"
            >
              <option value="">Top Level (Root)</option>
              {loading ? (
                <option disabled>Loading hierarchy...</option>
              ) : (
                mainCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              )}
            </select>
          </div>

          {/* Active toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-10 h-5 rounded-none transition-colors ${formData.isActive ? 'bg-indigo' : 'bg-indigo/20'}`}></div>
                <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-kora rounded-none transition-transform ${formData.isActive ? 'translate-x-5' : ''}`}></div>
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo/60">Live / Visible</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-3 border-t border-indigo/10">
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="w-full py-3.5 bg-indigo text-kora rounded-none font-black text-[10px] uppercase tracking-[0.2em] hover:bg-terracotta transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Architecting...' : category ? 'Synchronize Updates' : 'Establish Category'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full py-3.5 border border-indigo/20 text-indigo rounded-none font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo/5 transition-all"
            >
              Discard Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;

