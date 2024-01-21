import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

const ARComponent = () => {
  const gltf = useLoader(GLTFLoader, '/TapQuest_Logo.glb');

  return (
    <group>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default ARComponent;
