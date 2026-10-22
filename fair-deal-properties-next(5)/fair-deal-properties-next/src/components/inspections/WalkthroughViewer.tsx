'use client';

import { useState, useMemo } from 'react';
import { walkthroughs } from '@/data/walkthroughs';

/**
 * Dated, versioned virtual walkthrough.
 *
 * The version selector is the point of the component. A walkthrough that can be
 * silently replaced is marketing; one where the superseded version remains visible,
 * labelled, and attributed to the officer who captured it is evidence. Superseded
 * versions are therefore shown rather than hidden.
 */
export default function WalkthroughViewer() {
  const [propertyIndex, setPropertyIndex] = useState(0);
  const [versionIndex, setVersionIndex] = useState(0);
  const [stationIndex, setStationIndex] = useState(0);
  const [log, setLog] = useState<{ text: string; kind: 'sys' | 'nav' }[]>([
    { text: 'Session opened. Select a station to begin.', kind: 'sys' },
  ]);

  const property = walkthroughs[propertyIndex]!;
  const version = property.versions[versionIndex]!;
  const station = version.stations[stationIndex]!;

  const sessionRef = useMemo(
    () => `FDP-VW-${new Date().getFullYear().toString().slice(2)}${propertyIndex}${versionIndex}`,
    [propertyIndex, versionIndex],
  );

  function append(text: string, kind: 'sys' | 'nav' = 'nav') {
    setLog((l) => [...l.slice(-18), { text, kind }]);
  }

  function selectProperty(i: number) {
    setPropertyIndex(i);
    setVersionIndex(0);
    setStationIndex(0);
    append(`Property changed to ${walkthroughs[i]!.name}.`, 'sys');
  }

  function selectVersion(i: number) {
    setVersionIndex(i);
    setStationIndex(0);
    const v = property.versions[i]!;
    append(`Version switched to ${v.v} (captured ${v.date}, officer ${v.officer}).`, 'sys');
    if (v.status === 'superseded') {
      append('NOTE: this version is superseded. It is retained for audit and is not the current record.', 'sys');
    }
  }

  function selectStation(i: number) {
    setStationIndex(i);
    append(`Station ${i + 1}: ${version.stations[i]!.t}`);
  }

  return (
    <div className="fdpvw-shell">
      <div className="fdpvw-bar">
        <div className="fdpvw-bar-l">
          <label htmlFor="vwProp" className="fdpvw-label">Property</label>
          <select
            id="vwProp"
            value={propertyIndex}
            onChange={(e) => selectProperty(Number(e.target.value))}
            className="fdpvw-select"
          >
            {walkthroughs.map((p, i) => (
              <option key={p.name} value={i}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="fdpvw-bar-r">
          <span className="fdpvw-ref">Session {sessionRef}</span>
        </div>
      </div>

      <div className="fdpvw-loc">{property.loc}</div>

      {/* version selector */}
      <div className="fdpvw-vers" role="tablist" aria-label="Walkthrough version">
        {property.versions.map((v, i) => (
          <button
            key={v.v}
            role="tab"
            aria-selected={i === versionIndex}
            className={
              i === versionIndex
                ? 'fdpvw-ver active'
                : v.status === 'superseded' ? 'fdpvw-ver superseded' : 'fdpvw-ver'
            }
            onClick={() => selectVersion(i)}
            type="button"
          >
            <strong>{v.v}</strong>
            <span>{v.date}</span>
            <span>{v.officer}</span>
            {v.status === 'superseded' && <span className="fdpvw-sup">Superseded</span>}
          </button>
        ))}
      </div>

      {version.status === 'superseded' && (
        <p className="fdpvw-warn" role="note">
          You are viewing a superseded version. It is retained for audit and is not the current
          record. Select the version marked current for the present position.
        </p>
      )}

      <div className="fdpvw-main">
        {/* stations */}
        <nav className="fdpvw-stations" aria-label="Inspection stations">
          {version.stations.map((s, i) => (
            <button
              key={s.t + i}
              className={i === stationIndex ? 'fdpvw-station active' : 'fdpvw-station'}
              onClick={() => selectStation(i)}
              type="button"
            >
              <span className="fdpvw-station-i" aria-hidden="true">{s.i}</span>
              <span className="fdpvw-station-t">{s.t}</span>
              <span className="fdpvw-station-s">{s.s}</span>
            </button>
          ))}
        </nav>

        {/* current station */}
        <div className="fdpvw-panel">
          <div className="fdpvw-panel-head">
            <span className="fdpvw-panel-i" aria-hidden="true">{station.i}</span>
            <div>
              <h4>{station.t}</h4>
              <div className="fdpvw-panel-s">{station.s}</div>
            </div>
          </div>

          <p className="fdpvw-panel-d">{station.d}</p>

          <div className="fdpvw-evidence">
            <div className="fdpvw-evidence-t">Evidence referenced at this station</div>
            <div className="fdpvw-evidence-list">
              {station.e.map((ref) => (
                <code key={ref} className="fdpvw-ev">{ref}</code>
              ))}
            </div>
            <p className="fdpvw-evidence-n">
              Evidence items are held in the document vault and released to clients on engagement,
              together with the inspection record. References are shown here so the record can be
              checked against what was captured.
            </p>
          </div>

          <div className="fdpvw-nav">
            <button
              className="btn btn-outline"
              onClick={() => selectStation(Math.max(0, stationIndex - 1))}
              disabled={stationIndex === 0}
              type="button"
            >
              ← Previous
            </button>
            <span className="fdpvw-progress">
              Station {stationIndex + 1} of {version.stations.length}
            </span>
            <button
              className="btn btn-primary"
              onClick={() => selectStation(Math.min(version.stations.length - 1, stationIndex + 1))}
              disabled={stationIndex === version.stations.length - 1}
              type="button"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* session log */}
      <div className="fdpvw-log" aria-live="polite">
        <div className="fdpvw-log-t">Session log</div>
        {log.map((l, i) => (
          <div key={i} className={l.kind === 'sys' ? 'fdpvw-log-line sys' : 'fdpvw-log-line'}>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}
