<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Declaring BMap for TypeScript to avoid "Cannot find name 'BMap'"
declare const BMap: any;
declare const window: any;

const map = ref<any>(null)
const mapContainer = ref<HTMLElement | null>(null)

// Scenic spots data for this tourism app
const scenicSpots = [
    { name: '黄河入海口', position: { lng: 119.167389, lat: 37.766324 }, description: '黄河在此奔流汇入渤海' },
    { name: '湿地公园', position: { lng: 119.155462, lat: 37.755234 }, description: '观赏珍稀鸟类和原始湿地' },
    { name: '红地毯景观', position: { lng: 119.180231, lat: 37.770125 }, description: '独特的翅碱蓬形成红色海洋' },
    { name: '远望楼', position: { lng: 119.165213, lat: 37.760123 }, description: '登高远眺，尽览豪情' }
];

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

    // Initialize map with user's implementation pattern
    map.value = new BMapInstance.Map(mapContainer.value, {
        enableMapClick: false
    })

    map.value.enableScrollWheelZoom(true)

    // Using a center point that encompasses our spots or the user's suggested center
    const centerPoint = new BMapInstance.Point(119.167389, 37.766324)
    map.value.centerAndZoom(centerPoint, 13)

    // Add markers for all scenic spots
    scenicSpots.forEach(spot => {
        const point = new BMapInstance.Point(spot.position.lng, spot.position.lat);
        const marker = new BMapInstance.Marker(point);
        map.value.addOverlay(marker);

        const label = new BMapInstance.Label(spot.name, {
            offset: new BMapInstance.Size(20, -10)
        });
        label.setStyle({
            color: "#333",
            fontSize: "12px",
            height: "20px",
            lineHeight: "20px",
            fontFamily: "微软雅黑",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "0 5px",
            backgroundColor: "rgba(255,255,255,0.9)"
        });
        marker.setLabel(label);

        // Add info window
        const infoWindow = new BMapInstance.InfoWindow(spot.description, {
            width: 200,
            height: 60,
            title: spot.name
        });
        marker.addEventListener('click', () => {
            map.value.openInfoWindow(infoWindow, point);
        });
    });
}

const panToSpot = (spot: any) => {
    const BMapInstance = (window as any).BMap;
    if (map.value && BMapInstance) {
        const point = new BMapInstance.Point(spot.position.lng, spot.position.lat);
        map.value.panTo(point);
        // Optionally open info window
        const infoWindow = new BMapInstance.InfoWindow(spot.description, {
            width: 200,
            height: 60,
            title: spot.name
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
    // Small delay to ensure container is ready and script is loaded
    setTimeout(() => {
        initMap()
    }, 100)
})

onUnmounted(() => {
    clearMap()
})
</script>

<template>
    <div class="h-screen w-full relative overflow-hidden bg-gray-50">
        <!-- Map Container -->
        <div ref="mapContainer" class="w-full h-full"></div>

        <!-- Premium UI Overlay -->
        <div class="absolute bottom-10 left-4 right-4 z-[1000] pointer-events-none sm:top-6 sm:left-6 sm:bottom-auto sm:right-auto sm:px-0 sm:w-72 sm:mx-0 max-w-lg mx-auto">
            <div
                class="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/30 pointer-events-auto">
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

/* Tailwind-like utilities if they aren't globally available */
.w-full {
    width: 100%;
}

.h-full {
    height: 100%;
}

.relative {
    position: relative;
}

.absolute {
    position: absolute;
}

.overflow-hidden {
    overflow: hidden;
}

.top-6 {
    top: 1.5rem;
}

.left-6 {
    left: 1.5rem;
}

.z-10 {
    z-index: 10;
}

.w-72 {
    width: 18rem;
}

.bg-white\/80 {
    background-color: rgba(255, 255, 255, 0.8);
}

.backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

.rounded-2xl {
    border-radius: 1rem;
}

.p-5 {
    padding: 1.25rem;
}

.shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.border {
    border-width: 1px;
}

.border-white\/20 {
    border-color: rgba(255, 255, 255, 0.2);
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

/* Custom styles for the BMap labels to make them look modern */
:deep(.BMap_Label) {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateX(-50%);
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
</style>
