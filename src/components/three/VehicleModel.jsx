import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { isBaked, rewireBaked } from './bakedTexture'

// Size the car by its bodywork. Several of these GLBs carry decorative light
// cards that float a metre past the nose — measuring the whole scene would
// both scale the car down to fit a flare nobody can see and leave a slab
// hanging in mid-air. So the box is built from the meshes holding the bulk of
// the geometry, and any small mesh that breaks out of that box is treated as
// one of those cards and hidden. Small is the important half of the test:
// bodywork never qualifies, however oddly it is shaped.
const CORE_SHARE = 0.85
const SLACK = 1.08
const CARD_SHARE = 0.03

function measure(root) {
  const parts = []
  let totalVerts = 0

  root.traverse((child) => {
    if (!child.isMesh) return
    const verts = child.geometry.attributes.position?.count ?? 0
    const box = new THREE.Box3().setFromObject(child)
    parts.push({ child, verts, box })
    totalVerts += verts
  })

  parts.sort((a, b) => b.verts - a.verts)

  const core = new THREE.Box3()
  let covered = 0
  for (const part of parts) {
    if (covered >= totalVerts * CORE_SHARE) break
    core.union(part.box)
    covered += part.verts
  }

  const padded = core.clone()
  const size = new THREE.Vector3()
  core.getSize(size)
  padded.expandByVector(size.multiplyScalar((SLACK - 1) / 2))

  parts.forEach(({ child, box, verts }) => {
    if (verts < totalVerts * CARD_SHARE && !padded.containsBox(box)) {
      child.visible = false
    }
  })

  return core
}

// The five GLBs were authored by different hands: different units, different
// forward axes, some baked flat and some with real clearcoat paint. This
// normalises any of them to the same footprint — wheels on y=0, length along
// z, a known size — so the gallery can treat them interchangeably.
export default function VehicleModel({ url, length = 4.6, spin = 0, ...props }) {
  const { scene } = useGLTF(url)

  const model = useMemo(() => {
    const root = scene.clone(true)

    root.traverse((child) => {
      if (!child.isMesh) return

      if (isBaked(child.material)) {
        rewireBaked(child)
      } else {
        // Authored materials only need the environment turning up to sit in
        // this lighting; their own paint, glass and chrome are kept.
        child.material = child.material.clone()
        child.material.envMapIntensity = 1.25
      }

      child.castShadow = true
      child.receiveShadow = true
    })

    // Longest horizontal axis is the car's length; if it runs along x, turn it
    // a quarter so every model faces the same way before `spin` is applied.
    const first = measure(root)
    const firstSize = new THREE.Vector3()
    first.getSize(firstSize)

    if (firstSize.x > firstSize.z) {
      root.rotation.y = Math.PI / 2
      root.updateMatrixWorld(true)
    }

    const box = measure(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const scale = length / size.z
    root.scale.setScalar(scale)
    root.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)

    const wrapper = new THREE.Group()
    wrapper.add(root)
    return wrapper
  }, [scene, length])

  return (
    <group rotation={[0, spin, 0]} {...props}>
      <primitive object={model} />
    </group>
  )
}
