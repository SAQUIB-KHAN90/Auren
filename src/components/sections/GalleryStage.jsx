import { ContactShadows, Environment, Lightformer, OrbitControls, useProgress } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import VehicleModel from '@/components/three/VehicleModel'

// Cars sit side by side on a rail; sliding the rail brings the next one to
// centre stage. Spacing is deliberately short and the off-centre cars are
// hidden outright — the camera orbits, so a car parked far to one side would
// otherwise swing into shot as the view comes round.
const SPACING = 8
const VISIBLE_WITHIN = SPACING * 0.9

function Rail({ cars, active, mounted }) {
  const rail = useRef()

  useFrame((state, delta) => {
    if (!rail.current) return
    const wanted = -active * SPACING
    rail.current.position.x = THREE.MathUtils.damp(
      rail.current.position.x,
      wanted,
      4.2,
      delta,
    )

    // Only the car on stage, and whichever one is sliding past, are drawn.
    rail.current.children.forEach((child) => {
      child.visible = Math.abs(child.position.x + rail.current.position.x) < VISIBLE_WITHIN
    })
  })

  return (
    <group ref={rail}>
      {cars.map((car, i) =>
        mounted.has(i) ? (
          <Suspense key={car.id} fallback={null}>
            <group position={[i * SPACING, 0, 0]}>
              <VehicleModel url={car.url} spin={car.spin} length={car.length ?? 4.6} />
            </group>
          </Suspense>
        ) : null,
      )}
    </group>
  )
}

function ShowroomRig() {
  return (
    <Environment resolution={512} frames={1}>
      <color attach="background" args={['#05070a']} />
      <Lightformer
        form="rect"
        intensity={5.5}
        position={[0, 7, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[18, 6, 1]}
      />
      <Lightformer
        form="rect"
        intensity={3.6}
        color="#9bc2ff"
        position={[-8, 3, 3]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[12, 6, 1]}
      />
      <Lightformer
        form="rect"
        intensity={3.6}
        color="#dce8ff"
        position={[8, 3, -3]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[12, 6, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.4}
        position={[0, 2, 9]}
        scale={[9, 4, 1]}
      />
    </Environment>
  )
}

export default function GalleryStage({ cars, active, mounted, onReady }) {
  // `active` is already the selected car, so the loader flag needs its own name.
  const { active: stillLoading } = useProgress()

  useEffect(() => {
    if (!stillLoading) onReady?.()
  }, [stillLoading, onReady])

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 1.5, 7.4], fov: 34 }}
    >
      <Suspense fallback={null}>
        <ShowroomRig />

        <ambientLight intensity={0.45} />
        <directionalLight
          position={[5, 9, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
        />
        <spotLight position={[-7, 6, -4]} angle={0.6} penumbra={1} intensity={45} color="#8fb6ff" />

        <Rail cars={cars} active={active} mounted={mounted} />

        <ContactShadows
          position={[0, 0.002, 0]}
          opacity={0.9}
          scale={16}
          blur={2.4}
          far={3.5}
          resolution={1024}
          color="#000000"
        />

        {/* Each car is inspectable: drag to orbit, no zoom or pan so the shot
            cannot be broken, and the camera stays above the floor. */}
        <OrbitControls
          makeDefault
          target={[0, 0.55, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          autoRotate
          autoRotateSpeed={0.4}
          minPolarAngle={0.95}
          maxPolarAngle={1.5}
        />
      </Suspense>
    </Canvas>
  )
}
