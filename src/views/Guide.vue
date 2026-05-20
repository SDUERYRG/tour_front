<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadAMap, type LngLatTuple } from '../utils/amap'

type MapInstance = {
  add: (overlays: unknown[] | unknown) => void
  addControl: (control: unknown) => void
  clearInfoWindow: () => void
  destroy: () => void
  remove: (overlays: unknown[] | unknown) => void
  setFitView: (overlays?: unknown[] | unknown) => void
  setZoomAndCenter: (zoom: number, center: LngLatTuple) => void
}

type TileLayerInstance = {
  setMap?: (map: unknown) => void
}

interface ScenicSpot {
  name: string
  position: LngLatTuple
  description: string
  tag?: string
  image: string
}

interface ScenicSpotApiItem {
  description: string
  imageUrl: string
  latitude: number | string
  longitude: number | string
  name: string
  tag?: string
}

declare global {
  interface Window {
    goToSpotDetail?: (spotName: string) => void
  }
}

const DEFAULT_CENTER: LngLatTuple = [119.1319005, 37.741347]
const COVERAGE_PATH: LngLatTuple[] = [
  [118.962516, 37.846386],
  [119.301285, 37.846386],
  [119.301285, 37.636308],
  [118.962516, 37.636308],
  [118.962516, 37.846386],
]
const TILE_ROOT = 'original2_Gaode/tiles'
const TILE_ZOOM_RANGE: [number, number] = [10, 19]
const DEFAULT_ZOOM = 11

const route = useRoute()
const router = useRouter()

const mapContainer = ref<HTMLElement | null>(null)
const scenicSpots = ref<ScenicSpot[]>([])
const map = ref<MapInstance | null>(null)

let coveragePolyline: { setMap?: (map: unknown) => void } | null = null
let customTileLayer: TileLayerInstance | null = null
let infoWindow: {
  close: () => void
  open: (map: unknown, position: LngLatTuple) => void
  setContent: (content: string) => void
} | null = null
let markers: unknown[] = []

const buildTileUrl = (x: number, y: number, z: number) =>
  new URL(`${TILE_ROOT}/${z}/${x}_${y}.png`, `${window.location.origin}${import.meta.env.BASE_URL}`).toString()

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const buildInfoWindowHtml = (spot: ScenicSpot) => {
  const safeName = escapeHtml(spot.name)
  const safeDescription = escapeHtml(spot.description)
  const safeImage = escapeHtml(spot.image)
  const encodedName = encodeURIComponent(spot.name)

  return `
    <div class="guide-info-window">
      <div class="guide-info-window__image">
        <img src="${safeImage}" alt="${safeName}" />
      </div>
      <div class="guide-info-window__body">
        <h4 class="guide-info-window__title">${safeName}</h4>
        <p class="guide-info-window__text">${safeDescription}</p>
        <button
          class="guide-info-window__button"
          onclick="window.goToSpotDetail && window.goToSpotDetail(decodeURIComponent('${encodedName}'))"
        >
          查看详情
          <span class="guide-info-window__button-icon">></span>
        </button>
      </div>
    </div>
  `
}

const buildMarkerHtml = (spot: ScenicSpot) => {
  const safeName = escapeHtml(spot.name)

  return `
    <div class="guide-marker">
      <span class="guide-marker__label">${safeName}</span>
      <span class="guide-marker__pin"></span>
    </div>
  `
}

const parseDescription = (description: string) => {
  try {
    const parsed = JSON.parse(description) as { overview?: string }
    return parsed.overview || description
  } catch {
    return description
  }
}

const clearMarkers = () => {
  if (map.value && markers.length > 0) {
    map.value.remove(markers)
  }

  markers = []
}

const openSpotInfoWindow = (spot: ScenicSpot) => {
  if (!map.value || !infoWindow) {
    return
  }

  infoWindow.setContent(buildInfoWindowHtml(spot))
  infoWindow.open(map.value, spot.position)
}

const addMarkers = async () => {
  if (!map.value || scenicSpots.value.length === 0) {
    return
  }

  const AMap = await loadAMap()
  const MarkerCtor = AMap.Marker as new (options: Record<string, unknown>) => {
    on: (eventName: string, callback: () => void) => void
  }
  const PixelCtor = AMap.Pixel as new (x: number, y: number) => unknown

  clearMarkers()

  markers = scenicSpots.value.map((spot) => {
    const marker = new MarkerCtor({
      anchor: 'bottom-center',
      content: buildMarkerHtml(spot),
      offset: new PixelCtor(0, 12),
      position: spot.position,
      title: spot.name,
    })

    marker.on('click', () => {
      openSpotInfoWindow(spot)
    })

    return marker
  })

  map.value.add(markers)
}

const focusOnSpots = () => {
  if (!map.value || markers.length === 0) {
    return
  }

  map.value.setFitView(markers)
}

const checkQueryParam = () => {
  const spotName = route.query.spot as string | undefined

  if (!spotName) {
    return
  }

  const spot = scenicSpots.value.find((item) => item.name === spotName)
  if (!spot) {
    return
  }

  window.setTimeout(() => {
    panToSpot(spot)
  }, 120)
}

const fetchSpots = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/scenic-spots/range?startId=1&endId=20', {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })
    const result = await response.json()

    if (result.code !== 200 || !Array.isArray(result.data)) {
      return
    }

    scenicSpots.value = (result.data as ScenicSpotApiItem[]).map((item) => ({
      description: parseDescription(item.description),
      image: item.imageUrl,
      name: item.name,
      position: [Number(item.longitude), Number(item.latitude)] as LngLatTuple,
      tag: item.tag,
    }))

    if (map.value) {
      await addMarkers()
      if (!route.query.spot) {
        focusOnSpots()
      }
    }

    checkQueryParam()
  } catch (error) {
    console.error('Failed to fetch scenic spots:', error)
  }
}

const initMap = async () => {
  if (!mapContainer.value || map.value) {
    return
  }

  const AMap = await loadAMap()
  const MapCtor = AMap.Map as new (container: HTMLElement, options: Record<string, unknown>) => MapInstance
  const TileLayerCtor = AMap.TileLayer as new (options?: Record<string, unknown>) => TileLayerInstance
  const PolylineCtor = AMap.Polyline as new (options: Record<string, unknown>) => {
    setMap?: (map: unknown) => void
  }
  const InfoWindowCtor = AMap.InfoWindow as new (options: Record<string, unknown>) => {
    close: () => void
    open: (map: unknown, position: LngLatTuple) => void
    setContent: (content: string) => void
  }
  const ScaleCtor = AMap.Scale as new () => unknown
  const ToolBarCtor = AMap.ToolBar as new (options: Record<string, unknown>) => unknown
  const PixelCtor = AMap.Pixel as new (x: number, y: number) => unknown

  map.value = new MapCtor(mapContainer.value, {
    center: DEFAULT_CENTER,
    expandZoomRange: true,
    layers: [new TileLayerCtor()],
    resizeEnable: true,
    viewMode: '2D',
    zoom: DEFAULT_ZOOM,
    zooms: TILE_ZOOM_RANGE,
  })

  map.value.addControl(new ScaleCtor())
  map.value.addControl(
    new ToolBarCtor({
      position: {
        right: '16px',
        top: '16px',
      },
    }),
  )

  customTileLayer = new TileLayerCtor({
    getTileUrl: (x: number, y: number, z: number) => buildTileUrl(x, y, z),
    zIndex: 120,
  })
  customTileLayer.setMap?.(map.value)

  coveragePolyline = new PolylineCtor({
    path: COVERAGE_PATH,
    strokeColor: '#2563eb',
    strokeOpacity: 0.42,
    strokeWeight: 4,
  })

  map.value.add(coveragePolyline)

  infoWindow = new InfoWindowCtor({
    anchor: 'bottom-center',
    closeWhenClickMap: true,
    isCustom: true,
    offset: new PixelCtor(0, -18),
  })

  if (scenicSpots.value.length > 0) {
    await addMarkers()
  }
}

const panToSpot = (spot: ScenicSpot) => {
  if (!map.value) {
    return
  }

  map.value.setZoomAndCenter(13, spot.position)
  openSpotInfoWindow(spot)
}

const clearMap = () => {
  infoWindow?.close()
  clearMarkers()

  if (coveragePolyline?.setMap) {
    coveragePolyline.setMap(null)
  }

  if (customTileLayer?.setMap) {
    customTileLayer.setMap(null)
  }

  coveragePolyline = null
  customTileLayer = null
  infoWindow = null

  if (map.value) {
    map.value.destroy()
    map.value = null
  }
}

onMounted(async () => {
  window.goToSpotDetail = (spotName: string) => {
    router.push({ name: 'GuideDetail', params: { id: spotName } })
  }

  await initMap()
  await fetchSpots()
})

watch(
  () => route.query.spot,
  () => {
    checkQueryParam()
  },
)

onUnmounted(() => {
  clearMap()
  delete window.goToSpotDetail
})
</script>

<template>
  <div class="guide-page">
    <div ref="mapContainer" class="guide-map"></div>

    <div v-if="scenicSpots.length > 0" class="guide-panel">
      <div class="guide-panel__card">
        <div class="guide-panel__header">
          <div>
            <h1 class="guide-panel__title">景区导览</h1>
            <p class="guide-panel__subtitle">Scenic Guide</p>
          </div>
        </div>

        <div class="guide-panel__list">
          <button v-for="spot in scenicSpots" :key="spot.name" class="guide-panel__item" type="button"
            @click="panToSpot(spot)">
            <div class="guide-panel__item-main">
              <span class="guide-panel__item-icon">●</span>
              <span class="guide-panel__item-name">{{ spot.name }}</span>
            </div>
            <span class="guide-panel__item-arrow">></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide-page {
  position: relative;
  height: calc(100vh - 64px);
  height: calc(100vh - 64px - env(safe-area-inset-bottom));
  width: 100%;
  overflow: hidden;
  background: #eef4fb;
}

.guide-map {
  height: 100%;
  width: 100%;
}

.guide-panel {
  pointer-events: none;
  position: absolute;
  bottom: 2.5rem;
  left: 1rem;
  right: 1rem;
  z-index: 20;
  margin: 0 auto;
  max-width: 32rem;
}

.guide-panel__card {
  pointer-events: auto;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(18px);
  box-shadow: 0 20px 55px rgba(15, 23, 42, 0.16);
  padding: 1rem;
}

.guide-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding: 0 0.25rem;
}

.guide-panel__title {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
}

.guide-panel__subtitle {
  color: #64748b;
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.guide-panel__list {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;
}

.guide-panel__list::-webkit-scrollbar {
  display: none;
}

.guide-panel__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-width: 10rem;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #ffffff;
  color: #334155;
  cursor: pointer;
  padding: 0.8rem 0.9rem;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.guide-panel__item:hover {
  border-color: #60a5fa;
  background: #eff6ff;
}

.guide-panel__item:active {
  transform: scale(0.98);
}

.guide-panel__item-main {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
}

.guide-panel__item-icon {
  color: #2563eb;
  font-size: 0.85rem;
}

.guide-panel__item-name {
  overflow: hidden;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.guide-panel__item-arrow {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 700;
}

:deep(.guide-marker) {
  align-items: center;
  display: flex;
  flex-direction: column;
  transform: translateY(-8px);
}

:deep(.guide-marker__label) {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.32);
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
  color: #0f172a;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.45rem 0.8rem;
  white-space: nowrap;
}

:deep(.guide-marker__pin) {
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
  border: 3px solid rgba(255, 255, 255, 0.95);
  border-radius: 999px;
  box-shadow: 0 10px 18px rgba(37, 99, 235, 0.28);
  display: block;
  height: 16px;
  margin-top: 0.45rem;
  width: 16px;
}

:deep(.guide-info-window) {
  background: #ffffff;
  border-radius: 1.1rem;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.2);
  overflow: hidden;
  width: 220px;
}

:deep(.guide-info-window__image) {
  height: 116px;
  overflow: hidden;
  width: 100%;
}

:deep(.guide-info-window__image img) {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

:deep(.guide-info-window__body) {
  padding: 0.9rem;
}

:deep(.guide-info-window__title) {
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 800;
  margin: 0 0 0.4rem;
}

:deep(.guide-info-window__text) {
  color: #475569;
  display: -webkit-box;
  font-size: 0.78rem;
  line-clamp: 2;
  line-height: 1.55;
  margin: 0 0 0.85rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

:deep(.guide-info-window__button) {
  align-items: center;
  background: linear-gradient(135deg, #2563eb 0%, #0f766e 100%);
  border: none;
  border-radius: 999px;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 700;
  gap: 0.35rem;
  justify-content: center;
  padding: 0.45rem 0.85rem;
}

:deep(.guide-info-window__button-icon) {
  font-size: 0.7rem;
}

@media (min-width: 640px) {
  .guide-panel {
    bottom: auto;
    left: 1.5rem;
    margin: 0;
    max-width: none;
    right: auto;
    top: 1.5rem;
    width: 18rem;
  }

  .guide-panel__list {
    display: grid;
    gap: 0.75rem;
    overflow: visible;
    padding-bottom: 0;
  }

  .guide-panel__item {
    min-width: 0;
    width: 100%;
  }
}
</style>
