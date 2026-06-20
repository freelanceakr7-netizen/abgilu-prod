import React from 'react';
import { ThemeContext } from '../src/contexts/ThemeContext';

const TopCategories = ({ navigateTo }) => {
  const { theme } = React.useContext(ThemeContext);
  
  const categories = [
    {
      id: 1,
      name: 'The Heritage Edit',
      description: 'Curated handloom sarees sourced directly from weaver clusters across India. Featuring pure cottons, silk-cottons, and natural dyes.',
      color: '#4c0e0e',
      image: 'https://images.unsplash.com/photo-1610030196859-2833c9d27e25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      link: '/shop?category=heritage-edit'
    },
    {
      id: 2,
      name: 'The Signature Line',
      description: 'Pre-designed collections released in "Drops." Featuring functional pockets, breathable linings, and office-appropriate cuts in standard sizes.',
      color: '#4c0e0e',
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      link: '/shop?category=signature-line'
    },
    {
      id: 3,
      name: 'The Custom Atelier',
      description: 'Our premium service. Select fabric and silhouette, provide measurements, and receive a garment stitched exclusively for you with "Marginal Adjustments" guarantee.',
      color: '#4c0e0e',
      image: 'https://images.unsplash.com/photo-1618788374896-5b8e4d6b0b9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      link: '/shop?category=custom-atelier'
    },
    {
      id: 4,
      name: 'Trousseau & Gifting',
      description: 'Wedding packing and bulk orders service. Coming soon with specialized trousseau curation and corporate gifting solutions.',
      color: '#4c0e0e',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      link: '/shop?category=trousseau-gifting'
    }
  ];

  return (
    <div className={`py-12 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
           
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: theme === 'dark' ? '#ffffff' : '#4c0e0e' }}>Our Service Offerings</h2>
          <div className={`w-20 h-1 ${theme === 'dark' ? 'bg-white' : 'bg-black'} mx-auto`}></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group cursor-pointer" onClick={() => navigateTo(category.link)}>
              <div className="overflow-hidden rounded-none mb-4 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-20 opacity-70"
                  style={{ backgroundColor: category.color }}
                ></div>
              </div>
              <div className="text-center">
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: theme === 'dark' ? '#ffffff' : category.color }}
                >
                  {category.name}
                </h3>
                <p className={`mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {category.description}
                </p>
                <a
                  href={category.link}
                  className="inline-flex items-center font-medium transition-colors"
                  style={{
                    color: theme === 'dark' ? '#ffffff' : category.color,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1';
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(category.link);
                  }}
                >
                  + Explore Service
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCategories;

