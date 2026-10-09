# LARGA — coordinated UI and journey update

Replace index.html, script.js, and style.css in your existing LARGA folder, and add sw.js beside them. Keep your existing Assets folder and maps-demo-key.txt. Serve the folder with Live Server or HTTPS; refresh the browser. The offline reference needs one successful online visit and a completed service-worker installation. Opening the HTML directly as a file does not enable offline caching.

## Included changes

- Compact Discover page with a horizontally scrollable category row, consistent images, separated ratings/categories, Plan trip and Add stop actions, rating filters, and Google's open-now search filter.
- Shared text sizes, button heights, route-card positions, selected/favorite emphasis, and trash icons with accessible action labels.
- Liquid-glass-inspired translucent surfaces with blur, highlights, borders, and opaque browser fallbacks: profile dropdown, Learn More, search fields, Your next ride, and saved trips. Reduced-motion and larger-text preferences remain available.
- Collapsible ride timeline directly below the map. Walk, board, get off, transfer, visit, and arrive steps use each route's existing color pair. Suggested boarding pins and links to walking directions are included when endpoint coordinates are available.
- Editable trip starting points/destinations, stop replacement, reordering, and removal. Update trip recalculates the working plan; Save Trip keeps the updated version.
- Comparison of supported route candidates by fewer transfers or less estimated walking. Multi-stop comparisons preserve the chosen stop order. This is a bounded comparison of stored corridors, not an exhaustive fastest-trip or traffic calculation.
- Saved/recent trip search, label filtering, and sorting by recently saved, recently used, or name.
- Share links containing place IDs, local landmark references, route IDs, and trip steps. Device GPS starting coordinates are excluded: recipients choose a starting point. Share from the hosted LARGA address; localhost links are only useful on that computer.
- Loading placeholders, no-match messages, retry controls, and an offline status message.
- Offline app shell, route paths, local assets, saved route references, and local trip records. Google responses and the key file are excluded from the service-worker cache. Google place names/details, online maps, and new Places searches still need a connection. Offline Google-based plans show stored route references with unavailable stop-name labels; editing/sharing/saving those incomplete references is disabled.
- Vehicle-feed adapter, last-position update times, validation of incoming records, stale-marker treatment, and suppression of stale arrival estimates/alerts. See LIVE-FEED.md.

## Route and data boundaries

Guide and Live still use the same 52 stored CommuteDavao screenshot route paths: 33,457 coordinate pairs. Thirty-five existing route color pairs are preserved; seventeen additions use unused LARGA display combinations previously authorized by the user. Those additions are not verified official markings. See route-manifest.json.

Walking distances measure straight-line distance to stored route segments, not actual pedestrian paths. Suggested transfer/boarding points are not verified legal stops. Confirm direction, access, and the boarding side. Local landmark endpoints without coordinates do not receive invented walking distances. Place IDs persist; Google names, photos, reviews, and coordinates remain in page memory and are refreshed online. A deliberately saved GPS origin remains local, and is omitted from shared links.

Google photo requests remain enabled. With the current key, tested Places results supplied ratings but no photos or written reviews. Matching SM Lanang, Abreeza, and People's Park cards use credited Wikimedia Commons archive photographs; other cards use clearly labeled category illustrations. No fabricated reviews or current-photo claims are included. Credits and license links appear on the cards.

## Validation

Syntax, all 52 geometries/colors, planner, autocomplete, saved-ID storage, Live controls, photo/review rendering, segment projections, shared-link validation, incoming-feed validation, comparison ordering, and offline cache fallback tests pass. Browser checks covered rating/open-now results, trip-library filters, replacing an origin, reordering stops, recalculation, shared-trip reconstruction after reload, the map/timeline panel, glass controls, early Learn More closing, and incoming/fresh/stale vehicle states. Browser errors were absent in the final preview.

Location and incoming-feed checks used isolated test fixtures; actual GPS permission, production vehicle feeds, WebSocket service deployment, and notification delivery were not exercised. Offline UI was checked with a fixture; network-failure cache behavior was verified in isolated service-worker tests. Fixtures and the key are excluded from the ZIP.

## Dark mode, nearby ads, and compact Trips

Profile > Settings includes a persistent Dark mode toggle. It changes app surfaces, forms, menus, navigation, trip cards, and dialogs while preserving route colors and the existing Google basemap. The search bar now has one border/shadow surface. Saved-trip Live, Edit label, Share, and Delete actions use accessible icons in one compact row. Discover categories support mouse dragging, touch swiping, mouse-wheel scrolling, and keyboard arrows when the strip is focused.

Ad placements are labeled Sponsored ads in the app. This remains a prototype; no brand has a paid partnership, verified offer, or verified enrollment availability through LARGA. Banner copy uses custom generic calls to action rather than claiming official taglines. Sixteen catalog entries include Mang Inasal, SM Lanang, SM City Davao, Abreeza, Ateneo de Davao, Gaisano Mall, NCCC, McDonald's, Jollibee, KFC, Chowking, Burger King, Greenwich, Starbucks, Jack's Ridge, and Lachi's.

Google Places resolves up to three branches per brand. Returned names must match the brand and be within Davao coverage. Branch details remain in memory. Live recommendations use the selected jeepney's current position, or the nearest ride/first available vehicle, then existing user location as a fallback. The closest resolved eligible branch ranks first. The banner rotates among up to four eligible businesses within two kilometers; a five-second refresh reacts to vehicle movement. Manual browsing has a short grace period. This is proximity among the resolved catalog, not a claim to identify every business in Google Maps or walking accessibility. Moving-position checks used isolated test vehicle records.

One banner per map, at most one jeepney ad badge, and one eligible Guide establishment marker remain the limits. Plan trip and Add stop use the actual selected Google branch. Place-lookup failures use an exact matching saved route landmark when available; otherwise the preview offers a Google Maps search link and Retry. No unverified coordinates, place IDs, ratings, or opening hours are created. No external advertising network or persistent location/behavior history is added.

Discover supports galleries of up to five Google place photos with changing author credits. Ten credited archive-photo matches provide additional coverage for SM Lanang, Abreeza, People's Park, GMall of Davao, SM City Davao, Starbucks Abreeza, San Pedro Cathedral, Jollibee Agdao, Kuya Ed, and Sbarro SM Davao. Branch-specific matches use location checks; other branches do not inherit those photos. Images load online and fall back to an illustration if unavailable. Source, author, license, and crop notices appear in the cards.

Browser validation covered persistent dark mode, compact action rows, category mouse-wheel scrolling, resolved business previews, downtown-to-north movement changing recommendations, and rendered archive photos. Isolated checks covered moving-coordinate branch ranking, selected-vehicle anchors, multi-photo gallery/credit changes, and the existing route/planner/storage/feed/offline regressions. The Google demo key reached its daily Maps JavaScript 2D limit late in validation, preventing fresh Maps/Places results on later reloads. The existing key setup is unchanged. Google-backed features require the quota to reset or an appropriately enabled replacement key; no cloud account or billing changes were made. Archive-image rendering was subsequently checked in an isolated fixture without Google requests.

Additional archive sources:
- [GMall of Davao — Teemu Väisänen, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Davao_GMall_02.jpg)
- [SM City Davao — Kenneth Rangas, CC BY 3.0](https://commons.wikimedia.org/wiki/File:SM_City_Davao_Annex_Event_Centre_-_panoramio.jpg)
- [Starbucks Abreeza — Kenneth Rangas, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Starbucks_Coffee_Abreeza_Mall_-_panoramio.jpg)
- [San Pedro Cathedral — Herbert Kikoy, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:San_Pedro_Metropolitan_Cathedral_-_Davao_City_01.jpg)
- [Jollibee Agdao — JuneAugust, CC BY 4.0](https://commons.wikimedia.org/wiki/File:Jollibee_Agdao_Davao_photographed_opposite_the_entrance_of_Jollibee_Agdao_Davao_on_April_29,_2024.jpg)
- [Kuya Ed — Kenneth Rangas, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Kuya_Ed_Restaurant_-_panoramio.jpg)
- [Sbarro SM Davao — Kenneth Rangas, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Sbarro_SM_Davao_-_panoramio.jpg)

Google photo reference: https://developers.google.com/maps/documentation/javascript/place-photos

## Places recovery and planned Live routes

The latest browser session confirmed a Google Places SearchTextRequest daily-quota failure on the demo project. Maps rendering was available, but full business search was still blocked. Source changes cannot raise that external quota. An enabled working Places key or a daily reset is required for unrestricted Google results. Failed requests now use saved route landmark search, expose retry, and avoid repeating exhausted searches for five minutes. Rating/Open now filters never treat unknown local values as verified. Saved landmark plans can be created, saved, shared, and added to multi-stop journeys without inventing coordinates or Google IDs. Ad previews use an exact brand landmark match when possible (Ateneo, SM, Abreeza and other supported landmarks); unsupported branches retain a direct Google Maps search and retry.

Guide trip cards independently toggle route paths. Multiple selections appear together; deselecting all clears the map. View in Live carries all suggested route cards to a focused Live carousel, keeps the selected paths on the map alongside the tracked route, and provides Exit plan to restore the normal carousel. Route paths remain unchanged. Share has compact spacing, short privacy text, and an ellipsized link. Search icons and clear controls stay inside their inputs. Dark Guide panels, fields, actions, expanded tools, and unselected cards have corrected contrast. The offline shell version is updated.

Browser checks verified: saved-landmark search to an Abreeza plan; Ateneo sponsored preview to Route 3; two simultaneous Guide selections and subsequent deselection; planned Live carousel with five suggested routes and restoration to eight default cards; search-icon containment; dark Guide surfaces and share-dialog spacing. Automated checks cover independent deselection, no invented fallback metadata, quota cooldown/retry, planner geometry, photos/credits, saving/sharing, autocomplete, vehicle feed and offline boundaries. No billing or cloud settings were changed.

## References

Google Place search/filter reference: https://developers.google.com/maps/documentation/javascript/reference/place
Route reference: https://commutedavao.com/
Archive photos: Moody Fotografi (SM Lanang, CC BY 2.0), UrbanGeek2011 (Abreeza Concourse, CC BY-SA 4.0), Bjeweld (People's Park, CC BY-SA 4.0). The full source and license links remain in each place card.
