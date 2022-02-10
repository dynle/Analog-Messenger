import React, { Fragment, useEffect, useState, useContext } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import './LoadingStyles.css';
import { MainPageContext } from './MainPage';
import { useHistory } from "react-router-dom";

export default function LockedPage() {
  const history = useHistory();
  const [isLoading, SetIsLoading] = useState(true);
  const {setNavToggle} = useContext(MainPageContext);
  const [loadingPercent, SetLoadingPercent] = useState(0);

  useEffect(() => {
    setNavToggle(false);
    //Renderer
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.id = 'canvas';
    //Loading manager
    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {            
      console.log(item, loaded, total);
      console.log('Loaded:', Math.round(loaded / total * 100) + '%')
      SetLoadingPercent(Math.round(loaded / total * 100));
      // bar.animate(1.0);
    };
    manager.onLoad = function(){
      SetIsLoading(false);
      setNavToggle(true);
      document!.getElementById("root")!.appendChild( renderer.domElement );
    }
    
    //Camera
    let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 150, 1300 );
    //Scene
    let scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x303030, 1000, 4000 );
    scene.background = new THREE.Color(0x303030);

    //  GROUND
    const gt = new THREE.TextureLoader().load( "grasslight-big.jpeg" );
    const gg = new THREE.PlaneGeometry( 16000, 16000 );
    const gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

    const ground = new THREE.Mesh( gg, gm );
    ground.rotation.x = - Math.PI / 2;
    ground.material.map!.repeat.set( 64, 64 );
    ground.material.map!.wrapS = THREE.RepeatWrapping;
    ground.material.map!.wrapT = THREE.RepeatWrapping;
    ground.material.map!.encoding = THREE.sRGBEncoding;
    ground.receiveShadow = true;
    scene.add( ground );

    //Light
    const light = new THREE.DirectionalLight( 0xffffff, 2.25 );
    light.position.set( 200, 450, 500 );
    light.castShadow = true;

    scene.add( light );
    
    //Character
    let modelReady = false;
    let mixer: any;
    let loader = new FBXLoader(manager);
    loader.load('running.fbx',
    (ani) => {
      mixer = new THREE.AnimationMixer( ani );
      scene.add(ani);
      let animationAction = mixer.clipAction( ani.animations[0] )          
      modelReady = true;
      animationAction.fadeIn(1);
      animationAction.play();
    },);
    
    //OrbitControls, AxesHelpers
    const controls = new OrbitControls(camera, renderer.domElement)
    const axesHelper = new THREE.AxesHelper( 100 );
    const gridHelper = new THREE.GridHelper( 100 );
    scene.add( axesHelper, gridHelper );
    
    //Animation
    const clock = new THREE.Clock();
    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      if (modelReady) {
        mixer.update(clock.getDelta());
      }
      render();
    };
    function render() {
        renderer.render(scene, camera);
    }
    animate();

    return () => {
      while(scene.children.length > 0){
        scene.remove(scene.children[0]); 
      }
      let canvas = document!.getElementById("canvas");
      let root = document!.getElementById("root");
      renderer!.domElement.remove();
      root!.removeChild( renderer.domElement );
    }
  }, []);

  return (
    <Fragment>
    {isLoading ? (
      <div className ="loadingPage">
          Loading...
        <div className="loadingPercentage">
          {loadingPercent}%
        </div>
      </div>):(<div></div>)}
    </Fragment>
  )
}

