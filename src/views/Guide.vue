<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import { scenicSpots as sharedSpots } from '../data/scenicSpots'

// Declaring BMap for TypeScript to avoid "Cannot find name 'BMap'"
declare const BMap: any;
declare const window: any;

const route = useRoute()
const router = useRouter()
const map = ref<any>(null)
const mapContainer = ref<HTMLElement | null>(null)

// Scenic spots data for this tourism app
const scenicSpots = ref<any[]>([]);

const fetchSpots = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/scenic-spots/range?startId=1&endId=13', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const result = await response.json()
        if (result.code === 200 && Array.isArray(result.data)) {
            scenicSpots.value = result.data.map((item: any) => {
                let description = item.description
                try {
                    const descJson = JSON.parse(item.description)
                    description = descJson.overview || item.description
                } catch (e) {
                    // Fallback
                }
                return {
                    name: item.name,
                    position: { lng: item.longitude, lat: item.latitude },
                    description: description,
                    tag: item.tag,
                    image: item.imageUrl
                }
            })
            
            if (map.value) {
                addMarkers()
            }
            checkQueryParam()
        }
    } catch (error) {
        console.error('Failed to fetch spots:', error)
    }
}

const addMarkers = () => {
    const BMapInstance = (window as any).BMap;
    if (!map.value || !BMapInstance) return;

    scenicSpots.value.forEach(spot => {
        const point = new BMapInstance.Point(spot.position.lng, spot.position.lat);
        const marker = new BMapInstance.Marker(point);
        map.value.addOverlay(marker);

        const label = new BMapInstance.Label(spot.name, {
            offset: new BMapInstance.Size(20, -10)
        });
        label.setStyle({
            color: "#333",
            fontSize: "12px",
            lineHeight: "20px",
            fontFamily: "微软雅黑",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "0 5px",
            backgroundColor: "rgba(255,255,255,0.9)"
        });
        marker.setLabel(label);

        // Add info window
        const infoWindowHtml = `
            <div class="iw-container">
                <div class="iw-img-box">
                    <img src="${spot.image}" alt="${spot.name}" />
                </div>
                <div class="iw-body">
                    <h4 class="iw-title">${spot.name}</h4>
                    <p class="iw-text">${spot.description}</p>
                    <div class="iw-btn-wrapper">
                        <button class="iw-btn" onclick="window.goToSpotDetail('${spot.name}')">
                            查看详情
                            <span class="iw-btn-icon">›</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const infoWindow = new BMapInstance.InfoWindow(infoWindowHtml, {
            width: 210, // Match the .iw-container width
            height: 0,
            title: '' // Use custom title in HTML
        });
        marker.addEventListener('click', () => {
            map.value.openInfoWindow(infoWindow, point);
        });
    });
}

const checkQueryParam = () => {
    const spotName = route.query.spot as string;
    if (spotName && map.value) {
        const spot = scenicSpots.value.find(s => s.name === spotName);
        if (spot) {
            // Small delay to ensure markers are ready
            setTimeout(() => {
                panToSpot(spot);
            }, 500);
        }
    }
}

const initMap = () => {
    if (!mapContainer.value) return

    // Check if BMap is defined on window
    const BMapInstance = (window as any).BMap;
    if (!BMapInstance) {
        // console.error('Baidu Maps API (BMap) is not defined. Please check your API key and network connection.');
        // Retry once after 1 second if not loaded
        setTimeout(() => {
            if ((window as any).BMap) initMap();
        }, 1000);
        return;
    }

    // Initialize map in standard mode
    const BMAP_NORMAL_MAP = (window as any).BMAP_NORMAL_MAP;
    map.value = new BMapInstance.Map(mapContainer.value, {
        mapType: BMAP_NORMAL_MAP,
        minZoom: 10,
        maxZoom: 19,
        enableMapClick: false
    })

    map.value.enableScrollWheelZoom(true)

    // Set center and zoom as defined in map_v3.html (initially decreased by 3 steps)
    const centerPoint = new BMapInstance.Point(119.138603157122, 37.7492061024646)
    map.value.centerAndZoom(centerPoint, 13)

    // Add Custom Tile Layer
    const tileLayer = new BMapInstance.TileLayer();
    tileLayer.getTilesUrl = function (tileCoord: any, zoom: number) {
        const x = tileCoord.x;
        const y = tileCoord.y;
        return `/tiles/${zoom}/${x}_${y}.png`;
    }
    map.value.addTileLayer(tileLayer);

    // Add coverage area rectangle as in map_v3.html
    const path = [
        new BMapInstance.Point(118.972452569996, 37.8495683716678),
        new BMapInstance.Point(119.304753744247, 37.8495683716678),
        new BMapInstance.Point(119.304753744247, 37.6488438332614),
        new BMapInstance.Point(118.972452569996, 37.6488438332614),
        new BMapInstance.Point(118.972452569996, 37.8495683716678)
    ];
    const polyline = new BMapInstance.Polyline(path, { strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 });
    map.value.addOverlay(polyline);

    if (scenicSpots.value.length > 0) {
        addMarkers();
    }
}

const panToSpot = (spot: any) => {
    const BMapInstance = (window as any).BMap;
    if (map.value && BMapInstance) {
        const point = new BMapInstance.Point(spot.position.lng, spot.position.lat);
        map.value.panTo(point);
        map.value.setZoom(13); // Use default zoom instead of focusing in
        const infoWindowHtml = `
            <div class="iw-container">
                <div class="iw-img-box">
                    <img src="${spot.image}" alt="${spot.name}" />
                </div>
                <div class="iw-body">
                    <h4 class="iw-title">${spot.name}</h4>
                    <p class="iw-text">${spot.description}</p>
                    <div class="iw-btn-wrapper">
                        <button class="iw-btn" onclick="window.goToSpotDetail('${spot.name}')">
                            查看详情
                            <span class="iw-btn-icon">›</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        const infoWindow = new BMapInstance.InfoWindow(infoWindowHtml, {
            width: 210, // Match the .iw-container width
            height: 0,
            title: ''
        });
        map.value.openInfoWindow(infoWindow, point);
    }
}

const clearMap = () => {
    if (map.value) {
        map.value.clearOverlays()
        map.value = null
    }
}

onMounted(() => {
    // Expose routing function to window for InfoWindow HTML buttons
    (window as any).goToSpotDetail = (spotName: string) => {
        router.push({ name: 'GuideDetail', params: { id: spotName } });
    };

    // Small delay to ensure container is ready and script is loaded
    setTimeout(async () => {
        initMap()
        await fetchSpots()
    }, 100)
})

watch(() => route.query.spot, () => {
    checkQueryParam()
})

onUnmounted(() => {
    clearMap()
    // Cleanup window-level routing function
    delete (window as any).goToSpotDetail;
})
</script>

<template>
    <div class="h-screen w-full relative overflow-hidden bg-gray-50">
        <!-- Map Container -->
        <div ref="mapContainer" class="w-full h-full"></div>

        <!-- Premium UI Overlay (Visible only when spots are present) -->
        <div v-if="scenicSpots.length > 0" class="absolute bottom-10 left-4 right-4 z-[1000] pointer-events-none sm:top-6 sm:left-6 sm:bottom-auto sm:right-auto sm:px-0 sm:w-72 sm:mx-0 max-w-lg mx-auto">
            <div
                class="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/30 pointer-events-auto">
                <div class="flex items-center justify-between mb-3 px-1">
                    <div>
                        <h1 class="text-base font-extrabold text-gray-900 sm:text-lg">导航导览</h1>
                        <p class="text-[10px] text-gray-500 uppercase tracking-wide">Scenic Guide</p>
                    </div>
                </div>

                <div class="flex overflow-x-auto gap-3 pb-1 no-scrollbar sm:flex-col sm:space-y-3 sm:overflow-x-visible sm:pb-0">
                    <div v-for="spot in scenicSpots" :key="spot.name"
                        class="flex-shrink-0 w-40 flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group sm:w-full sm:justify-between"
                        @click="panToSpot(spot)">
                        <div class="flex items-center gap-2 overflow-hidden">
                            <div
                                class="w-7 h-7 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <span class="text-blue-600 text-sm">📍</span>
                            </div>
                            <span class="text-sm font-medium text-gray-700 truncate">{{ spot.name }}</span>
                        </div>
                        <span class="hidden sm:block text-gray-300 group-hover:text-blue-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* Ensure the page takes full height minus TabBar */
.h-screen {
    height: calc(100vh - 64px);
    height: calc(100vh - 64px - env(safe-area-inset-bottom));
}

/* Tailwind-like utilities are now handled by Tailwind CSS v4 */
.text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
}

.text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
}

.font-bold {
    font-weight: 700;
}

.text-gray-900 {
    color: #111827;
}

.mb-1 {
    margin-bottom: 0.25rem;
}

.text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.text-gray-500 {
    color: #6b7280;
}

.mb-4 {
    margin-bottom: 1rem;
}

.space-y-3> :not([hidden])~ :not([hidden]) {
    margin-top: 0.75rem;
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.justify-between {
    justify-content: space-between;
}

.p-3 {
    padding: 0.75rem;
}

.bg-white {
    background-color: #ffffff;
}

.rounded-xl {
    border-radius: 0.75rem;
}

.border-gray-100 {
    border-color: #f3f4f6;
}

.cursor-pointer {
    cursor: pointer;
}

.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.duration-200 {
    transition-duration: 200ms;
}

.gap-3 {
    gap: 0.75rem;
}

.w-8 {
    width: 2rem;
}

.h-8 {
    height: 2rem;
}

.rounded-full {
    border-radius: 9999px;
}

.bg-blue-50 {
    background-color: #eff6ff;
}

.justify-center {
    justify-content: center;
}

.text-blue-600 {
    color: #2563eb;
}

.text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
}

.font-medium {
    font-weight: 500;
}

.text-gray-700 {
    color: #374151;
}

.text-gray-300 {
    color: #d1d5db;
}

.h-4 {
    height: 1rem;
}

.w-4 {
    width: 1rem;
}

/* Hide scrollbar but allow scrolling */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

.bottom-10 {
    bottom: 2.5rem;
}

.left-4 {
    left: 1rem;
}

.right-4 {
    right: 1rem;
}

.z-\[1000\] {
    z-index: 1000;
}

.max-w-lg {
    max-width: 32rem;
}

.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
}

.right-0 {
    right: 0;
}

.p-4 {
    padding: 1rem;
}

.text-base {
    font-size: 1rem;
    line-height: 1.5rem;
}

.text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
}

.font-extrabold {
    font-weight: 800;
}

.text-\[10px\] {
    font-size: 10px;
}

.uppercase {
    text-transform: uppercase;
}

.tracking-wide {
    letter-spacing: 0.025em;
}

.text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
}

.mb-3 {
    margin-bottom: 0.75rem;
}

.px-1 {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
}

.gap-2 {
    gap: 0.5rem;
}

.pb-1 {
    padding-bottom: 0.25rem;
}

.flex-shrink-0 {
    flex-shrink: 0;
}

.w-40 {
    width: 10rem;
}

.w-7 {
    width: 1.75rem;
}

.h-7 {
    height: 1.75rem;
}

.overflow-x-auto {
    overflow-x: auto;
}

.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (min-width: 640px) {
    .sm\:top-6 { top: 1.5rem; }
    .sm\:left-6 { left: 1.5rem; }
    .sm\:bottom-auto { bottom: auto; }
    .sm\:right-auto { right: auto; }
    .sm\:px-0 { padding-left: 0; padding-right: 0; }
    .sm\:w-72 { width: 18rem; }
    .sm\:mx-0 { margin-left: 0; margin-right: 0; }
    .sm\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .sm\:flex-col { flex-direction: column; }
    .sm\:space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; }
    .sm\:overflow-x-visible { overflow-x: visible; }
    .sm\:pb-0 { padding-bottom: 0; }
    .sm\:w-full { width: 100%; }
    .sm\:justify-between { justify-content: space-between; }
    .sm\:block { display: block; }
}

@media (max-width: 639px) {
    .hidden { display: none; }
}

/* Custom styles for the BMap labels to make them look modern */
:deep(.BMap_Label) {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateX(-50%);
}

:deep(.iw-container) {
    width: 210px;
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding-bottom: 2px;
}

:deep(.iw-img-box) {
    width: 100%;
    height: 110px;
    overflow: hidden;
}

:deep(.iw-img-box img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

:deep(.iw-body) {
    padding: 12px;
}

:deep(.iw-title) {
    font-size: 15px;
    font-weight: 800;
    color: #333;
    margin: 0 0 6px 0;
}

:deep(.iw-text) {
    font-size: 12px;
    color: #666;
    line-height: 1.5;
    margin: 0 0 12px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

:deep(.iw-btn-wrapper) {
    display: flex;
    justify-content: flex-end;
}

:deep(.iw-btn) {
    background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
    color: #fff;
    border: none;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 4px 10px rgba(110, 142, 251, 0.25);
    transition: transform 0.2s ease;
}

:deep(.iw-btn:active) {
    transform: scale(0.95);
}

:deep(.iw-btn-icon) {
    font-size: 12px;
}

/* Ensure the InfoWindow itself doesn't have restrictive borders */
:deep(.BMap_bubble_title) {
    display: none !important;
}

/* Hide the default BMap close button background if needed or style it */
:deep(.BMap_pop img) {
    z-index: 1001;
}
</style>

<!-- Global CSS for Baidu Maps Overrides - Clean Unified Card Only -->
<style>
.BMap_pop {
    background: transparent !important;
}

/* Hide ALL default bubble parts (slices and beak) */
.BMap_pop > div {
    display: none !important;
}

/* Show ONLY the content container (verified as 9th child) */
.BMap_pop > div:nth-child(9) {
    display: block !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
}

/* Specifically ensure the arrow/beak identified as 11th child is hidden */
.BMap_pop > div:nth-child(11),
.BMap_pop div[style*="width: 34px"][style*="height: 50px"] {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
}

.BMap_pop > div > div {
    background: transparent !important;
    background-image: none !important;
    border: none !important;
    box-shadow: none !important;
}

.BMap_bubble_content {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    overflow: visible !important;
}

.BMap_bubble_center {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}

.BMap_bubble_top,
.BMap_bubble_bottom {
    background: transparent !important;
}

/* Hide shadow and other default UI elements */
.BMap_shadow,
.BMap_bubble_title,
.BMap_bubble_buttons,
.BMap_pop img[style*="top: 10px"] { /* Attempt to hide default close button */
    display: none !important;
}

/* Target the wrapper that usually adds the white background */
.BMap_bubble_pop {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
}
</style>
