/** Dated, versioned virtual walkthrough records.
 *
 * A walkthrough is an evidence record, not a marketing video. Each version is dated,
 * attributed to the attending officer, and superseded versions are retained rather
 * than overwritten - a record that can be silently replaced is not evidence.
 */

export interface WalkthroughStation {
  i: string;
  t: string;
  s: string;
  d: string;
  e: string[];
}

export interface WalkthroughVersion {
  v: string;
  date: string;
  officer: string;
  status: 'current' | 'superseded';
  stations: WalkthroughStation[];
}

export interface WalkthroughProperty {
  name: string;
  loc: string;
  versions: WalkthroughVersion[];
}

export const walkthroughs: WalkthroughProperty[] = [
 { name:'Hutu Exclusive Phase III - 500SQM Plot', loc:'Airport Road, Before Centenary City, Abuja',
   versions:[
    { v:'v2.1', date:'18 September 2026', officer:'E. Nwachukwu', status:'current',
      stations:[
       {i:'🚧',t:'Estate Gate and Access',s:'Entry point',d:'Estate access road from Airport Road. Gatehouse manned at time of attendance. Motorable in the dry season; drainage works observed in progress on the approach.',e:['PHOTO-2101','PHOTO-2102','VIDEO-211','GPS-FIX-01']},
       {i:'📐',t:'Plot Frontage and Setback',s:'Boundary north',d:'Plot frontage measured against survey plan. Frontage consistent with plan dimensions. Setback from estate road as per approved layout.',e:['PHOTO-2103','PHOTO-2104','SURVEY-REF-500A','GPS-FIX-02']},
       {i:'🪧',t:'Beacon Verification',s:'Four corners',d:'All four corner beacons sighted and photographed. Beacon numbers legible and recorded against the survey plan schedule. No evidence of displacement.',e:['PHOTO-2105','PHOTO-2106','PHOTO-2107','PHOTO-2108','BEACON-SCH-01']},
       {i:'🏗️',t:'Site Condition',s:'Across plot',d:'Plot cleared and level. No structures, excavation or materials on site. No evidence of third-party occupation or encroachment from adjoining plots.',e:['PHOTO-2109','PHOTO-2110','VIDEO-212']},
       {i:'⚡',t:'Infrastructure',s:'Perimeter',d:'Electricity poles present on the estate spine road approximately 40 metres from plot. Water reticulation trenching observed. Drainage channel runs along the eastern boundary.',e:['PHOTO-2111','PHOTO-2112','GPS-FIX-03']},
       {i:'🏘️',t:'Neighbouring Development',s:'Context',d:'Two completed duplexes within the adjoining block. One under construction at roof level. Estate build quality consistent with developer marketing material.',e:['PHOTO-2113','VIDEO-213']},
       {i:'📋',t:'Officer Declaration',s:'Closing',d:'Officer attended in person. Checklist completed in full. Two items unable to be verified on the date of attendance: internal drainage invert levels, and the estate perimeter wall on the southern flank, which was under construction.',e:['DECL-0918-EN','CHECKLIST-2101']}
      ]},
    { v:'v2.0', date:'12 June 2026', officer:'E. Nwachukwu', status:'superseded',
      stations:[
       {i:'🚧',t:'Estate Gate and Access',s:'Entry point',d:'Estate access road unsealed at date of attendance. Gatehouse under construction. Access motorable with care.',e:['PHOTO-1801','VIDEO-181','GPS-FIX-01']},
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
       {i:'🏛️',t:'Street Approach and Frontage',s:'Exterior',d:'Property on a tarred, lit street within the diplomatic zone. Perimeter wall intact with electric fencing. Vehicular gate operational.',e:['PHOTO-3101','VIDEO-311','GPS-FIX-01']},
       {i:'🚪',t:'Entrance and Reception',s:'Ground floor',d:'Double-volume entrance lobby. Finishes in good order. No evidence of water ingress or structural movement at date of attendance.',e:['PHOTO-3102','PHOTO-3103','VIDEO-312']},
       {i:'🛋️',t:'Living and Dining',s:'Ground floor',d:'Open-plan living and dining. Air conditioning units installed and in place. Flooring and ceiling finishes intact.',e:['PHOTO-3104','PHOTO-3105']},
       {i:'🛏️',t:'Bedrooms',s:'First and second floor',d:'Five bedrooms, all en-suite. Master suite with dressing area. Fittings present and in order at date of attendance.',e:['PHOTO-3106','PHOTO-3107','PHOTO-3108','VIDEO-313']},
       {i:'🔌',t:'Services and Plant',s:'Rear',d:'Generator housing with unit in place. Borehole and overhead tank. Solar inverter installation observed in utility room.',e:['PHOTO-3109','PHOTO-3110']},
       {i:'🏊',t:'Grounds and Pool',s:'Exterior rear',d:'Swimming pool filled and in service. Landscaped grounds. Two-room boys quarters to the rear in habitable condition.',e:['PHOTO-3111','VIDEO-314']},
       {i:'📋',t:'Officer Declaration',s:'Closing',d:'Officer attended in person. Internal checklist completed. Roof void not accessed - no safe access on the date of attendance. Recommended for the structural inspection stage.',e:['DECL-0922-CE','CHECKLIST-3101']}
      ]},
    { v:'v1.0', date:'15 April 2026', officer:'C. Eze-Okafor', status:'superseded',
      stations:[
       {i:'🏛️',t:'Street Approach and Frontage',s:'Exterior',d:'Initial attendance. Perimeter and gate in order.',e:['PHOTO-2201','GPS-FIX-01']},
       {i:'🚪',t:'Interior General',s:'All floors',d:'General walkthrough. Property vacant. Finishes in good order.',e:['PHOTO-2202','VIDEO-221']},
       {i:'📋',t:'Officer Declaration',s:'Closing',d:'Preliminary walkthrough. Full room-by-room inspection scheduled.',e:['DECL-0415-CE']}
      ]}
   ]},
 { name:'Guzape Hill Development Land - 2,000SQM', loc:'Guzape District, Abuja FCT',
   versions:[
    { v:'v1.1', date:'08 September 2026', officer:'A. Bello', status:'current',
      stations:[
       {i:'⛰️',t:'Approach and Elevation',s:'Access road',d:'Elevated hillside plot accessed from the Guzape spine road. Gradient on approach. Motorable in a standard vehicle.',e:['PHOTO-4101','VIDEO-411','GPS-FIX-01']},
       {i:'📐',t:'Plot Extent',s:'Full perimeter',d:'Perimeter walked in full. Dimensions measured against survey plan and found consistent. Plot area consistent with the 2,000SQM stated.',e:['PHOTO-4102','PHOTO-4103','SURVEY-REF-2000G']},
       {i:'🪧',t:'Beacon Verification',s:'Corners',d:'All corner beacons located, photographed and numbers recorded. Beacon schedule attached.',e:['PHOTO-4104','PHOTO-4105','BEACON-SCH-41']},
       {i:'🌄',t:'Topography and Outlook',s:'Across plot',d:'Significant fall across the plot from north to south. Rock outcrop on the northern section. Panoramic outlook over the FCT to the south-west. Earthworks will be required for development.',e:['PHOTO-4106','PHOTO-4107','VIDEO-412']},
       {i:'⚡',t:'Services and Access',s:'Perimeter',d:'Electricity available at the spine road. No water reticulation observed to plot. Borehole likely required.',e:['PHOTO-4108']},
       {i:'📋',t:'Officer Declaration',s:'Closing',d:'Officer attended in person. Checklist completed. Geotechnical condition not assessed - outside inspection scope. Recommended before development commitment.',e:['DECL-0908-AB','CHECKLIST-4101']}
      ]}
   ]}
];
