/**
 * Functions the carried-over widget module attaches to `window`.
 *
 * Marketplace, Inspections and Financing use the published markup unchanged, and that
 * markup calls these by name. They are declared here so the inline handlers resolve,
 * rather than being cast away at each call site.
 *
 * The signatures are permissive by necessity: these are carried-over functions whose
 * arguments were never typed, and inventing precise signatures would assert a contract
 * nobody checked. The implementations live in public/legacy/widgets.js, generated from
 * the published script by build_legacy_widgets.py.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    oppFilter: (...args: any[]) => void;
    oppSort: (...args: any[]) => void;
    oppTypeFilter: (...args: any[]) => void;
    resetOppFilters: (...args: any[]) => void;
    setView: (...args: any[]) => void;
    switchSource: (...args: any[]) => void;
    saveProperty: (...args: any[]) => void;
    showSavedProperties: (...args: any[]) => void;
    openEnquiry: (...args: any[]) => void;
    closeEnquiry: (...args: any[]) => void;
    submitEnquiry: (...args: any[]) => void;
    submitAlert: (...args: any[]) => void;
    filterP3: (...args: any[]) => void;
    updateCount: (...args: any[]) => void;
    filterListings: (...args: any[]) => void;
    insTab: (...args: any[]) => void;
    insSubmit: (...args: any[]) => void;
    trkDemo: (...args: any[]) => void;
    trkLookup: (...args: any[]) => void;
    vwInit: (...args: any[]) => void;
    vwShow: (...args: any[]) => void;
    vwStep: (...args: any[]) => void;
    vwSwitch: (...args: any[]) => void;
    vwVer: (...args: any[]) => void;
    vwCert: (...args: any[]) => void;
    vwLog: (...args: any[]) => void;
    vwRenderVers: (...args: any[]) => void;
    vwRenderStations: (...args: any[]) => void;
    updateCalc: (...args: any[]) => void;
    switchAud: (...args: any[]) => void;
    toggleFaq: (...args: any[]) => void;
    submitContact: (...args: any[]) => void;
    dsrSubmit: (...args: any[]) => void;
    snagSubmit: (...args: any[]) => void;
    __fdpWidgetsReady?: boolean;
  }
}

export {};
