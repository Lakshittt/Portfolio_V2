import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// String segment component for physics simulation
function StringSegment({
  position,
  index,
  totalSegments,
  cardPosition,
}: {
  position: THREE.Vector3;
  index: number;
  totalSegments: number;
  cardPosition: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [segmentPosition, setSegmentPosition] = useState(position);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Physics simulation for string segments
    const gravity = new THREE.Vector3(0, -0.002, 0);
    const damping = 0.98;

    // Calculate constraint forces
    const constraintForce = new THREE.Vector3();

    if (index === 0) {
      // First segment attached to anchor point
      const anchorPoint = new THREE.Vector3(0, 5, 0);
      constraintForce
        .subVectors(anchorPoint, segmentPosition)
        .multiplyScalar(0.1);
    } else if (index === totalSegments - 1) {
      // Last segment attached to card
      constraintForce
        .subVectors(cardPosition, segmentPosition)
        .multiplyScalar(0.08);
    }

    // Apply forces
    const newPosition = segmentPosition.clone();
    newPosition.add(gravity);
    newPosition.add(constraintForce);
    newPosition.multiplyScalar(damping);

    setSegmentPosition(newPosition);
    meshRef.current.position.copy(newPosition);
  });

  return (
    <mesh ref={meshRef} position={segmentPosition}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshPhongMaterial
        color={`hsl(${getComputedStyle(
          document.documentElement
        ).getPropertyValue("--string-color")})`}
      />
    </mesh>
  );
}

// String rope component
function StringRope({ cardPosition }: { cardPosition: THREE.Vector3 }) {
  const stringSegments = 25;
  const segments = [];

  for (let i = 0; i < stringSegments; i++) {
    const y = 5 - (i / stringSegments) * 4;
    const position = new THREE.Vector3(0, y, 0);

    segments.push(
      <StringSegment
        key={i}
        position={position}
        index={i}
        totalSegments={stringSegments}
        cardPosition={cardPosition}
      />
    );
  }

  return <group>{segments}</group>;
}

// ID Card component
function IDCard() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cardPosition, setCardPosition] = useState(new THREE.Vector3(0, 1, 0));
  const { camera, gl } = useThree();

  useFrame((state) => {
    if (!meshRef.current || isDragging) return;

    // Gentle swaying motion when not being dragged
    const time = state.clock.getElapsedTime();
    const sway = Math.sin(time * 0.5) * 0.1;
    meshRef.current.rotation.z = sway;
    meshRef.current.position.x = sway * 0.3;
  });

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = "grabbing";
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = "grab";
  };

  const handlePointerMove = (event: any) => {
    if (!isDragging || !meshRef.current) return;

    event.stopPropagation();

    // Convert screen coordinates to 3D world coordinates
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Project mouse position onto a plane at the card's Z position
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    if (intersection) {
      // Limit movement range
      intersection.x = Math.max(-3, Math.min(3, intersection.x));
      intersection.y = Math.max(-2, Math.min(3, intersection.y));

      meshRef.current.position.copy(intersection);
      setCardPosition(intersection);
    }
  };

  useEffect(() => {
    const handleGlobalPointerMove = (event: PointerEvent) => {
      handlePointerMove(event);
    };

    const handleGlobalPointerUp = () => {
      handlePointerUp();
    };

    if (isDragging) {
      window.addEventListener("pointermove", handleGlobalPointerMove);
      window.addEventListener("pointerup", handleGlobalPointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [isDragging]);

  return (
    <group>
      {/* Metal ring at the top */}
      <mesh position={[0, 5, 0]}>
        <torusGeometry args={[0.15, 0.03, 8, 16]} />
        <meshPhongMaterial
          color={`hsl(${getComputedStyle(
            document.documentElement
          ).getPropertyValue("--metal-ring")})`}
        />
      </mesh>

      {/* String rope */}
      <StringRope cardPosition={cardPosition} />

      {/* ID Card */}
      <mesh
        ref={meshRef}
        position={cardPosition}
        onPointerDown={handlePointerDown}
        onPointerEnter={() => (gl.domElement.style.cursor = "grab")}
        onPointerLeave={() => (gl.domElement.style.cursor = "default")}
      >
        {/* Card geometry */}
        <boxGeometry args={[1.2, 1.8, 0.05]} />
        <meshPhongMaterial
          color={`hsl(${getComputedStyle(
            document.documentElement
          ).getPropertyValue("--card-surface")})`}
        />

        {/* Card back */}
        <mesh position={[0, 0, -0.025]}>
          <boxGeometry args={[1.19, 1.79, 0.001]} />
          <meshPhongMaterial
            color={`hsl(${getComputedStyle(
              document.documentElement
            ).getPropertyValue("--card-back")})`}
          />
        </mesh>

        {/* Card content overlay */}
        <Html
          transform
          occlude
          position={[0, 0, 0.026]}
          style={{
            width: "120px",
            height: "180px",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="w-full h-full bg-white rounded-sm p-2 flex flex-col items-center justify-center text-xs shadow-lg">
            <div className="w-12 h-12 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
              👤
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-800">ID CARD</div>
              <div className="text-gray-600 mt-1">Employee</div>
              <div className="w-full h-px bg-gray-300 my-2"></div>
              <div className="text-gray-500 text-xs">
                <div>Name: John Doe</div>
                <div>ID: #12345</div>
              </div>
            </div>
          </div>
        </Html>
      </mesh>
    </group>
  );
}

// Main 3D Scene component
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight
        intensity={0.4}
        color={`hsl(${getComputedStyle(
          document.documentElement
        ).getPropertyValue("--scene-ambient")})`}
      />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[-5, 5, 5]} intensity={0.3} color="#ffffff" />

      {/* ID Card with string */}
      <IDCard />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// Main component
export default function InteractiveCard3D() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-700">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{
          background: `hsl(${getComputedStyle(
            document.documentElement
          ).getPropertyValue("--scene-bg")})`,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
