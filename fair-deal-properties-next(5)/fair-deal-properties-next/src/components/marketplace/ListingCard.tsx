'use client';

import Image from 'next/image';
import type { Listing } from '@/data/listings';

interface Props {
  listing: Listing;
  view: 'grid' | 'list';
  saved: boolean;
  onToggleSave: (listing: Listing) => void;
  onEnquire: (listing: Listing) => void;
}

export default function ListingCard({ listing, view, saved, onToggleSave, onEnquire }: Props) {
  return (
    <div className={view === 'list' ? 'opp-card opp-card-list' : 'opp-card'}>
      <div className="opp-media">
        <Image
          src={listing.image}
          alt={listing.imageAlt}
          width={800}
          height={450}
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="opp-media-top">
          <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
            {listing.badges.slice(0, 2).map((b, i) => (
              <span
                key={b + i}
                className="img-badge"
                style={b.includes('Featured')
                  ? { background: 'var(--gold)', color: 'var(--forest)', borderColor: 'var(--gold)' }
                  : undefined}
              >
                {b}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {listing.badges.slice(2).map((b, i) => (
              <span key={b + i} className="img-badge">{b}</span>
            ))}
          </div>
        </div>
        <div className="opp-media-bot">
          <div className="opp-media-ttl">{listing.title}</div>
          <div className="opp-media-sub">{listing.subtitle}</div>
        </div>
      </div>

      <div className="opp-card-body">
        <div className="opp-meta-row">
          <svg className="opp-icon" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {listing.location}
        </div>
        <div className="opp-meta-row">
          <svg className="opp-icon" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          {listing.specification}
        </div>

        <p className="opp-desc">{listing.description}</p>

        {listing.tags.length > 0 && (
          <div className="opp-tags">
            {listing.tags.map((t, i) => (
              <span key={t + i} className={i === listing.tags.length - 1 ? 'opp-tag tag-gold' : 'opp-tag'}>
                {t}
              </span>
            ))}
          </div>
        )}

        {listing.amenities.length > 0 && (
          <div className="opp-amenities">
            {listing.amenities.map((a, i) => <span key={a + i} className="opp-am">{a}</span>)}
          </div>
        )}
      </div>

      <div className="opp-card-footer">
        <div>
          <div className="opp-price-label">{listing.priceLabel}</div>
          <div className="opp-price">{listing.priceDisplay}</div>
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button
            className={saved ? 'opp-save-btn saved' : 'opp-save-btn'}
            onClick={() => onToggleSave(listing)}
            title={saved ? 'Remove from saved' : 'Save'}
            aria-pressed={saved}
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'}
                 stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button className="opp-enquire-btn" onClick={() => onEnquire(listing)} type="button">
            Enquire
          </button>
        </div>
      </div>
    </div>
  );
}
