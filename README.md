# LARGA — 52 stored route paths

Replace `index.html`, `script.js`, and `style.css` in your existing LARGA folder with this synchronized set. Keep your existing `maps-demo-key.txt` and `Assets` folder. Run the app through your existing Live Server setup and refresh the browser.

The HTML retains the supplied layout, with Live labels/controls and the Guide navigation icon updated. Existing CSS is preserved, with a few appended styles for Places suggestions and endpoint markers. The route changes are in `script.js`: the catalog now contains the 52 screenshot routes, and Guide and Live both read the same stored coordinate sequence. Google Maps continues to provide the basemap through the existing demo-key setup; Google driving directions no longer reconstruct or override jeepney paths. Old route-geometry browser caches are no longer read.

## Route references and colors

All 52 checked screenshot identities, Screenshot (12).png through Screenshot (63).png, were matched to [CommuteDavao](https://commutedavao.com/). The site's coordinate paths were retrieved from its public `main.021f6f2be17f97c4.js` asset and compared with the visible screenshot lines. The 33,457 original WGS84 coordinate pairs are embedded in `script.js`; no extra route-data file or network request is needed.

Thirty-five route entries preserve the baseline's primary and secondary colors exactly. Seventeen newly added routes use unused color combinations as requested. These new combinations are LARGA display colors, not verified official route markings. The screenshot line colors were not copied. `route-manifest.json` lists each route, screenshot, coordinate count, colors, and color provenance. Selecting a route through Live search now also brings its selected card into the carousel when it was not already displayed.

The generic baseline Ma-a entry maps to Maa - Bankerohan. Maa - Agdao is a separate entry. Existing route IDs were retained where the correspondence was clear, including Obrero, El Rio, Ecoland, Panacan-SM, Toril, and Ulas. Five baseline entries without a supplied screenshot—Acacia, Cabantian, Indangan, Tigatto, and Mandug—are outside this 52-route catalog and no longer appear in Guide or Live. Their list is recorded in the manifest.

## Validation

- All 52 routes passed browser search, selection, and deselection checks in Guide.
- All 52 routes passed browser search and selection checks in Live, with 3–5 vehicle markers per route.
- Guide multi-route selection was checked; no live vehicle markers appeared in Guide.
- All stored coordinates were checked against the retrieved source, including longitude/latitude conversion and loop endpoints.
- 1,560 sampled vehicle positions were checked to remain on their stored route segments.
- The fallback preview was checked for finite coordinates and consistent framing across all 52 routes.
- The demo-key basemap loaded successfully; no browser errors were observed during the route checks.
- JavaScript syntax passed. Existing CSS is preserved; HTML changes add the Live controls and navigation icon.

This validates agreement with your reference screenshots, not present-day franchise/service availability. Existing route descriptions and trip-planner metadata were retained where available; new entries use conservative metadata. Live positions, plates, and ETAs remain the existing simulation. Actual GPS permission, notification delivery, and real vehicle tracking were not part of this route-data validation.

## Google Maps places in Plan a Trip

FROM and TO now request live place predictions through Google's Place Autocomplete Data API. Searches accept establishments and addresses, including malls and restaurants, with a 30 km bias around Davao City and a Philippines country filter. This is a bias, not a Davao-only restriction: places outside the route area may be suggested but cannot produce a supported jeepney plan. Select a suggestion to load its name, address, place ID, and coordinates. Predictions and Google place details remain in page memory. Saved plans persist Google place IDs and refresh their names and coordinates when reopened; the route database is unchanged.

The existing maps-demo-key.txt setup is retained. The supplied key successfully returned mall and restaurant predictions and selected-place coordinates during this preview. If API access is unavailable, the same list retains LARGA's saved landmarks and displays an availability message. For deployment, ensure the key's project allows Maps JavaScript API and Places API (New), has the required billing setup, and has appropriate website/API restrictions. No Cloud account settings, APIs or billing were changed by this update. Google's setup reference: https://developers.google.com/maps/documentation/places/web-service/get-api-key

Typing is debounced by 300 ms; one autocomplete session token is reused during a field's search and discarded after selection. Details request only id, displayName, formattedAddress, and location. The Google results are separated from saved landmarks and attributed to Google Maps. Arrow keys move through suggestions, Enter selects a focused suggestion, and Escape closes them. Editing an endpoint invalidates its old selection and clears an old displayed plan. Stale network responses cannot overwrite newer results.

Google-selected places and GPS origins are matched by minimum straight-line distance to the segments of the 52 stored route paths, within 500 m. Direct choices and the existing landmark-based transfer planner use those matches. The trip map marks the selected endpoints at their actual coordinates. The route paths and colors are unchanged. Coordinate-selected endpoints are not drawn on the schematic fallback map.

This first integration suggests nearby route corridors. It does not compute walking directions, verify safe pedestrian access or legal boarding stops, or validate direction-specific ride segments. Transfers still use the existing saved landmark metadata. Cards say Board near / Get off near for coordinate-based endpoints. A place existing on Google Maps does not guarantee a supported jeepney connection.

Validation for this integration: real Google mall and restaurant suggestions; selected-place detail loading; a Gaisano Mall of Davao to SM Lanang Premier plan with endpoint markers; JavaScript syntax; unchanged 52 route geometries/colors; 1,560 simulation samples; coordinate matching at segment midpoints and the 500 m boundary; same-place/outside-coverage rejection; GPS matching in an isolated test; session tokens, stale-response rejection, API/detail failure recovery, no-results handling, and safe text rendering in isolated API tests. Actual device GPS permission was not exercised. Validation evidence is recorded in validation.json.

Before public deployment, provide your own publicly accessible Terms of Use and Privacy Policy addressing the app and Google's services. See Google's Places policies: https://developers.google.com/maps/documentation/places/web-service/policies

## Live interface revisions

Live route cards include route name, summary, active count, and Learn More. Learn More uses the existing Guide expanding/closing animation and details panel. The carousel supports touch, mouse dragging, and keyboard arrows when focused; visible scrollbars, arrows, and swipe instructions are omitted. The Live header is tighter and the requested demo/simulation labels have been removed from the user interface. The underlying vehicle engine is unchanged.

Map marker selection opens a stationary, closable panel inside the map, with plate, route, ETA, and notification controls. The panel stays within map bounds and can scroll on constrained heights. Selecting a vehicle in the map or Other jeepneys list promotes it to Your selected ride, keeping that vehicle selected while arrival estimates update. With no selected vehicle, the shortest ETA becomes Your next ride. Route changes clear selection and alert state. The top card has larger route/plate text and a subtle orange glow. The Guide navigation icon is now an SVG matching the other icons in size.

Notify Me switches to Cancel notification for an armed ride. Cancellation clears the alert subscription and invalidates pending permission work. Threshold changes apply to the subscribed vehicle. Browser notification delivery and real GPS permissions were not exercised: selection and cancellation were validated with a test-only GPS/notification fixture, which is excluded from the replacement files and ZIP.

Checks: Live card scrolling; Learn More expansion and restoration; map marker selection; full map-panel bounds with no inner overflow at the tested size; selecting another jeepney and preserving its plate at the top; arming/cancelling notifications; route-change reset; no browser errors. Existing 52 route coordinates/colors, route movement math, and Places integration tests also pass.

## Live layout follow-up

Learn More is centered at the bottom of Live cards, with inherited button offsets reset only for collapsed Live cards. The expanding/closing route details remain intact. Header padding and gaps are reduced. A mouse drag was verified to scroll the carousel without selecting the dragged card; touch swiping remains native.

While a map jeepney is selected, the other vehicle markers and list icons are gray. Closing the detail panel or clearing selection restores their original colors. The ride card plate is now a rounded, bordered plate-style badge at the top right of its title row.

Browser checks: Learn More center offset 0 px and bottom gap 13 px; drag scroll 163 px; carousel scrollbar hidden; three unselected markers gray and selected marker colored; all four markers restored on exit; plate aligned at top/right and inside the title row; Learn More open/close; no browser errors. A test-only location fixture was used and is excluded from the ZIP.


## Trips and Discover

Trips now holds saved routes and suggested plans. Save Route in Guide Learn More and Save Trip beneath Plan My Trip open a label dialog, with School, Work, Gym, Home, or a custom label. Saved cards support reopening, tracking the first route in Live, editing the label, and deleting. Plan a new trip clears the previous endpoints and result. Storage is local to the same browser and website origin; it is not linked to a cloud account. Clearing website data removes saved trips. If browser storage is unavailable, changes last for the current session.

For Google endpoints, only place IDs persist, along with the saved route IDs and the user label. Google endpoint names and coordinates are refreshed with Place.fetchFields on reopening. Opening these plans requires Google Places access and a connection; errors leave the saved plan intact. Local landmarks and an explicitly saved GPS starting point are retained locally. Google Place details reference: https://developers.google.com/maps/documentation/javascript/place-details

Discover replaces Saved in the navigation, using a magnifying glass. Guide uses an arrow. Discover reuses the existing Google Places integration, with Malls, Food, Parks, and Schools shortcuts. Choosing a result fills Plan a Trip's destination. Guide Learn More Start Trip opens Live with that route selected and its card revealed. The Live carousel now also accepts the mouse wheel, preserving Ctrl-wheel zoom and releasing page scrolling at the carousel ends.

This update was checked in the browser: saving a route with a preset label, editing the label, saving a real Google place-to-place plan, reopening it after reload with fresh place names, deleting both records and verifying deletion after reload, Discover search and destination handoff, Start Trip selecting Route 4 with matching map markers and visible active card, and mouse-wheel carousel movement. Isolated checks confirm only Google place IDs persist and wheel edge behavior. JavaScript syntax, all 52 route paths/colors, planner, autocomplete, and Live checks pass. No new real GPS or notification delivery tests were performed.
