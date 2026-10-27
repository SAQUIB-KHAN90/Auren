import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import CarModel from '@/components/hero/CarModel'

// A turntable rig rather than the hero's single-key setup: light wraps the car
// from both sides so no angle falls into the dark as it spins.
function TurntableRig() {
  return (
    <Environment resolution={512} frames={1}>
      <color attach="background" args={['#05070a']} />
      <Lightformer
        form="rect"
        intensity={5.5}
        position={[0, 6, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[16, 6, 1]}
      />
      <Lightformer
        form="rect"
        intensity={3.4}
        color="#9bc2ff"
        position={[-8, 3, 2]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[12, 6, 1]}
      />
      <Lightformer
        form="rect"
        intensity={3.4}
        color="#dce8ff"
        position={[8, 3, -2]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[12, 6, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.6}
        color="#ffffff"
        position={[0, 2, 9]}
        scale={[9, 4, 1]}
      />
      <Lightformer
        form="ring"
        intensity={2}
        color="#4C8DFF"
        position={[0, 1.4, -8]}
        scale={6}
      />
    </Environment>
  )
}

export default function ShowcaseStage({ paint }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 1.45, 6.9], fov: 34 }}
    >
      <Suspense fallback={null}>
        <StageContents paint={paint} />
      </Suspense>
    </Canvas>
  )
}

function StageContents({ paint }) {
  return (
    <>
      <TurntableRig />

      <ambientLight intensity={0.45} />
      <directionalLight
        position={[5, 9, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      />
      <spotLight position={[-7, 6, -4]} angle={0.6} penumbra={1} intensity={45} color="#8fb6ff" />

      <CarModel paint={paint} rotation={-0.75} length={5.1} idle={false} />

      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.9}
        scale={16}
        blur={2.4}
        far={3.5}
        resolution={1024}
        color="#000000"
      />

      {/* Full turntable here — this section is about inspecting the car, so the
          only limits are vertical, to keep the camera above the floor. */}
      <OrbitControls
        makeDefault
        target={[0, 0.55, 0]}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.45}
        minPolarAngle={0.95}
        maxPolarAngle={1.5}
      />
    </>
  )
}
