/* Open map and place services for the isolated LARGA prototype. */
(() => {
    let layerId = 0;
    function routeDirectionIcon(map, routeColor) {
        const id = 'larga-route-direction-' + routeColor;
        if (map.hasImage(id)) return id;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 28;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(10, 7);
        ctx.lineTo(17, 14);
        ctx.lineTo(10, 21);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#fff';
        ctx.strokeStyle = 'color-mix(in srgb, ' + routeColor + ' 24%, white)';
        ctx.shadowColor = 'rgba(24, 31, 40, 0.55)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 1;
        ctx.lineWidth = 4;
        ctx.stroke();
        map.addImage(id, ctx.getImageData(0, 0, 28, 28), {pixelRatio: 2});
        return id;
    }

    class OpenMap extends maplibregl.Map {
        constructor(container, {center, zoom, zoomControl}) {
            super({
                container, center, zoom, minZoom: 3, maxZoom: 19,
                style: 'https://tiles.openfreemap.org/styles/liberty',
                attributionControl: {compact: true}
            });
            if (zoomControl) this.addControl(new maplibregl.NavigationControl({showCompass: false}), 'bottom-right');
            this.ready = new Promise((resolve, reject) => {
                const timer = setTimeout(() => reject(new Error('OpenFreeMap style timed out')), 15000);
                this.once('style.load', () => { clearTimeout(timer); resolve(); });
            });
        }

        addListener(type, callback) {
            return this.on(type, callback);
        }

        fitBounds(bounds, options) {
            return super.fitBounds(bounds, typeof options === 'number'
                ? {padding: options, maxZoom: 16, duration: 0}
                : options);
        }
    }

    class RouteLine {
        constructor(options) {
            this.id = 'larga-route-' + ++layerId;
            this.directionLayer = this.id + '-direction';
            this.options = {...options};
            this.setMap(options.map);
        }

        setMap(map) {
            if (this.map) {
                if (this.map.getLayer(this.directionLayer)) this.map.removeLayer(this.directionLayer);
                if (this.map.getLayer(this.id)) this.map.removeLayer(this.id);
                if (this.map.getSource(this.id)) this.map.removeSource(this.id);
            }
            this.map = map;
            if (!map) return;
            const {path} = this.options;
            map.addSource(this.id, {type: 'geojson', data: {
                type: 'LineString', coordinates: path.map(({lat, lng}) => [lng, lat])
            }});
            map.addLayer({
                id: this.id, type: 'line', source: this.id,
                layout: {'line-cap': 'round', 'line-join': 'round'},
                paint: {
                    'line-color': this.options.strokeColor,
                    'line-opacity': this.options.strokeOpacity ?? 1,
                    'line-width': this.options.strokeWeight ?? 5
                }
            });
            if (this.options.directional) {
                const directionIcon = routeDirectionIcon(map, this.options.strokeColor);
                map.addLayer({
                    id: this.directionLayer, type: 'symbol', source: this.id,
                    layout: {
                        'symbol-placement': 'line',
                        'symbol-spacing': 70,
                        'icon-image': directionIcon,
                        'icon-rotation-alignment': 'map',
                        'icon-keep-upright': false,
                        'icon-ignore-placement': true,
                        'icon-allow-overlap': true
                    }
                });
            }
        }

        setOptions(options) {
            Object.assign(this.options, options);
            if (options.strokeWeight != null) {
                this.map?.setPaintProperty(this.id, 'line-width', options.strokeWeight);
            }
            if (options.zIndex != null && this.map) {
                this.map.moveLayer(this.id);
                if (this.options.directional) this.map.moveLayer(this.directionLayer);
            }
        }
    }

    class OpenMarker {
        constructor({map, position, title, zIndex, anchor = 'center'}) {
            this.element = document.createElement('div');
            this.element.className = 'larga-open-marker';
            this.element.title = title || '';
            this.marker = new maplibregl.Marker({element: this.element, anchor});
            this.element.addEventListener('click', event => event.stopPropagation());
            this.position = position;
            this.zIndex = zIndex;
            this.map = map;
        }

        append(child) {
            this.element.append(child);
            if (child.querySelector('.planner-pin')) this.marker.setOffset([0, -13]);
        }

        set position(value) {
            this.coordinates = value;
            this.marker.setLngLat(value);
        }

        get position() {
            return this.coordinates;
        }

        set map(map) {
            this.marker.remove();
            if (map) this.marker.addTo(map);
        }

        set zIndex(value) {
            this.element.style.zIndex = String(value ?? 1);
        }
    }

    async function request(path, params) {
        const url = new URL(path, location.href);
        url.search = new URLSearchParams(params);
        const response = await fetch(url, {signal: AbortSignal.timeout(11000)});
        if (!response.ok) throw new Error('Place or walking service unavailable');
        return response.json();
    }

    function mapsLink(query) {
        return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
    }

    function displayPlace(data) {
        return {
            id: data.id,
            displayName: data.name,
            formattedAddress: data.address,
            location: {lat: () => data.lat, lng: () => data.lng},
            googleMapsURI: mapsLink(data.lat + ',' + data.lng + ' ' + data.name),
            primaryTypeDisplayName: data.category,
            types: [data.category.toLowerCase()],
            provider: data.provider,
            publicCatalogId: data.catalogId,
            openPlace: true,
            fetchFields: async () => {}
        };
    }

    async function search(text, kind) {
        const data = await request('lab-places', {q: text, kind});
        return data.places.map(displayPlace);
    }

    // Keep the app's existing suggestion selection and trip editor contracts.
    const places = {
        Place: {
            searchByText: async ({textQuery}) => ({places: await search(textQuery, 'discover')}),
            searchNearby: async () => ({places: await search('', 'discover')})
        },
        AutocompleteSessionToken: class {},
        AutocompleteSuggestion: {
            async fetchAutocompleteSuggestions({input}) {
                const places = await search(input, 'suggest');
                return {suggestions: places.map(place => ({placePrediction: {
                    mainText: place.displayName,
                    secondaryText: place.formattedAddress,
                    text: place.displayName,
                    toPlace: () => place
                }}))};
            }
        }
    };

    function walkingButton(from, to, label) {
        const container = document.createElement('div');
        container.className = 'lab-walking';
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        const result = document.createElement('p');
        result.setAttribute('role', 'status');
        const steps = document.createElement('ol');
        steps.hidden = true;
        const fallback = document.createElement('a');
        fallback.target = '_blank';
        fallback.rel = 'noopener noreferrer';
        fallback.textContent = 'Open walking directions in Google Maps';
        const url = new URL('https://www.google.com/maps/dir/');
        url.search = new URLSearchParams({api: '1', travelmode: 'walking',
            origin: from.lat + ',' + from.lng, destination: to.lat + ',' + to.lng});
        fallback.href = url.href;
        fallback.hidden = true;
        button.addEventListener('click', async () => {
            button.disabled = true;
            result.textContent = 'Checking walking directions…';
            steps.hidden = true;
            steps.replaceChildren();
            try {
                const walk = await request('lab-walk', {from: from.lng + ',' + from.lat, to: to.lng + ',' + to.lat});
                const time = Math.max(1, Math.round(walk.seconds / 60));
                result.textContent = Math.round(walk.meters) + ' m · about ' + time + ' min on foot · ' + walk.provider;
                for (const instruction of walk.steps || []) {
                    const item = document.createElement('li');
                    item.textContent = instruction;
                    steps.append(item);
                }
                steps.hidden = !steps.children.length;
            } catch {
                result.textContent = 'Walking route unavailable. Try again or open directions below.';
            } finally {
                fallback.hidden = false;
                button.disabled = false;
            }
        });
        container.append(button, result, steps, fallback);
        return container;
    }

    window.largaOpen = {
        OpenMap, RouteLine, OpenMarker, Bounds: maplibregl.LngLatBounds, places, mapsLink, walkingButton,
        events: {
            trigger: (map, event) => { if (event === 'resize') map.resize(); },
            addListenerOnce: (map, event, callback) => map.once(event, callback)
        }
    };
})();

