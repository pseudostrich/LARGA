# LARGA — 52 stored route paths

Replace `index.html`, `script.js`, and `style.css` in your existing LARGA folder with this synchronized set. Keep your existing `maps-demo-key.txt` and `Assets` folder. Run the app through your existing Live Server setup and refresh the browser.

The HTML and CSS match the supplied baseline exactly. The changes are in `script.js`: the catalog now contains the 52 screenshot routes, and Guide and Live both read the same stored coordinate sequence. Google Maps continues to provide the basemap through the existing demo-key setup; Google driving directions no longer reconstruct or override jeepney paths. Old route-geometry browser caches are no longer read.

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
- JavaScript syntax passed. HTML and CSS are unchanged from the baseline.

This validates agreement with your reference screenshots, not present-day franchise/service availability. Existing route descriptions and trip-planner metadata were retained where available; new entries use conservative metadata. Live positions, plates, and ETAs remain the existing simulation. Actual GPS permission, notification delivery, and real vehicle tracking were not part of this route-data validation.
