/* eslint-disable */
// @ts-nocheck
/**
 * Original page behaviour, carried over unchanged from the published single-document
 * build so that this page renders and behaves exactly as it does there.
 *
 * Do not rewrite these in idiomatic React. They are here precisely because rewriting
 * them is what caused this page to drift from the published design. The only
 * modifications permitted are the submit handlers, which post to the API routes.
 */

var INS = {
  store: function(k,v){ try{ if(v===undefined) return JSON.parse(localStorage.getItem('fdp_'+k)); localStorage.setItem('fdp_'+k, JSON.stringify(v)); }catch(e){ INS._m=INS._m||{}; if(v===undefined) return INS._m[k]; INS._m[k]=v; } },
  prop: 0, ver: 0, st: 0, seen: {}, sessRef: null, sessOpen: null, logs: []
};

var VWDATA = [
 { name:'Hutu Exclusive Phase III - 500SQM Plot', loc:'Airport Road, Before Centenary City, Abuja',
   versions:[
    { v:'v2.1', date:'18 September 2026', officer:'E. Nwachukwu', status:'current',
      stations:[
       {i:'🚧',t:'Estate Gate and Access',s:'Entry point',d:'Estate access road from Airport Road. Gatehouse manned at time of attendance. Motorable in the dry season; drainage works observed in progress on the approach.',e:['PHOTO-2101','PHOTO-2102','PANORAMA-211','GPS-FIX-01']},
       {i:'📐',t:'Plot Frontage and Setback',s:'Boundary north',d:'Plot frontage measured against survey plan. Frontage consistent with plan dimensions. Setback from estate road as per approved layout.',e:['PHOTO-2103','PHOTO-2104','SURVEY-REF-500A','GPS-FIX-02']},
       {i:'🪧',t:'Beacon Verification',s:'Four corners',d:'All four corner beacons sighted and photographed. Beacon numbers legible and recorded against the survey plan schedule. No evidence of displacement.',e:['PHOTO-2105','PHOTO-2106','PHOTO-2107','PHOTO-2108','BEACON-SCH-01']},
       {i:'🏗️',t:'Site Condition',s:'Across plot',d:'Plot cleared and level. No structures, excavation or materials on site. No evidence of third-party occupation or encroachment from adjoining plots.',e:['PHOTO-2109','PHOTO-2110','PANORAMA-212']},
       {i:'⚡',t:'Infrastructure',s:'Perimeter',d:'Electricity poles present on the estate spine road approximately 40 metres from plot. Water reticulation trenching observed. Drainage channel runs along the eastern boundary.',e:['PHOTO-2111','PHOTO-2112','GPS-FIX-03']},
       {i:'🏘️',t:'Neighbouring Development',s:'Context',d:'Two completed duplexes within the adjoining block. One under construction at roof level. Estate build quality consistent with developer marketing material.',e:['PHOTO-2113','PANORAMA-213']},
       {i:'📋',t:'Officer Declaration',s:'Closing',d:'Officer attended in person. Checklist completed in full. Two items unable to be verified on the date of attendance: internal drainage invert levels, and the estate perimeter wall on the southern flank, which was under construction.',e:['DECL-0918-EN','CHECKLIST-2101']}
      ]},
    { v:'v2.0', date:'12 June 2026', officer:'E. Nwachukwu', status:'superseded',
      stations:[
       {i:'🚧',t:'Estate Gate and Access',s:'Entry point',d:'Estate access road unsealed at date of attendance. Gatehouse under construction. Access motorable with care.',e:['PHOTO-1801','PANORAMA-181','GPS-FIX-01']},
       {i:'📐',t:'Plot Frontage and Setback',s:'Boundary north',d:'Frontage measured and consistent with survey plan.',e:['PHOTO-1802','SURVEY-REF-500A']},
       {i:'🪧',t:'Beacon Verification',s:'Four corners',d:'Three of four beacons sighted. North-east beacon not located on the date of attendance; flagged for re-verification.',e:['PHOTO-1803','PHOTO-1804','EXCEPTION-181']},
       {i:'🏗️',t:'Site Condition',s:'Across plot',d:'Plot partially cleared. Vegetation on southern third.',e:['PHOTO-1805']},
       {i:'📋',t:'Officer Declaration',s:'Closing',d:'Checklist completed. One exception raised: north-east beacon not located. Re-inspection recommended.',e:['DECL-0612-EN','CHECKLIST-1801']}
      ]},
    { v:'v1.0', date:'04 March 2026', officer:'A. Bello', status:'superseded',
      stations:[
       {i:'🚧',t:'Estate Access',s:'Entry point',d:'Initial site attendance. Estate at early infrastructure stage. Access via unsealed track.',e:['PHOTO-1201','GPS-FIX-01']},
       {i:'📐',t:'Plot Identification',s:'Whole plot',d:'Plot located by coordinates against survey plan. Corner pegs present, beacons not yet installed.',e:['PHOTO-1202','SURVEY-REF-500A']},
       {i:'📋',t:'Officer Declaration',s:'Closing',d:'Preliminary inspection only. Beacons pending installation by developer. Full inspection to follow.',e:['DECL-0304-AB']}
      ]}
   ]},
 { name:'Maitama Luxury Duplex - 5 Bed', loc:'Maitama District, Abuja FCT',
   versions:[
    { v:'v1.2', date:'22 September 2026', officer:'C. Eze-Okafor', status:'current',
      stations:[
       {i:'🏛️',t:'Street Approach and Frontage',s:'Exterior',d:'Property on a tarred, lit street within the diplomatic zone. Perimeter wall intact with electric fencing. Vehicular gate operational.',e:['PHOTO-3101','PANORAMA-311','GPS-FIX-01']},
       {i:'🚪',t:'Entrance and Reception',s:'Ground floor',d:'Double-volume entrance lobby. Finishes in good order. No evidence of water ingress or structural movement at date of attendance.',e:['PHOTO-3102','PHOTO-3103','PANORAMA-312']},
       {i:'🛋️',t:'Living and Dining',s:'Ground floor',d:'Open-plan living and dining. Air conditioning units installed and in place. Flooring and ceiling finishes intact.',e:['PHOTO-3104','PHOTO-3105']},
       {i:'🛏️',t:'Bedrooms',s:'First and second floor',d:'Five bedrooms, all en-suite. Master suite with dressing area. Fittings present and in order at date of attendance.',e:['PHOTO-3106','PHOTO-3107','PHOTO-3108','PANORAMA-313']},
       {i:'🔌',t:'Services and Plant',s:'Rear',d:'Generator housing with unit in place. Borehole and overhead tank. Solar inverter installation observed in utility room.',e:['PHOTO-3109','PHOTO-3110']},
       {i:'🏊',t:'Grounds and Pool',s:'Exterior rear',d:'Swimming pool filled and in service. Landscaped grounds. Two-room boys quarters to the rear in habitable condition.',e:['PHOTO-3111','PANORAMA-314']},
       {i:'📋',t:'Officer Declaration',s:'Closing',d:'Officer attended in person. Internal checklist completed. Roof void not accessed - no safe access on the date of attendance. Recommended for the structural inspection stage.',e:['DECL-0922-CE','CHECKLIST-3101']}
      ]},
    { v:'v1.0', date:'15 April 2026', officer:'C. Eze-Okafor', status:'superseded',
      stations:[
       {i:'🏛️',t:'Street Approach and Frontage',s:'Exterior',d:'Initial attendance. Perimeter and gate in order.',e:['PHOTO-2201','GPS-FIX-01']},
       {i:'🚪',t:'Interior General',s:'All floors',d:'General walkthrough. Property vacant. Finishes in good order.',e:['PHOTO-2202','PANORAMA-221']},
       {i:'📋',t:'Officer Declaration',s:'Closing',d:'Preliminary walkthrough. Full room-by-room inspection scheduled.',e:['DECL-0415-CE']}
      ]}
   ]},
 { name:'Guzape Hill Development Land - 2,000SQM', loc:'Guzape District, Abuja FCT',
   versions:[
    { v:'v1.1', date:'08 September 2026', officer:'A. Bello', status:'current',
      stations:[
       {i:'⛰️',t:'Approach and Elevation',s:'Access road',d:'Elevated hillside plot accessed from the Guzape spine road. Gradient on approach. Motorable in a standard vehicle.',e:['PHOTO-4101','PANORAMA-411','GPS-FIX-01']},
       {i:'📐',t:'Plot Extent',s:'Full perimeter',d:'Perimeter walked in full. Dimensions measured against survey plan and found consistent. Plot area consistent with the 2,000SQM stated.',e:['PHOTO-4102','PHOTO-4103','SURVEY-REF-2000G']},
       {i:'🪧',t:'Beacon Verification',s:'Corners',d:'All corner beacons located, photographed and numbers recorded. Beacon schedule attached.',e:['PHOTO-4104','PHOTO-4105','BEACON-SCH-41']},
       {i:'🌄',t:'Topography and Outlook',s:'Across plot',d:'Significant fall across the plot from north to south. Rock outcrop on the northern section. Panoramic outlook over the FCT to the south-west. Earthworks will be required for development.',e:['PHOTO-4106','PHOTO-4107','PANORAMA-412']},
       {i:'⚡',t:'Services and Access',s:'Perimeter',d:'Electricity available at the spine road. No water reticulation observed to plot. Borehole likely required.',e:['PHOTO-4108']},
       {i:'📋',t:'Officer Declaration',s:'Closing',d:'Officer attended in person. Checklist completed. Geotechnical condition not assessed - outside inspection scope. Recommended before development commitment.',e:['DECL-0908-AB','CHECKLIST-4101']}
      ]}
   ]}
];

var PIPE = [
 {t:'Request received',        d:'Request logged and reference issued. Acknowledgement sent.'},
 {t:'Acknowledged and scoped', d:'Scope and fee confirmed in writing. Client acceptance recorded.'},
 {t:'Officer assigned',        d:'Named field officer allocated. Access arrangements confirmed.'},
 {t:'Inspection scheduled',    d:'Date and window agreed. Client notified.'},
 {t:'Officer en route',        d:'Officer dispatched. Live status enabled.'},
 {t:'On site - capture',       d:'Site attended. Checklist completed. Geotagged evidence captured.'},
 {t:'Evidence lodged',         d:'Photographs and survey coordinates lodged to the document vault (still photos only; videos not accepted).'},
 {t:'Review and sign-off',     d:'Findings reviewed. Two signatories applied.'},
 {t:'Report issued',           d:'Inspection record issued to client. Delivery Index updated.'}
];

function insTab(id, btn){
  document.querySelectorAll('.ins-tab').forEach(function(t){t.classList.remove('active')});
  document.querySelectorAll('.ins-panel').forEach(function(p){p.classList.remove('active')});
  if(btn) btn.classList.add('active');
  var el = document.getElementById('ins-'+id);
  if(el) el.classList.add('active');
}

function vwLog(msg, type){
  var now = new Date();
  var hh = String(now.getHours()).padStart(2,'0'), mm = String(now.getMinutes()).padStart(2,'0'), ss = String(now.getSeconds()).padStart(2,'0');
  INS.logs.unshift({m:msg, t:hh+':'+mm+':'+ss, k:type||'ev'});
  if(INS.logs.length > 60) INS.logs.pop();
  var feed = document.getElementById('logFeed');
  if(!feed) return;
  feed.innerHTML = INS.logs.map(function(l){
    return '<div class="log-item"><span class="log-dot '+(l.k==='sys'?'sys':l.k==='ok'?'ok':'')+'"></span><div><span>'+l.m+'</span><span class="log-time">'+l.t+'</span></div></div>';
  }).join('');
}

function vwInit(){
  var now = new Date();
  INS.sessRef = 'VW-' + now.getFullYear().toString().slice(2) + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0') + '-' + Math.random().toString(36).slice(2,7).toUpperCase();
  INS.sessOpen = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  INS.seen = {}; INS.logs = []; INS.st = 0;
  var r = document.getElementById('sessRef'), s = document.getElementById('sessStart');
  if(r) r.textContent = INS.sessRef;
  if(s) s.textContent = INS.sessOpen;
  vwRenderVers(); vwRenderStations();
  vwLog('Session opened. Reference ' + INS.sessRef, 'sys');
  vwLog('Property loaded: ' + VWDATA[INS.prop].name, 'sys');
  vwLog('Version ' + VWDATA[INS.prop].versions[INS.ver].v + ' - captured ' + VWDATA[INS.prop].versions[INS.ver].date, 'sys');
  vwShow(0, true);
}

function vwRenderVers(){
  var el = document.getElementById('verChips'); if(!el) return;
  el.innerHTML = VWDATA[INS.prop].versions.map(function(v,i){
    return '<button class="ver-chip '+(i===INS.ver?'active':'')+' '+(v.status==='superseded'?'superseded':'')+'" onclick="vwVer('+i+')">'+v.v+' · '+v.date+(v.status==='current'?'':' · superseded')+'</button>';
  }).join(' ');
}

function vwRenderStations(){
  var el = document.getElementById('stationList'); if(!el) return;
  var sts = VWDATA[INS.prop].versions[INS.ver].stations;
  var tot = document.getElementById('sessTot'); if(tot) tot.textContent = sts.length;
  el.innerHTML = sts.map(function(s,i){
    return '<div class="station '+(i===INS.st?'active':'')+' '+(INS.seen[i]?'seen':'')+'" onclick="vwShow('+i+')">'
      + '<div class="station-n">'+(INS.seen[i]?'✓':(i+1))+'</div>'
      + '<div><div class="station-t">'+s.t+'</div><div class="station-s">'+s.s+'</div></div></div>';
  }).join('');
}

function vwVer(i){
  INS.ver = i; INS.st = 0; INS.seen = {};
  var v = VWDATA[INS.prop].versions[i];
  vwLog('Version switched to ' + v.v + ' (captured ' + v.date + ', officer ' + v.officer + ')', 'sys');
  if(v.status==='superseded') vwLog('NOTE: this version is superseded. It is retained for audit and is not the current record.', 'sys');
  vwRenderVers(); vwRenderStations(); vwShow(0, true);
}

function vwSwitch(){
  INS.prop = parseInt(document.getElementById('vwProp').value);
  INS.ver = 0;
  vwInit();
}

function vwShow(i, quiet){
  var v = VWDATA[INS.prop].versions[INS.ver];
  var sts = v.stations;
  if(i < 0 || i >= sts.length) return;
  INS.st = i;
  var s = sts[i];
  var wasNew = !INS.seen[i];
  INS.seen[i] = true;

  document.getElementById('vwIcon').textContent = s.i;
  document.getElementById('vwTitle').textContent = s.t;
  document.getElementById('vwDesc').textContent = s.d;
  document.getElementById('vwEvid').innerHTML = s.e.map(function(x){return '<span class="evid">'+x+'</span>'}).join('');
  document.getElementById('vwStamp').textContent = v.v + ' · CAPTURED ' + v.date.toUpperCase() + ' · OFFICER ' + v.officer.toUpperCase() + ' · STATION ' + (i+1) + '/' + sts.length;

  var seenN = Object.keys(INS.seen).length;
  document.getElementById('sessSeen').textContent = seenN;
  document.getElementById('vwProg').style.width = Math.round(seenN/sts.length*100) + '%';
  document.getElementById('vwPrev').disabled = (i===0);
  document.getElementById('vwNext').disabled = (i===sts.length-1);

  vwRenderStations();
  if(!quiet || wasNew) vwLog('Viewed station ' + (i+1) + ' - ' + s.t + ' (' + s.e.length + ' evidence items)', wasNew?'ok':'ev');
  if(seenN === sts.length) vwLog('All stations viewed. Session eligible for certificate.', 'ok');
}

function vwStep(d){ vwShow(INS.st + d); }

function vwCert(){
  var v = VWDATA[INS.prop].versions[INS.ver];
  var sts = v.stations, seenN = Object.keys(INS.seen).length;
  var now = new Date();
  var stamp = now.toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}) + ' at ' + String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  vwLog('Session certificate issued.', 'ok');
  alert(
    'FAIR DEAL PROPERTIES LTD\n' +
    'VIRTUAL INSPECTION SESSION CERTIFICATE\n' +
    '----------------------------------------\n\n' +
    'Session reference : ' + INS.sessRef + '\n' +
    'Issued            : ' + stamp + '\n\n' +
    'Property          : ' + VWDATA[INS.prop].name + '\n' +
    'Location          : ' + VWDATA[INS.prop].loc + '\n\n' +
    'Inspection version: ' + v.v + (v.status==='superseded' ? '  (SUPERSEDED)' : '  (CURRENT)') + '\n' +
    'Evidence captured : ' + v.date + '\n' +
    'Capturing officer : ' + v.officer + '\n\n' +
    'Stations viewed   : ' + seenN + ' of ' + sts.length + '\n' +
    'Session log entries: ' + INS.logs.length + '\n\n' +
    '----------------------------------------\n' +
    'This certificate records that the named session viewed the\n' +
    'stated inspection version. It evidences a viewing session. It\n' +
    'is not a representation as to title, ownership, condition at\n' +
    'any other date, or value. A virtual walkthrough does not\n' +
    'replace a physical inspection or an assurance report.\n\n' +
    'The full session log is retained and available on request.\n\n' +
    'Fair Deal Properties Ltd\n' +
    'No. 4 Ekeh A. Yesufu Close, Utako, Abuja, FCT\n' +
    'info@fairdealng.com · 09049924198'
  );
}

function trkDemo(){ document.getElementById('trkIn').value = 'FDP-INS-DEMO01'; trkLookup(); }

function trkLookup(){
  var ref = (document.getElementById('trkIn').value || '').trim().toUpperCase();
  var err = document.getElementById('trkErr'), out = document.getElementById('trkOut');
  if(!ref){ err.style.display='block'; out.style.display='none'; return; }
  var all = INS.store('ins') || {};
  var rec = all[ref];
  if(!rec && ref === 'FDP-INS-DEMO01'){
    rec = { ref:ref, addr:'Plot 42, Hutu Exclusive Phase III, Airport Road, Abuja', loc:'Abuja FCT - within city',
            scope:'Boundary and beacon verification against survey plan', stage:6 };
  }
  if(!rec){ err.style.display='block'; out.style.display='none'; return; }
  err.style.display='none'; out.style.display='block';

  document.getElementById('trkRef').textContent = rec.ref;
  document.getElementById('trkAddr').textContent = rec.addr;
  document.getElementById('trkScope').textContent = rec.scope + '  ·  ' + rec.loc;

  var stage = rec.stage || 1;
  document.getElementById('trkStat').textContent = stage >= PIPE.length ? 'Completed' : PIPE[stage-1].t;

  var offs = [['Emeka Nwachukwu','EN','Field Verification Officer'],['Amina Bello','AB','Field Verification Officer'],['Chioma Eze-Okafor','CE','Head of Verification and Compliance']];
  var o = offs[ref.length % 3];
  document.getElementById('offInit').textContent = stage >= 3 ? o[1] : '-';
  document.getElementById('offName').textContent = stage >= 3 ? o[0] : 'Pending allocation';
  document.getElementById('offRole').textContent = stage >= 3 ? o[2] : 'Assigned at stage 3';

  var base = new Date(); base.setHours(base.getHours() - (stage * 7));
  document.getElementById('pipeSteps').innerHTML = PIPE.map(function(p,i){
    var cls = i < stage-1 ? 'done' : (i === stage-1 ? 'now' : '');
    var when = '';
    if(i <= stage-1){
      var d = new Date(base.getTime() + i*7*3600*1000);
      when = '<div class="pstamp">' + d.toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) + ' · ' + String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0') + '</div>';
    }
    return '<div class="pstep '+cls+'"><div class="pdot">'+(i<stage-1?'✓':(i===stage-1?'●':(i+1)))+'</div>'
      + '<div class="pttl">'+p.t+'</div><div class="pdesc">'+p.d+'</div>'+when+'</div>';
  }).join('');
  var pct = Math.max(0, Math.min(100, ((stage-1)/(PIPE.length-1))*100));
  setTimeout(function(){ var f=document.getElementById('pipeF'); if(f) f.style.height = pct + '%'; }, 60);

  var nfeed = document.getElementById('notifFeed');
  var icons = ['📨','📝','👤','📅','🚗','📸','🗂️','✅','📄'];
  var ns = [];
  for(var i = Math.min(stage, PIPE.length) - 1; i >= 0 && ns.length < 5; i--){
    var d = new Date(base.getTime() + i*7*3600*1000);
    ns.push('<div class="notif"><span class="notif-ico">'+icons[i]+'</span><div><div class="notif-t">'+PIPE[i].t+'</div><div class="notif-d">'+PIPE[i].d+'</div><div class="notif-time">'+d.toLocaleDateString('en-GB',{day:'2-digit',month:'short'})+' · '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+'</div></div></div>');
  }
  nfeed.innerHTML = ns.join('');
}

export function attach(): void {
  const w = window as any;
  w.insTab = insTab;
  w.vwLog = vwLog;
  w.vwInit = vwInit;
  w.vwRenderVers = vwRenderVers;
  w.vwRenderStations = vwRenderStations;
  w.vwVer = vwVer;
  w.vwSwitch = vwSwitch;
  w.vwShow = vwShow;
  w.vwStep = vwStep;
  w.vwCert = vwCert;
  w.trkDemo = trkDemo;
  w.trkLookup = trkLookup;
  w.INS = INS; w.VWDATA = VWDATA; w.PIPE = PIPE;
}
