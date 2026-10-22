'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  targetSelector: string;
  tip?: string;
  preferredPlacement?: 'top' | 'bottom';
}

interface PageTour {
  pageName: string;
  badge: string;
  steps: TourStep[];
}

const PAGE_TOURS: Record<string, PageTour> = {
  '/': {
    pageName: 'Home',
    badge: 'Welcome to Fair Deal Properties',
    steps: [
      {
        title: 'Institutional Integrity',
        subtitle: 'Nigeria’s Verified Real Estate Platform',
        description: 'Every property on Fair Deal Properties undergoes rigorous on-site inspection and legal title vetting before listing.',
        targetSelector: '.page-hero h1, .hero h1, .nav-brand',
        preferredPlacement: 'bottom',
        tip: 'Click through verified listings or discover our fiduciary advisory services.',
      },
      {
        title: 'Quick Platform Navigation',
        subtitle: 'Explore the Main Modules',
        description: 'Easily navigate to the Opportunities Marketplace, Inspection Hub, Financing Advisory, Services, and Diaspora desks.',
        targetSelector: '.nav-links',
        preferredPlacement: 'bottom',
        tip: 'Active pages are highlighted with a gold underline for quick orientation.',
      },
      {
        title: '4-Step Transaction Safeguards',
        subtitle: 'Structured from Search to Title Transfer',
        description: 'Learn how every opportunity moves through pre-clearance, surveyor inspection, escrow holding, and legal deed conveyance.',
        targetSelector: '.how-timeline, .process-grid, .stats-grid, .hero-trust-inner',
        preferredPlacement: 'top',
        tip: 'No client funds are disbursed until all title covenants are verified.',
      },
      {
        title: 'Book a Strategy Consultation',
        subtitle: 'Speak Directly with a Senior Advisor',
        description: 'Schedule a confidential consultation to review your property acquisition, development, or financing needs.',
        targetSelector: '.cta-actions, .nav-cta, .cta-band',
        preferredPlacement: 'top',
        tip: 'All client consultations are strictly private and bound by non-disclosure.',
      },
    ],
  },
  '/marketplace': {
    pageName: 'Opportunities Marketplace',
    badge: 'Verified Property Browser',
    steps: [
      {
        title: 'Listing Source Filter Tabs',
        subtitle: 'Verified Institutional Pipelines',
        description: 'Filter opportunities by verified capital pipeline: FDP Direct, MREIF, Family Homes Fund, FHA, FMBN, or vetted Developers.',
        targetSelector: '#source-tabs, .src-tab',
        preferredPlacement: 'bottom',
        tip: 'Click any tab to instantly isolate properties from that funding source.',
      },
      {
        title: 'Multi-Parameter Search Bar',
        subtitle: 'Filter by Location, Type, and Budget',
        description: 'Narrow down listings across Abuja, Lagos, and commercial centers by property category, verified title, and budget tier.',
        targetSelector: '#opp-search-bar, input[placeholder*="Search"]',
        preferredPlacement: 'bottom',
        tip: 'Results filter automatically as you select budget and city options.',
      },
      {
        title: 'Verified Property Dossiers',
        subtitle: 'Inspect Evidence & Full Documentation',
        description: 'Click any property card to open the complete dossier. View unedited site photography, survey coordinates, and verified title packs.',
        targetSelector: '#opp-results .opp-card, .marketplace-card, .opp-card, .card',
        preferredPlacement: 'top',
        tip: 'Look for the green Verified badge confirming clean legal title on file.',
      },
    ],
  },
  '/inspections': {
    pageName: 'Inspection Hub',
    badge: 'On-Site Verification Intelligence',
    steps: [
      {
        title: 'Inspection Hub Navigation',
        subtitle: 'Virtual Tour, Physical Request, or Tracking',
        description: 'Switch between the interactive virtual walkthrough, booking a physical surveyor inspection, or tracking an active inspection.',
        targetSelector: '.ins-tabs',
        preferredPlacement: 'bottom',
        tip: 'All walkthrough sessions are cryptographically logged.',
      },
      {
        title: 'Property Selector',
        subtitle: 'Select from Active Verified Assets',
        description: 'Switch between verified properties to load their dated on-site inspection logs and structural surveys.',
        targetSelector: '#vwProp, select',
        preferredPlacement: 'bottom',
        tip: 'Choose Plot 42 Hutu, Maitama Duplex, or Guzape Land.',
      },
      {
        title: 'Inspection Version Strip',
        subtitle: 'Dated, Immutable Historical Audits',
        description: 'Superseded inspection reports remain permanently viewable. Nothing is ever overwritten or deleted from the record.',
        targetSelector: '#verChips, .ver-strip',
        preferredPlacement: 'bottom',
        tip: 'Click any version chip to view the site condition as recorded on that exact date.',
      },
      {
        title: 'Evidence Stage & Surveyor Findings',
        subtitle: 'Photographic Proof & Stamped Findings',
        description: 'Inspect station-by-station evidence captured by named engineers who physically attended the site.',
        targetSelector: '.vw-stage, .vw-card',
        preferredPlacement: 'top',
        tip: 'Click Next Station to cycle through boundary beacons, access roads, and foundation checks.',
      },
    ],
  },
  '/financing': {
    pageName: 'Financing Advisory',
    badge: 'Bridge & Mortgage Advisory',
    steps: [
      {
        title: 'Institutional Mortgage Framework',
        subtitle: 'Formal Nigerian Financing Channels',
        description: 'Compare formal Nigerian mortgage routes—NHF (6%), MREIF (9%), PMIs (9.75%)—against commercial bridge facilities.',
        targetSelector: '.img-band',
        preferredPlacement: 'bottom',
        tip: 'We advise and structure debt terms—we never take balance-sheet lending risk.',
      },
      {
        title: 'Financing Scenario Estimator',
        subtitle: 'Smooth Sliders & Directly Editable Figures',
        description: 'Adjust Property Value, Down Payment, and Loan Term. Move the smooth range sliders or click and type exact numbers directly into the boxes.',
        targetSelector: '.calculator',
        preferredPlacement: 'top',
        tip: 'Typing any figure immediately updates the sliders and repayment figures.',
      },
      {
        title: 'Real-Time Repayment Output',
        subtitle: 'Live Monthly & Interest Calculations',
        description: 'Review estimated monthly repayments, indicative borrowing totals, and total interest calculated at live benchmark rates.',
        targetSelector: '#monthly-rep, .calc-row',
        preferredPlacement: 'top',
        tip: 'Benchmark interest rates are synchronized with the central banking listener.',
      },
    ],
  },
  '/diaspora': {
    pageName: 'Diaspora Advisory',
    badge: 'Remote Investment Stewardship',
    steps: [
      {
        title: 'Remote Investment Protection',
        subtitle: 'Overcome Distance Anxiety',
        description: 'A purpose-built advisory service designed for Nigerians living abroad to acquire property safely at home.',
        targetSelector: '.page-hero',
        preferredPlacement: 'bottom',
        tip: 'Eliminates reliance on informal third parties or emergency flights.',
      },
      {
        title: 'The 8-Point Advisory Package',
        subtitle: 'Full Remote Lifecycle Stewardship',
        description: 'Everything managed: dedicated named advisor, independent legal representation, physical deed vault custody, and quarterly site monitoring.',
        targetSelector: '.diaspora-feature',
        preferredPlacement: 'top',
        tip: 'You receive dated 4K photographic and drone inspection reports every quarter.',
      },
      {
        title: 'Global Regional Hubs',
        subtitle: 'UK 🇬🇧, USA 🇺🇸, Canada 🇨🇦, Worldwide 🌍',
        description: 'Advisory coordination tailored to your local timezone, remittance channels, and foreign exchange repatriation needs.',
        targetSelector: '.grid-4',
        preferredPlacement: 'top',
        tip: 'Connect with an advisor who understands international remittances.',
      },
    ],
  },
  '/services': {
    pageName: 'Our Services',
    badge: 'Core Advisory Pillars',
    steps: [
      {
        title: 'Agency & Transaction Facilitation',
        subtitle: 'Service 1: Full Lifecycle Management',
        description: 'End-to-end management from pre-market opportunity sourcing to price negotiation, legal drafting, and title transfer.',
        targetSelector: '.grid-2:nth-of-type(1)',
        preferredPlacement: 'bottom',
        tip: 'We verify title documents and ownership legitimacy before any transaction begins.',
      },
      {
        title: 'Real Estate Investment Advisory',
        subtitle: 'Service 2: Capital Allocation Counsel',
        description: 'Structured for clients who treat property as a financial yield and capital appreciation asset rather than just a home.',
        targetSelector: '.grid-2:nth-of-type(2)',
        preferredPlacement: 'bottom',
        tip: 'Unbiased advisory designed around your net ROI, not sales commissions.',
      },
      {
        title: 'Bridge-Financing Facilitation',
        subtitle: 'Service 3: Connecting Buyers to Capital',
        description: 'Assisting buyers in bridging liquidity shortfalls and accessing formal mortgage products with transparent terms.',
        targetSelector: '.grid-2:nth-of-type(3)',
        preferredPlacement: 'top',
        tip: 'Explore our financing calculator to model repayment scenarios.',
      },
    ],
  },
  '/technology': {
    pageName: 'Technology & Compliance',
    badge: 'Security, NDPA, & Governance',
    steps: [
      {
        title: 'Security & Compliance Controls',
        subtitle: 'Controls Built to Prove Trust',
        description: 'Learn how our technical architecture safeguards client records, title documents, and transaction workflows.',
        targetSelector: '.img-band',
        preferredPlacement: 'bottom',
        tip: 'Encrypted object storage, role segregation, and immutable audit logging.',
      },
      {
        title: 'Data Protection & NDPA 2023 Compliance',
        subtitle: 'Strict Adherence to Nigeria Data Protection Act',
        description: 'We operate as a registered Data Controller under NDPA 2023 with strict role segregation and privacy enforcement.',
        targetSelector: '.grid-2',
        preferredPlacement: 'top',
        tip: 'You hold full data subject rights to access, rectify, or purge your records.',
      },
      {
        title: 'Regulatory Framework Matrix',
        subtitle: 'SCUML, NDPC, & ESVARBON Standards',
        description: 'Transparent disclosure of the legal boundaries we operate within, including anti-money laundering and certified surveyor partnerships.',
        targetSelector: 'table, [style*="grid-template-columns"], [style*="border: 1px solid"]',
        preferredPlacement: 'top',
        tip: 'We clearly differentiate decision intelligence from statutory appraisal.',
      },
    ],
  },
  '/about': {
    pageName: 'About Us',
    badge: 'Our Mission & Leadership',
    steps: [
      {
        title: 'The Fair Deal Story',
        subtitle: 'Eliminating Real Estate Fraud',
        description: 'Founded to restore certainty, transparency, and institutional integrity to Nigeria’s property sector.',
        targetSelector: '.page-hero',
        preferredPlacement: 'bottom',
        tip: 'Serving individual buyers, corporate investors, and the diaspora.',
      },
      {
        title: 'Our Core Standards & Fiduciary Duty',
        subtitle: 'Verified Listings, Clean Titles, No Hidden Markups',
        description: 'We act as your trusted advisor, ensuring no property is presented without verifiable legal title and physical inspection clearance.',
        targetSelector: '.values-grid, .grid-3',
        preferredPlacement: 'top',
        tip: 'Our reputation is staked on the accuracy of every report we deliver.',
      },
      {
        title: 'Headquarters in Utako, Abuja',
        subtitle: 'Physical Presence with Ground Accountability',
        description: 'Visit our office at No. 4 Ekeh A. Yesufu Close, Utako, Abuja, or connect with our regional representatives in Lagos and Port Harcourt.',
        targetSelector: '.footer-grid, .cta-band',
        preferredPlacement: 'top',
        tip: 'Drop by for an in-person advisory briefing or document inspection.',
      },
    ],
  },
  '/contact': {
    pageName: 'Contact & Booking',
    badge: 'Confidential Consultation',
    steps: [
      {
        title: 'Select Your Advisory Requirement',
        subtitle: 'Personalized Strategy Consultation',
        description: 'Choose your interest: property acquisition, diaspora advisory, bridge financing, developer listing, or private inspection booking.',
        targetSelector: 'form, .contact-grid',
        preferredPlacement: 'bottom',
        tip: 'Specifying your goals helps us pair you with the best specialist advisor.',
      },
      {
        title: 'Seamless Form State Preservation',
        subtitle: 'Your Progress is Automatically Saved',
        description: 'If you click away to inspect our Privacy Notice or Cookie Policy, your form inputs are preserved so you never have to re-type.',
        targetSelector: 'form button[type="submit"], .btn-primary, form',
        preferredPlacement: 'top',
        tip: 'Feel free to review our legal terms without losing your draft.',
      },
    ],
  },
};

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function PageTutorial() {
  const pathname = usePathname() || '/';
  const tourData = PAGE_TOURS[pathname] || PAGE_TOURS['/'];

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFirstTimePrompt, setShowFirstTimePrompt] = useState(false);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  const cardRef = useRef<HTMLDivElement>(null);

  // Check if first time visiting this specific page
  useEffect(() => {
    try {
      const storageKey = `fdp_point_tour_${pathname.replace(/\//g, '_') || 'root'}`;
      const seen = window.localStorage.getItem(storageKey);
      if (!seen) {
        const timer = setTimeout(() => {
          setShowFirstTimePrompt(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, [pathname]);

  const markTourSeen = useCallback(() => {
    try {
      const storageKey = `fdp_point_tour_${pathname.replace(/\//g, '_') || 'root'}`;
      window.localStorage.setItem(storageKey, 'true');
    } catch {}
  }, [pathname]);

  const handleStartTour = () => {
    setShowFirstTimePrompt(false);
    setCurrentStep(0);
    setIsOpen(true);
    markTourSeen();
  };

  const handleDismissPrompt = () => {
    setShowFirstTimePrompt(false);
    markTourSeen();
  };

  // Measure and update the position of the target element
  const updateTargetPosition = useCallback(() => {
    if (!isOpen) return;
    const step = tourData.steps[currentStep];
    if (!step?.targetSelector) return;

    try {
      const el = document.querySelector(step.targetSelector) as HTMLElement;
      if (el) {
        const rect = el.getBoundingClientRect();
        // If element is not in view or zero sized, try child or parent
        if (rect.width > 0 && rect.height > 0) {
          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });

          // Determine whether tooltip should sit above or below
          const cardH = 260;
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;

          if (step.preferredPlacement === 'top' && spaceAbove >= cardH) {
            setPlacement('top');
          } else if (spaceBelow >= cardH) {
            setPlacement('bottom');
          } else if (spaceAbove >= cardH) {
            setPlacement('top');
          } else {
            setPlacement('bottom');
          }
        }
      } else {
        setTargetRect(null);
      }
    } catch {
      setTargetRect(null);
    }
  }, [isOpen, currentStep, tourData]);

  // When step changes, scroll target element into center view, then measure
  useEffect(() => {
    if (!isOpen) return;
    const step = tourData.steps[currentStep];
    if (!step?.targetSelector) return;

    try {
      const el = document.querySelector(step.targetSelector) as HTMLElement;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch {}

    const timer = setTimeout(updateTargetPosition, 320);
    return () => clearTimeout(timer);
  }, [isOpen, currentStep, tourData, updateTargetPosition]);

  // Real-time tracking on window resize / scroll
  useEffect(() => {
    if (!isOpen) return;
    const onScrollOrResize = () => {
      window.requestAnimationFrame(updateTargetPosition);
    };
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isOpen, updateTargetPosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowRight' && currentStep < tourData.steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
      if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, tourData.steps.length]);

  const step = tourData.steps[currentStep];

  // Tooltip geometry calculations
  const cardWidth = typeof window !== 'undefined' ? Math.min(420, window.innerWidth - 32) : 400;
  let cardTop = 100;
  let cardLeft = 16;
  let arrowLeft = cardWidth / 2;

  if (targetRect && typeof window !== 'undefined') {
    const targetCenter = targetRect.left + targetRect.width / 2;
    cardLeft = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, targetCenter - cardWidth / 2));
    arrowLeft = Math.max(24, Math.min(cardWidth - 24, targetCenter - cardLeft));

    if (placement === 'bottom') {
      cardTop = Math.min(window.innerHeight - 280, targetRect.top + targetRect.height + 16);
    } else {
      cardTop = Math.max(20, targetRect.top - 260 - 16);
    }
  }

  return (
    <>
      {/* ── First-time visitor toast ── */}
      {showFirstTimePrompt && !isOpen && (
        <div
          role="region"
          aria-label="Interactive guide prompt"
          style={{
            position: 'fixed',
            bottom: '4.8rem',
            right: '1.25rem',
            zIndex: 850,
            maxWidth: '340px',
            background: 'var(--white)',
            border: '1.5px solid var(--gold)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 16px 40px rgba(0,0,0,.25)',
            padding: '1.1rem 1.25rem',
            animation: 'fadeUp .4s cubic-bezier(.22,1,.36,1) both',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.4rem' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--gold)', fontWeight: 700 }}>
              🎯 Interactive Tour
            </span>
            <button
              onClick={handleDismissPrompt}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--ink-muted)' }}
              aria-label="Dismiss guide prompt"
            >
              ✕
            </button>
          </div>
          <div style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '.35rem', fontFamily: 'var(--font-display)' }}>
            Point-by-point tour of {tourData.pageName}
          </div>
          <p style={{ fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 .85rem 0' }}>
            We'll spotlight each section on this page and point out how to use every part.
          </p>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button
              onClick={handleStartTour}
              style={{
                flex: 1,
                padding: '7px 12px',
                background: 'var(--forest)',
                color: 'var(--white)',
                fontSize: '11.5px',
                fontWeight: 600,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              Start Walkthrough →
            </button>
            <button
              onClick={handleDismissPrompt}
              style={{
                padding: '7px 12px',
                background: 'transparent',
                color: 'var(--ink-muted)',
                fontSize: '11.5px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* ── Persistent Floating Tour Button ── */}
      <button
        onClick={() => {
          setShowFirstTimePrompt(false);
          setCurrentStep(0);
          setIsOpen(true);
        }}
        aria-label={`Open point-by-point tour for ${tourData.pageName}`}
        style={{
          position: 'fixed',
          bottom: '1.1rem',
          right: '1.1rem',
          zIndex: 800,
          background: 'var(--forest)',
          color: 'var(--white)',
          border: '1px solid var(--gold)',
          borderRadius: '50px',
          padding: '9px 16px',
          fontSize: '11.5px',
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          boxShadow: '0 8px 24px rgba(13,43,30,.25)',
          transition: 'all .2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(13,43,30,.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,43,30,.25)';
        }}
      >
        <span style={{ fontSize: '13px' }}>🎯</span>
        <span>Point &amp; Explain Guide</span>
      </button>

      {/* ── Active Tour: Spotlight Mask + Pointer Tooltip Card ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${tourData.pageName} interactive point-by-point tour`}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9990,
            pointerEvents: 'auto',
          }}
        >
          {/* Spotlight Highlight Box around the target element */}
          {targetRect ? (
            <div
              style={{
                position: 'fixed',
                top: Math.max(0, targetRect.top - 6),
                left: Math.max(0, targetRect.left - 6),
                width: targetRect.width + 12,
                height: targetRect.height + 12,
                borderRadius: '8px',
                boxShadow: '0 0 0 3px var(--gold), 0 0 0 9999px rgba(8, 20, 14, 0.76)',
                zIndex: 9992,
                pointerEvents: 'none',
                transition: 'all .3s cubic-bezier(.22,1,.36,1)',
              }}
            />
          ) : (
            // Full backdrop fallback if element not found
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(8, 20, 14, 0.76)',
                zIndex: 9992,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Transparent click catcher to close tour when clicking outside */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9993,
              cursor: 'default',
            }}
          />

          {/* The Tooltip Card pointing at the element */}
          <div
            ref={cardRef}
            style={{
              position: 'fixed',
              top: targetRect ? `${cardTop}px` : '50%',
              left: targetRect ? `${cardLeft}px` : '50%',
              transform: targetRect ? 'none' : 'translate(-50%, -50%)',
              width: `${cardWidth}px`,
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--gold)',
              boxShadow: '0 24px 60px rgba(0,0,0,.6)',
              zIndex: 9998,
              transition: 'all .3s cubic-bezier(.22,1,.36,1)',
              animation: 'ckPop .25s ease both',
              pointerEvents: 'auto',
            }}
          >
            {/* The physical pointer arrow pointing at the target element */}
            {targetRect && (
              <div
                style={{
                  position: 'absolute',
                  ...(placement === 'bottom'
                    ? {
                        top: '-12px',
                        left: `${arrowLeft}px`,
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '11px solid transparent',
                        borderRight: '11px solid transparent',
                        borderBottom: '12px solid var(--white)',
                        filter: 'drop-shadow(0 -2px 1.5px var(--gold))',
                      }
                    : {
                        bottom: '-12px',
                        left: `${arrowLeft}px`,
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '11px solid transparent',
                        borderRight: '11px solid transparent',
                        borderTop: '12px solid var(--white)',
                        filter: 'drop-shadow(0 2px 1.5px var(--gold))',
                      }),
                }}
              />
            )}

            {/* Header */}
            <div
              style={{
                padding: '.85rem 1.25rem',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(250,248,245,.9)',
                borderRadius: 'calc(var(--radius-lg) - 2px) calc(var(--radius-lg) - 2px) 0 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px' }}>🎯</span>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--gold)', fontWeight: 700 }}>
                  Step {currentStep + 1} of {tourData.steps.length}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>· {tourData.pageName}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  color: 'var(--ink-muted)',
                  padding: '2px 6px',
                  lineHeight: 1,
                }}
                aria-label="Exit walkthrough"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.25rem 1.4rem' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  color: 'var(--forest)',
                  margin: '0 0 .25rem 0',
                  fontWeight: 600,
                  lineHeight: 1.25,
                }}
              >
                {step.title}
              </h4>
              <div
                style={{
                  fontSize: '.82rem',
                  fontStyle: 'italic',
                  color: 'var(--gold)',
                  marginBottom: '.75rem',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {step.subtitle}
              </div>

              <p style={{ fontSize: '.88rem', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 .85rem 0' }}>
                {step.description}
              </p>

              {step.tip && (
                <div
                  style={{
                    background: 'rgba(201,168,76,.1)',
                    borderLeft: '3px solid var(--gold)',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    padding: '.55rem .85rem',
                    fontSize: '.8rem',
                    color: 'var(--ink-soft)',
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: 'var(--forest)' }}>👉 Pointer: </strong>
                  {step.tip}
                </div>
              )}

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '1.1rem' }}>
                {tourData.steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    aria-label={`Jump to step ${idx + 1}`}
                    style={{
                      width: idx === currentStep ? '20px' : '7px',
                      height: '7px',
                      borderRadius: '4px',
                      background: idx === currentStep ? 'var(--gold)' : 'var(--border)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all .2s ease',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div
              style={{
                padding: '.85rem 1.25rem',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--white)',
                borderRadius: '0 0 calc(var(--radius-lg) - 2px) calc(var(--radius-lg) - 2px)',
              }}
            >
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '11.5px',
                  color: 'var(--ink-muted)',
                  cursor: 'pointer',
                  padding: '4px 6px',
                }}
              >
                Skip / Close
              </button>

              <div style={{ display: 'flex', gap: '.5rem' }}>
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    style={{
                      padding: '7px 13px',
                      background: 'var(--white)',
                      color: 'var(--forest)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ← Back
                  </button>
                )}

                {currentStep < tourData.steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    style={{
                      padding: '7px 16px',
                      background: 'var(--forest)',
                      color: 'var(--white)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      padding: '7px 18px',
                      background: 'var(--gold)',
                      color: 'var(--forest)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Got It ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
