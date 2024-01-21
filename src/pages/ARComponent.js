import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

const ARComponent = () => {
  const logo = useLoader(GLTFLoader, '/TapQuest_Logo.glb');

  return <primitive object={logo.scene} />;
};

export default ARComponent;


