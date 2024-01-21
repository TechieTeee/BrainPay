import { useEffect } from 'react';

const ARComponent = () => {
  useEffect(() => {
    const initAR = () => {
      const arScene = document.querySelector('ar-scene');
      const aEntity = document.createElement('a-entity');
      aEntity.setAttribute('geometry', 'primitive: box');
      aEntity.setAttribute('animation', 'property: rotation; to: 0 360 0; dur: 5000; easing: linear; loop: true');
      arScene.appendChild(aEntity);
    };

    initAR();
  }, []);

  return (
    <ar-scene>
      {/* Additional AR components */}
    </ar-scene>
  );
};

export default ARComponent;
