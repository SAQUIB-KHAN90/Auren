import * as THREE from 'three'

const silverCache = new Map()

// Some of the supplied GLBs are photogrammetry-style bakes: one mesh, one
// material, a black base colour and a full-bright emissive texture carrying
// all the shading. This rebakes such a texture to greyscale with a faint cool
// cast, which both matches the art direction and leaves a neutral base that a
// paint colour can be multiplied over. Cached, since several scenes share it.
export function toSilver(texture) {
  const image = texture?.image
  if (!image?.width) return texture
  if (silverCache.has(texture.uuid)) return silverCache.get(texture.uuid)

  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.filter = 'grayscale(1) brightness(1.18) contrast(1.12)'
  ctx.drawImage(image, 0, 0)
  ctx.globalCompositeOperation = 'overlay'
  ctx.fillStyle = 'rgba(126,160,210,0.16)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const silver = new THREE.CanvasTexture(canvas)
  silver.flipY = false
  silver.colorSpace = THREE.SRGBColorSpace
  silver.needsUpdate = true
  silverCache.set(texture.uuid, silver)
  return silver
}

// A baked material renders flat under any lighting, so it has to be rewired
// onto a standard material before the scene can touch it. Properly authored
// models (separate paint, glass, rubber, clearcoat) are left alone.
export function isBaked(material) {
  const { color } = material
  return Boolean(
    material.emissiveMap &&
      color &&
      color.r < 0.02 &&
      color.g < 0.02 &&
      color.b < 0.02,
  )
}

export function rewireBaked(mesh) {
  const baked = toSilver(mesh.material.emissiveMap ?? mesh.material.map)

  mesh.material = new THREE.MeshStandardMaterial({
    map: baked,
    emissiveMap: baked,
    emissive: new THREE.Color('#ffffff'),
    emissiveIntensity: 0.12,
    metalness: 0.72,
    roughness: 0.24,
    envMapIntensity: 1.4,
    side: THREE.FrontSide,
  })

  return mesh.material
}
