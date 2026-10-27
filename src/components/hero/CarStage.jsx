import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import CarModel from './CarModel'

// Built from Lightformers rather than an HDRI preset so nothing is fetched at
// runtime, and so the reflections can be shaped like a studio rig.
function StudioRig() {
  return (
    <Environment resolution={512} frames={1}>
      <color attach="background" args={['#05070a']} />
      {/* long overhead strip — the streak that runs down the roof and hood */}
      <Lightformer
        form="rect"
        intensity={6}
        position={[0, 6, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[14, 3, 1]}
      />
      {/* cool key from camera-left, matching the backdrop's horizon glow */}
      <Lightformer
        form="rect"
        intensity={3.4}
        color="#9bc2ff"
        position={[-7, 3, 4]}
        rotation={[0, Math.PI / 2.2, 0]}
        scale={[12, 5, 1]}
      />
      {/* rim light standing in for the neon arc behind the car */}
      <Lightformer
        form="rect"
        intensity={5}
        color="#dce8ff"
        position={[7, 2.4, -3]}
        rotation={[0, -Math.PI / 2.4, 0]}
        scale={[10, 4, 1]}
      />
      <Lightformer
        form="ring"
        intensity={2.2}
        color="#4C8DFF"
        position={[3, 1, 6]}
        scale={5}
      />
    </Environment>
  )
}

// Suspense only renders its children once the model has resolved, so mounting
// this is the signal that the car is actually on screen. Reading progress
// instead is unreliable: CarModel preloads at module scope, so the loader can
// already be idle by the time anything here mounts.
function SignalReady({ onReady }) {
  useEffect(() => {
    onReady?.()
  }, [onReady])

  return null
}

// Reported from here rather than the hero so that drei — and three — stay out
// of the main bundle on the phones that never render a canvas.
export default function CarStage({ onReady }) {

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [6.6, 1.5, 7.2], fov: 30 }}
    >
      <Suspense fallback={null}>
        <StudioRig />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[6, 8, 4]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
        />
        <spotLight
          position={[-8, 5, 2]}
          angle={0.5}
          penumbra={1}
          intensity={40}
          color="#6ea8ff"
        />

        <CarModel rotation={-0.5} />
        <SignalReady onReady={onReady} />

        {/* The backdrop plate supplies the floor, so all the scene adds is the
            shadow that marries the car to it. */}
        <ContactShadows
          position={[0, 0.002, 0]}
          opacity={0.95}
          scale={11}
          blur={1.8}
          far={2.6}
          resolution={1024}
          color="#000000"
        />

        {/* Drag to orbit. Locked to a narrow arc so the shot never breaks:
            no zoom, no pan, and the camera can't drop below the floor line. */}
        <OrbitControls
          makeDefault
          target={[0, 0.42, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.45}
          minPolarAngle={1.14}
          maxPolarAngle={1.47}
          minAzimuthAngle={0.1}
          maxAzimuthAngle={1.35}
        />
      </Suspense>
    </Canvas>
  )
}
