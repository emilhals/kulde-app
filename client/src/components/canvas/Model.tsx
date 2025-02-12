import { useState, useEffect, useRef } from 'react'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MeshStandardMaterial, Box3 } from 'three';
import { useThree, useLoader } from '@react-three/fiber';

const Model = ({ item }) => {
  const [obj, setObj] = useState()
  const modelRef = useRef()
  const { scene } = useThree()
  const camera = useThree((state) => state.camera)

  useEffect(() => {
    if (!item!) return

    const loader = new OBJLoader()
    loader.load('http://localhost:8000/static/' + item.file_name, (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.material = new MeshStandardMaterial({ color: item.color, metalness: 1, roughness: 0 })
        }
      })
      setObj(object)

      let bbox = new Box3().setFromObject(object)
      console.log(camera)
      camera.lookAt(bbox.max)

    })

  }, [item])

  return obj ? <primitive ref={modelRef} object={obj} /> : null
}

export default Model
