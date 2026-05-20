const AMAP_KEY = import.meta.env.VITE_AMAP_KEY ?? 'f7b3799e84f864e59095438cafa22efd'
const AMAP_SECURITY_JS_CODE =
  import.meta.env.VITE_AMAP_SECURITY_JS_CODE ?? 'd288cb6de19de7d78f34e41c21b71db6'
const AMAP_SCRIPT_ID = 'tour-front-amap-jsapi'
const AMAP_SCRIPT_SRC =
  `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Scale,AMap.ToolBar`

export type LngLatTuple = [number, number]
export type AMapNamespace = Record<string, unknown>

declare global {
  interface Window {
    AMap?: AMapNamespace
    _AMapSecurityConfig?: {
      securityJsCode?: string
      serviceHost?: string
    }
  }
}

let amapLoadingPromise: Promise<AMapNamespace> | null = null

export const loadAMap = async (): Promise<AMapNamespace> => {
  if (window.AMap) {
    return window.AMap
  }

  if (amapLoadingPromise) {
    return amapLoadingPromise
  }

  window._AMapSecurityConfig = {
    ...window._AMapSecurityConfig,
    securityJsCode: AMAP_SECURITY_JS_CODE,
  }

  amapLoadingPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(AMAP_SCRIPT_ID) as HTMLScriptElement | null

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.AMap) {
          resolve(window.AMap)
          return
        }

        reject(new Error('AMap JSAPI loaded, but window.AMap is unavailable.'))
      })

      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load the AMap JSAPI script.'))
      })

      return
    }

    const script = document.createElement('script')
    script.id = AMAP_SCRIPT_ID
    script.src = AMAP_SCRIPT_SRC
    script.async = true
    script.defer = true

    script.addEventListener('load', () => {
      if (window.AMap) {
        resolve(window.AMap)
        return
      }

      reject(new Error('AMap JSAPI loaded, but window.AMap is unavailable.'))
    })

    script.addEventListener('error', () => {
      amapLoadingPromise = null
      reject(new Error('Failed to load the AMap JSAPI script.'))
    })

    document.head.appendChild(script)
  })

  return amapLoadingPromise
}
