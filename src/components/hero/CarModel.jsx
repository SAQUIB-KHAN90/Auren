import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { toSilver } from '@/components/three/bakedTexture'

const MODEL_URL = '/models/3d-mclaren-720s-sports-car.glb'

// The GLB ships as a single baked mesh: black base colour plus a full-bright
// emissive texture. Rewire it onto a standard material so scene lights and the
// environment actually touch the body instead of it rendering flat.
function useLitScene(length) {
  const { scene } = useGLTF(MODEL_URL)

  return useMemo(() => {
    const root = scene.clone(true)
    const materials = []

    root.traverse((child) => {
      if (!child.isMesh) return

      const baked = toSilver(child.material.emissiveMap ?? child.material.map)

      child.material = new THREE.MeshStandardMaterial({
        map: baked,
        emissiveMap: baked,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.12,
        metalness: 0.72,
        roughness: 0.24,
        envMapIntensity: 1.4,
        side: THREE.FrontSide,
      })
      child.castShadow = true
      child.receiveShadow = true
      materials.push(child.material)
    })

    // Normalise: sit the wheels on y = 0 and scale the body to `length` units.
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const scale = length / size.z
    root.scale.setScalar(scale)
    root.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)

    return { root, materials }
  }, [scene, length])
}

export default function CarModel({
  rotation = 0,
  paint = '#ffffff',
  idle = true,
  length = 4.2,
  ...props
}) {
  const group = useRef()
  const { root, materials } = useLitScene(length)

  useLayoutEffect(() => {
    if (group.current) group.current.rotation.y = rotation
  }, [rotation])

  // Paint is a tint over the greyscale bake, so tyres and glass stay dark while
  // the bodywork takes the colour. Tweening a proxy and lerping from it, rather
  // than tweening the Color's own r/g/b, which gsap does not pick up.
  useEffect(() => {
    const target = new THREE.Color(paint)
    const tweens = materials.map((material) => {
      const fromColor = material.color.clone()
      const fromEmissive = material.emissive.clone()
      const proxy = { t: 0 }

      return gsap.to(proxy, {
        t: 1,
        duration: 0.65,
        ease: 'power2.out',
        onUpdate() {
          material.color.lerpColors(fromColor, target, proxy.t)
          material.emissive.lerpColors(fromEmissive, target, proxy.t)
        },
      })
    })

    return () => tweens.forEach((tween) => tween.kill())
  }, [paint, materials])

  // A slow idle drift — enough to read as a live render, never enough to distract.
  useFrame((state) => {
    if (!group.current || !idle) return
    const t = state.clock.elapsedTime
    group.current.rotation.y = rotation + Math.sin(t * 0.18) * 0.02
    group.current.position.y = Math.sin(t * 0.5) * 0.012
  })

  return (
    <group ref={group} {...props}>
      <primitive object={root} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)
