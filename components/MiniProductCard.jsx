import React from 'react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../src/utils/imageUtils.jsx';

/**
 * MiniProductCard — clean 2-column grid card matching
 * the "You May Also Like" style in the Product Detail Page.
 * Image: 3/4 aspect ratio, rounded-2xl, no overlay buttons.
 * Text: UPPERCASE bold name + RS: price with strikethrough.
 */
export const MiniProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group cursor-pointer flex flex-col"
      style={{ gap: '10px' }}
    >
      {/* Image */}
      <div
        style={{
          overflow: 'hidden',
          borderRadius: '16px',
          background: 'var(--kora-dark)',
          aspectRatio: '3/4',
          position: 'relative',
          width: '100%',
        }}
      >
        <LazyImage
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            display: 'block',
            transition: 'transform 0.5s ease',
          }}
          className="group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div>
        <p
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#1A0D0D',
            marginBottom: '3px',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            lineHeight: '1.3',
          }}
        >
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A0D0D' }}>
            RS: {(Number(product.price) || 0).toLocaleString()}
          </span>
          {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
            <span style={{ fontSize: '12px', color: '#909090', textDecoration: 'line-through' }}>
              {(Number(product.originalPrice) || 0).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MiniProductCard;
