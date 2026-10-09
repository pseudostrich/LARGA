# Vehicle-feed connection guide

The current app uses generated positions on the stored route paths until a feed supplies valid records. No simulation labels are shown in the app. This adapter prepares integration; no real tracking service is deployed or connected.

After app initialization, window.largaVehicleFeed supports:

- ingest(records): accept an array of vehicle records; returns the number accepted.
- connect(webSocketUrl): listen for JSON arrays or an object with a vehicles array. Use wss:// on an HTTPS deployment.
- disconnect(): close the socket and return to the built-in position driver.
- status(): report connection state and last receipt time.

Each record contains id (string), routeId (a route-manifest ID), lat, lng, timestamp (epoch milliseconds or ISO date string), and optional plate and speedKph. Example shape:

    {id: 'vehicle-01', routeId: 'route-1', lat: 7.07, lng: 125.61,
     timestamp: Date.now(), plate: 'ABC 1234', speedKph: 20}

Use your actual manifest route ID and valid route-area position. The example is a schema illustration, not an observed vehicle location. A route can receive multiple vehicles. The adapter ignores unknown routes, malformed or far-outside-route positions, future timestamps beyond a ten-second allowance, and updates older than the same vehicle's accepted record. Records more than 500 m from their stored path are rejected.

Freshness expires after 45 seconds. Stale markers fade; stale vehicles do not produce arrival estimates or new alerts. Position records expire after five minutes. A stopped vehicle has no moving-arrival estimate. Route counts follow fresh feed records. No network connection is started automatically.

Production work still requires a server/feed, its authentication and reconnect policy, real GPS devices, verified route direction/boarding stops, and end-to-end field validation. Browser code must not contain secret backend credentials. Ingest local transport data through an appropriate server if direct public WebSocket access is unsuitable. The existing Google Maps key setup is unchanged.
