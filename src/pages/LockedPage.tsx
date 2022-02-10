import React, { Fragment, useEffect, useState, useContext } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import './LoadingStyles.css';
import { MainPageContext } from './MainPage';

export default function LockedPage() {
  const [isLoading, SetIsLoading] = useState(true);
  const {setNavToggle} = useContext(MainPageContext);
  const [loadingPercent, SetLoadingPercent] = useState(0);
  

  useEffect(() => {
    setNavToggle(false);
    window.history.pushState(null, document.title, window.location.href);
    console.log("1");
    //Renderer
    let renderer = new THREE.WebGLRenderer();
    //Loading manager
    console.log("2");
    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {    
      console.log("onProgress");        
      SetLoadingPercent(Math.round(loaded / total * 100));
    };
    manager.onLoad = function(){
      console.log("onLoad");
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.domElement.id = 'canvas';
      SetIsLoading(false);
      setNavToggle(true);
      document!.getElementById("root")!.appendChild( renderer.domElement );
      animate();
    }
    
    //Camera
    console.log("3");
    let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 150, 1300 );
    //Scene
    console.log("4");
    let scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x303030, 1000, 4000 );
    scene.background = new THREE.Color(0x303030);

    //  GROUND
    console.log("5");
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
    console.log("6");
    const light = new THREE.DirectionalLight( 0xffffff, 2.25 );
    light.position.set( 200, 450, 500 );
    light.castShadow = true;
    
    scene.add( light );
    
    
    //OrbitControls, AxesHelpers
    console.log("8");
    const controls = new OrbitControls(camera, renderer.domElement)
    const axesHelper = new THREE.AxesHelper( 100 );
    const gridHelper = new THREE.GridHelper( 100 );
    scene.add( axesHelper, gridHelper );

    //Character
    console.log("7");
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
    
    //Animation
    const clock = new THREE.Clock();
    let animate = function () {
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

    function disposeAll() {
      renderer.dispose();
      camera.remove();
      controls.dispose();
      axesHelper.remove();
      gridHelper.remove();
      ground.remove();
      light.remove();
      gt.dispose();
      gg.dispose();
      gm.dispose();
    }
    
    return () => {
      console.log("9");
      disposeAll();
      while(scene.children.length > 0){
        scene.remove(scene.children[0]); 
      }
      renderer!.domElement.remove();
    }
  }, []);

  return (
    <Fragment>
    {isLoading ? (
      <div className ="loadingPage">
          Please wait...
        <div className="loadingPercentage">
          {loadingPercent}%
        </div>
      </div>):(<div></div>)}
    </Fragment>
  )
}

