import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import CarModel from '@/components/hero/CarModel'

// Camera marks the scroll travels between: front three-quarter low, head-on,
// round the far flank, then rear three-quarter high. The middle marks keep a
// roughly even radius — a straight run between the first and last would fly
// the camera through the car.
const MARKS = [
  new THREE.Vector3(7.4, 1.15, 6.2),
  new THREE.Vector3(1.0, 1.0, 9.4),
  new THREE.Vector3(-8.4, 1.5, 5.0),
  new THREE.Vector3(-6.8, 2.6, -5.8),
]
const TARGET = new THREE.Vector3(0, 0.55, 0)

function ScrollCamera({ progress }) {
  const current = useRef(new THREE.Vector3().copy(MARKS[0]))

  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1)
    const span = p * (MARKS.length - 1)
    const i = Math.min(MARKS.length - 2, Math.floor(span))
    const wanted = new THREE.Vector3().lerpVectors(MARKS[i], MARKS[i + 1], span - i)

    // Damped, so a flicked scroll wheel glides instead of snapping.
    current.current.lerp(wanted, 1 - Math.pow(0.0015, delta))
    state.camera.position.copy(current.current)
    state.camera.lookAt(TARGET)
  })

  return null
}

// Thin emissive slats racing past the wheels — the only thing in frame that
// says the car is moving rather than parked.
function SpeedStreaks({ count = 26 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const lanes = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: THREE.MathUtils.randFloatSpread(26),
        z: THREE.MathUtils.randFloatSpread(44),
        length: THREE.MathUtils.randFloat(2.5, 7),
        speed: THREE.MathUtils.randFloat(14, 26),
      })),
    [count],
  )

  useFrame((state, delta) => {
    if (!mesh.current) return
    lanes.forEach((lane, i) => {
      lane.z += lane.speed * delta
      if (lane.z > 24) {
        lane.z = -24
        lane.x = THREE.MathUtils.randFloatSpread(26)
      }
      dummy.position.set(lane.x, 0.012, lane.z)
      dummy.scale.set(0.035, 1, lane.length)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#6fa4ff" transparent opacity={0.3} toneMapped={false} />
    </instancedMesh>
  )
}

export default function DriveStage({ progress }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: MARKS[0].toArray(), fov: 34 }}
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={['#05070a', 16, 40]} />

        <Environment resolution={512} frames={1}>
          <color attach="background" args={['#05070a']} />
          <Lightformer
            form="rect"
            intensity={6}
            position={[0, 7, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[20, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={3.6}
            color="#9bc2ff"
            position={[-9, 3, 2]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[14, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={3.6}
            color="#dce8ff"
            position={[9, 3, -2]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[14, 6, 1]}
          />
        </Environment>

        <ambientLight intensity={0.42} />
        <directionalLight
          position={[5, 9, 4]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
        />

        <CarModel rotation={-0.18} length={4.8} idle={false} />
        <SpeedStreaks />

        <ContactShadows
          position={[0, 0.002, 0]}
          opacity={0.92}
          scale={18}
          blur={2.2}
          far={3.5}
          resolution={1024}
          color="#000000"
        />

        <ScrollCamera progress={progress} />
      </Suspense>
    </Canvas>
  )
}
