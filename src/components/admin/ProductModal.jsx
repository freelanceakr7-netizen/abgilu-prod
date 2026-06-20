import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Plus, Trash2 } from 'lucide-react';
import { getMainCategories, getSubcategoriesByParentId } from '../../firebase/services/categoryService';

const initialProductState = {
  name: '',
  category: '',
  subcategory: '',
  price: '',
  originalPrice: '',
  sizes: [], // Will store objects: { size: string, stock: number }
  colors: [],
  description: '',
  fabricDetails: '',
  stock: 0, // Total stock (calculated from sizes)
  images: [],
  isPreOrder: false,
  preOrderPrice: '',
  expectedShippingDate: '',
  preOrderStock: 0,
  preOrderMessage: ''
};

const ProductModal = ({ isOpen, onClose, onSubmit, editingProduct, isSubmitting }) => {
  const [productFormData, setProductFormData] = useState(initialProductState);
  const [imageFiles, setImageFiles] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [newSizeStock, setNewSizeStock] = useState(0);

  useEffect(() => {
    if (editingProduct) {
      // Handle legacy sizes (array of strings) or new sizes (array of objects)
      const formattedSizes = Array.isArray(editingProduct.sizes) 
        ? editingProduct.sizes.map(s => typeof s === 'string' ? { size: s, stock: editingProduct.stock || 0 } : s)
        : [];

      setProductFormData({
        name: editingProduct.name,
        category: editingProduct.category || '',
        subcategory: editingProduct.subcategory || '',
        price: editingProduct.price,
        originalPrice: editingProduct.originalPrice,
        sizes: formattedSizes,
        colors: editingProduct.colors || [],
        description: editingProduct.description,
        fabricDetails: editingProduct.fabricDetails,
        stock: editingProduct.stock || 0,
        position: editingProduct.position !== undefined ? editingProduct.position : null,
        images: editingProduct.images || [],
        isPreOrder: editingProduct.isPreOrder || false,
        preOrderPrice: editingProduct.preOrderPrice || '',
        expectedShippingDate: editingProduct.expectedShippingDate || '',
        preOrderStock: editingProduct.preOrderStock || 0,
        preOrderMessage: editingProduct.preOrderMessage || ''
      });
      
      if (editingProduct.category) {
        loadSubcategories(editingProduct.category);
      }
    } else {
      setProductFormData(initialProductState);
    }
    setImageFiles([]);
  }, [editingProduct, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchMainCategories();
    }
  }, [isOpen]);

  // Recalculate total stock whenever sizes change
  useEffect(() => {
    const totalStock = productFormData.sizes.reduce((sum, s) => sum + (parseInt(s.stock) || 0), 0);
    if (totalStock !== productFormData.stock) {
      setProductFormData(prev => ({ ...prev, stock: totalStock }));
    }
  }, [productFormData.sizes]);

  const fetchMainCategories = async () => {
    try {
      setLoadingCategories(true);
      const categories = await getMainCategories();
      setMainCategories(categories);
    } catch (error) {
      console.error('Error fetching main categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadSubcategories = async (categoryId) => {
    try {
      setLoadingCategories(true);
      const subcats = await getSubcategoriesByParentId(categoryId);
      setSubcategories(subcats);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setProductFormData({
      ...productFormData,
      category: categoryId,
      subcategory: '' 
    });
    
    if (categoryId) {
      loadSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  };

  const handleAddSize = () => {
    if (!newSize.trim()) return;
    
    // Check if size already exists
    if (productFormData.sizes.some(s => s.size.toLowerCase() === newSize.trim().toLowerCase())) {
      alert('This size already exists');
      return;
    }

    setProductFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: newSize.trim(), stock: parseInt(newSizeStock) || 0 }]
    }));
    setNewSize('');
    setNewSizeStock(0);
  };

  const handleRemoveSize = (index) => {
    setProductFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateSizeStock = (index, stock) => {
    const updatedSizes = [...productFormData.sizes];
    updatedSizes[index].stock = parseInt(stock) || 0;
    setProductFormData(prev => ({ ...prev, sizes: updatedSizes }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) {
      e.stopPropagation();
      return;
    }

    // Ensure sizes and colors are properly formatted
    const formDataToSubmit = {
      ...productFormData,
      colors: Array.isArray(productFormData.colors) ? productFormData.colors : productFormData.colors.split(',').map(c => c.trim()).filter(c => c)
    };
    
    onSubmit(formDataToSubmit, imageFiles, editingProduct?.id);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setProductFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleClose = () => {
    setProductFormData(initialProductState);
    setImageFiles([]);
    setSubcategories([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-indigo/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-kora border border-indigo/10 rounded-none shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-indigo/10 pb-4">
            <h2 className="text-3xl font-black text-indigo uppercase tracking-tight">
              {editingProduct ? 'Edit Product' : 'New Product'}
            </h2>
            <button onClick={handleClose} className="text-indigo/40 hover:text-terracotta transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo/60 mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo/60 mb-2">Category</label>
                <select
                  value={productFormData.category}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
                  required
                >
                  <option value="">Select a category</option>
                  {loadingCategories ? (
                    <option>Loading categories...</option>
                  ) : (
                    mainCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo/60 mb-2">Subcategory</label>
                <select
                  value={productFormData.subcategory}
                  onChange={(e) => setProductFormData({...productFormData, subcategory: e.target.value})}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
                  disabled={!productFormData.category || loadingCategories}
                >
                  <option value="">
                    {productFormData.category ? 'Select subcategory' : 'Select category first'}
                  </option>
                  {subcategories.map(subcat => (
                    <option key={subcat.id} value={subcat.id}>
                      {subcat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo/60 mb-2">Price (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={productFormData.price}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setProductFormData({...productFormData, price: val === '' ? '' : parseFloat(val)});
                  }}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors font-bold"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo/60 mb-2">Original Price (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={productFormData.originalPrice}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setProductFormData({...productFormData, originalPrice: val === '' ? '' : parseFloat(val)});
                  }}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/20 rounded-none text-sm text-indigo/40 focus:outline-none focus:border-indigo transition-colors"
                />
              </div>
            </div>

            {/* Inventory & Sizes Section */}
            <div className="pt-6 border-t border-indigo/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo mb-4 flex items-center justify-between">
                <span>Sizes & Inventory</span>
                <span className="text-terracotta text-[10px]">Total Stock: {productFormData.stock}</span>
              </h3>
              
              <div className="space-y-4">
                {/* Existing Sizes */}
                {productFormData.sizes.map((sizeObj, index) => (
                  <div key={index} className="flex items-center gap-4 bg-indigo/5 p-3 rounded-none border border-indigo/5">
                    <div className="flex-grow flex items-center gap-4">
                      <div className="w-16 h-10 flex items-center justify-center bg-indigo text-kora text-xs font-bold">
                        {sizeObj.size}
                      </div>
                      <div className="flex-grow">
                        <label className="block text-[9px] uppercase font-bold text-indigo/40 mb-1">Quantity in Stock</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={sizeObj.stock}
                          onChange={(e) => handleUpdateSizeStock(index, e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full px-3 py-2 bg-kora border border-indigo/10 text-xs font-bold"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(index)}
                      className="p-2 text-indigo/30 hover:text-terracotta transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                {/* Add New Size Row */}
                <div className="flex items-end gap-4 p-3 border border-dashed border-indigo/20">
                  <div className="flex-grow grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-indigo/40 mb-1">Size Name (e.g. XL)</label>
                      <input
                        type="text"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        className="w-full px-3 py-2 bg-kora border border-indigo/20 text-xs"
                        placeholder="Size"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-indigo/40 mb-1">Initial Stock</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={newSizeStock}
                        onChange={(e) => setNewSizeStock(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full px-3 py-2 bg-kora border border-indigo/20 text-xs"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="h-10 px-4 bg-indigo text-kora flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-terracotta transition-colors"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Position & Display */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo/60 mb-2">Display Position</label>
              <input
                type="number"
                min="0"
                step="1"
                value={productFormData.position !== null && productFormData.position !== undefined ? productFormData.position : ''}
                onChange={(e) => setProductFormData({...productFormData, position: e.target.value === '' ? null : parseInt(e.target.value)})}
                placeholder="Default sort (highest value shows first)"
                className="w-full px-4 py-3 bg-kora-light border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
              />
            </div>

            {/* Pre-Order Section */}
            <div className="pt-4 border-t border-indigo/10">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={productFormData.isPreOrder}
                    onChange={(e) => setProductFormData({...productFormData, isPreOrder: e.target.checked})}
                  />
                  <div className={`w-10 h-5 rounded-none transition-colors ${productFormData.isPreOrder ? 'bg-indigo' : 'bg-indigo/20'}`}></div>
                  <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-kora rounded-none transition-transform ${productFormData.isPreOrder ? 'translate-x-5' : ''}`}></div>
                </div>
                <div>
                  <span className="text-sm font-bold text-indigo uppercase tracking-wider">Available for Pre-Order</span>
                </div>
              </label>
            </div>

            {productFormData.isPreOrder && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-indigo/5 p-6 rounded-none border border-indigo/10 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo/60 mb-2">Pre-Order Price</label>
                  <input
                    type="number"
                    value={productFormData.preOrderPrice}
                    onChange={(e) => setProductFormData({...productFormData, preOrderPrice: parseFloat(e.target.value) || ''})}
                    className="w-full px-4 py-2 bg-kora border border-indigo/20 rounded-none text-sm text-indigo"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo/60 mb-2">Estimated Shipping</label>
                  <input
                    type="text"
                    value={productFormData.expectedShippingDate}
                    onChange={(e) => setProductFormData({...productFormData, expectedShippingDate: e.target.value})}
                    placeholder="Late Oct 2023"
                    className="w-full px-4 py-2 bg-kora border border-indigo/20 rounded-none text-sm text-indigo"
                  />
                </div>
              </div>
            )}
            
            {/* Description & Media */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo/60 mb-2">Description</label>
              <textarea
                required
                value={productFormData.description}
                onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-kora-light border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors resize-none"
              />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo/60 mb-2">Media Assets</label>
              <div className="border-2 border-dashed border-indigo/10 bg-kora-light rounded-none p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <Upload size={32} className="text-indigo/20 group-hover:text-indigo transition-colors mb-4" />
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-indigo/40 group-hover:text-indigo">
                    Drop images here or click to browse
                  </span>
                </label>
              </div>
              
              {/* Image Previews */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-6">
                {productFormData.images.map((image, index) => (
                  <div key={`existing-${index}`} className="relative aspect-square group">
                    <img
                      src={image}
                      alt={`Product asset ${index + 1}`}
                      className="w-full h-full object-cover rounded-none border border-indigo/10"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-indigo text-kora rounded-none p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {imageFiles.map((file, index) => (
                  <div key={`new-${index}`} className="relative aspect-square group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New asset ${index + 1}`}
                      className="w-full h-full object-cover rounded-none border border-indigo/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-indigo text-kora rounded-none p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-8 border-t border-indigo/10">
              <button
                type="button"
                onClick={handleClose}
                className="px-8 py-3 bg-kora-light border border-indigo/20 text-indigo rounded-none hover:bg-indigo/5 transition-colors text-[10px] uppercase font-bold tracking-widest"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-indigo text-kora rounded-none hover:bg-terracotta transition-colors disabled:opacity-50 text-[10px] uppercase font-bold tracking-widest"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-none h-4 w-4 border-b-2 border-current"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
