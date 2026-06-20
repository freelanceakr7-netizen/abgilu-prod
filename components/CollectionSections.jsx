import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../src/contexts/ThemeContext';
import { useContext } from 'react';

const CollectionSections = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleShopNow = (category) => {
    // Navigate to shop page with the specific category
    navigate(`/shop?category=${category}`);
  };

  return (
    <div className={`py-12 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Men's Collection */}
          <div className="relative group cursor-pointer" onClick={() => handleShopNow('heritage-edit')} style={{ minHeight: '450px' }}>
            <div className="overflow-hidden rounded-none h-full">
              <img
                src="https://images.unsplash.com/photo-1610030196859-2833c9d27e25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=705&q=80"
                alt="The Heritage Edit"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ minHeight: '600px' }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <div className="text-center text-white p-6">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  The Heritage <br />Edit
                </h2>
                <p className="text-lg mb-4">Sarees & Unstitched Fabrics</p>
                <button
                  className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-none hover:bg-gray-200 transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShopNow('heritage-edit');
                  }}
                >
                  Explore Collection
                </button>
              </div>
            </div>
          </div>

          {/* Women's Collection */}
          <div className="relative group cursor-pointer" onClick={() => handleShopNow('signature-line')} style={{ minHeight: '600px' }}>
            <div className="overflow-hidden rounded-none h-full">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=705&q=80"
                alt="The Signature Line"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ minHeight: '600px' }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <div className="text-center text-white p-6">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                 The Signature <br />Line
                </h2>
                <p className="text-lg mb-4">Ready-to-Wear Kurtas & Sets</p>
                <button
                  className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-none hover:bg-gray-200 transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShopNow('signature-line');
                  }}
                >
                  Explore Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionSections;

