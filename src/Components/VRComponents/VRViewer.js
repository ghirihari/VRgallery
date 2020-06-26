import React from 'react';
import { Segment } from 'semantic-ui-react'
import 'aframe';
import 'aframe-look-at-component';

import AssestsLoader from "./AssetsLoader";


class VRViewer extends React.Component {

    constructor(props)
    {
      super(props);
      this.state = {
        loaded:false,
        VRMode:false
    };
       
    this.change = this.change.bind(this);
    this.loadLinks = this.loadLinks.bind(this);
   }

  componentDidMount(){
    var _ = this;
    const AFRAME = window.AFRAME;
    const THREE = window.THREE;

    AFRAME.registerComponent('raycaster-listen', {
      init: function () {    
        this.el.addEventListener('raycaster-intersected', evt => {
          this.raycaster = evt.detail.el;
          console.log('Intersected');
        });
        this.el.addEventListener('raycaster-intersected-cleared', evt => {
          this.raycaster = null;
          // console.log('Cleared')
          
        });
      },  
      tick: function () {
        if (!this.raycaster) { return; }  // Not intersecting.
        let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
        if (!intersection) { return; }
        _.change(this.el.id);
      }
    });

    //look-controls
    
var isMobile = AFRAME.utils.device.isMobile();
var bind = AFRAME.utils.bind;

// To avoid recalculation at every mouse movement tick
var PI_2 = Math.PI / 2;
var radToDeg = THREE.Math.radToDeg;

AFRAME.registerComponent('modlook-controls', {
  dependencies: ['position', 'rotation'],

  schema: {
    enabled: {default: true},
    hmdEnabled: {default: true},
    reverseMouseDrag: {default: false},
    gyroEnabled: {default: false},
     touchEnabled: {default: true}
   // standing: {default: true}
  },

  init: function () {
    
    var sceneEl = this.el.sceneEl;

    // Aux variables
    this.previousHMDPosition = new THREE.Vector3();
    this.hmdQuaternion = new THREE.Quaternion();
    this.hmdEuler = new THREE.Euler();

    this.setupMouseControls();
    this.setupHMDControls();
    this.bindMethods();

    // Enable grab cursor class on canvas.
    function enableGrabCursor () { sceneEl.canvas.classList.add('a-grab-cursor'); }
    if (!sceneEl.canvas) {
      sceneEl.addEventListener('render-target-loaded', enableGrabCursor);
    } else {
      enableGrabCursor();
    }

    // Reset previous HMD position when we exit VR.
    sceneEl.addEventListener('exit-vr', this.onExitVR);
  },

  update: function (oldData) {
    var data = this.data;
    var hmdEnabled = data.hmdEnabled;
    if (!data.enabled) { return; }
    if (!hmdEnabled && oldData && hmdEnabled !== oldData.hmdEnabled) {
      this.pitchObject.rotation.set(0, 0, 0);
      this.yawObject.rotation.set(0, 0, 0);
    }
   // this.controls.standing = data.standing;
   // this.controls.update();
    this.updateOrientation();
    this.updatePosition();
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
  },

  tick: function (t) {
    this.update();
    
  },

  remove: function () {
    this.pause();
  },

  bindMethods: function () {
    this.onMouseDown = bind(this.onMouseDown, this);
    this.onMouseMove = bind(this.onMouseMove, this);
    this.releaseMouse = bind(this.releaseMouse, this);
    this.onTouchStart = bind(this.onTouchStart, this);
    this.onTouchMove = bind(this.onTouchMove, this);
    this.onTouchEnd = bind(this.onTouchEnd, this);
    this.onExitVR = bind(this.onExitVR, this);
  },

  setupMouseControls: function () {
    // The canvas where the scene is painted
    this.mouseDown = false;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);
  },

  setupHMDControls: function () {
    this.dolly = new THREE.Object3D();
    this.euler = new THREE.Euler();
    //this.controls = new THREE.VRControls(this.dolly);
   // this.controls.userHeight = 0.0;
  },

  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    // listen for canvas to load.
    if (!canvasEl) {
      sceneEl.addEventListener('render-target-loaded', bind(this.addEventListeners, this));
      return;
    }

    // Mouse Events
    canvasEl.addEventListener('mousedown', this.onMouseDown, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('mouseup', this.releaseMouse, false);

    // Touch events
    canvasEl.addEventListener('touchstart', this.onTouchStart);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);
  },

  removeEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;
    if (!canvasEl) { return; }

    // Mouse Events
    canvasEl.removeEventListener('mousedown', this.onMouseDown);
    canvasEl.removeEventListener('mousemove', this.onMouseMove);
    canvasEl.removeEventListener('mouseup', this.releaseMouse);
    canvasEl.removeEventListener('mouseout', this.releaseMouse);

    // Touch events
    canvasEl.removeEventListener('touchstart', this.onTouchStart);
    canvasEl.removeEventListener('touchmove', this.onTouchMove);
    canvasEl.removeEventListener('touchend', this.onTouchEnd);
  },

  updateOrientation: function () {
    
    var currentRotation;
    var deltaRotation;
    var hmdEuler = this.hmdEuler;
    var pitchObject = this.pitchObject;
    var yawObject = this.yawObject;
    var hmdQuaternion = this.calculateHMDQuaternion();
    var sceneEl = this.el.sceneEl;
    var rotation;
    hmdEuler.setFromQuaternion(hmdQuaternion, 'YXZ');

    if (isMobile) {
      // In mobile we allow camera rotation with touch events and sensors
      if (this.data.gyroEnabled) {
        pitchObject.rotation.x = 0;
        rotation = {
          x: radToDeg(hmdEuler.x) + radToDeg(pitchObject.rotation.x),
          y: radToDeg(hmdEuler.y) + radToDeg(yawObject.rotation.y),
          z: radToDeg(hmdEuler.z)
        };
      } else {
        rotation = {
          x: radToDeg(pitchObject.rotation.x),
          y: radToDeg(yawObject.rotation.y)
        };
      }
    } else if (!sceneEl.is('vr-mode') || isNullVector(hmdEuler) || !this.data.hmdEnabled) {
      currentRotation = this.el.getAttribute('rotation');
      deltaRotation = this.calculateDeltaRotation();
      // Mouse look only if HMD disabled or no info coming from the sensors
      if (this.data.reverseMouseDrag) {
        rotation = {
          x: currentRotation.x - deltaRotation.x,
          y: currentRotation.y - deltaRotation.y,
          z: currentRotation.z
        };
      } else {
        rotation = {
          x: currentRotation.x + deltaRotation.x,
          y: currentRotation.y + deltaRotation.y,
          z: currentRotation.z
        };
      }
    } else {
      // Mouse rotation ignored with an active headset.
      // The user head rotation takes priority
      rotation = {
        x: radToDeg(hmdEuler.x),
        y: radToDeg(hmdEuler.y),
        z: radToDeg(hmdEuler.z)
      };
    }
    this.el.setAttribute('rotation', rotation);
  },

  calculateDeltaRotation: function () {
    var currentRotationX = radToDeg(this.pitchObject.rotation.x);
    var currentRotationY = radToDeg(this.yawObject.rotation.y);
    var deltaRotation;
    this.previousRotationX = this.previousRotationX || currentRotationX;
    this.previousRotationY = this.previousRotationY || currentRotationY;
    deltaRotation = {
      x: currentRotationX - this.previousRotationX,
      y: currentRotationY - this.previousRotationY
    };
    this.previousRotationX = currentRotationX;
    this.previousRotationY = currentRotationY;
    return deltaRotation;
  },

  calculateHMDQuaternion: function () {
    var hmdQuaternion = this.hmdQuaternion;
    hmdQuaternion.copy(this.dolly.quaternion);
    return hmdQuaternion;
  },

  updatePosition: (function () {
    var deltaHMDPosition = new THREE.Vector3();
    return function () {
      var el = this.el;
      var currentPosition = el.getAttribute('position');
      var currentHMDPosition;
      var previousHMDPosition = this.previousHMDPosition;
      var sceneEl = this.el.sceneEl;
      currentHMDPosition = this.calculateHMDPosition();
      deltaHMDPosition.copy(currentHMDPosition).sub(previousHMDPosition);
      if (!sceneEl.is('vr-mode') || isNullVector(deltaHMDPosition)) { return; }
      previousHMDPosition.copy(currentHMDPosition);
      // Do nothing if we have not moved.
      if (!sceneEl.is('vr-mode')) { return; }
      el.setAttribute('position', {
        x: currentPosition.x + deltaHMDPosition.x,
        y: currentPosition.y + deltaHMDPosition.y,
        z: currentPosition.z + deltaHMDPosition.z
      });
    };
  })(),

  calculateHMDPosition: function () {
    var dolly = this.dolly;
    var position = new THREE.Vector3();
    dolly.updateMatrix();
    position.setFromMatrixPosition(dolly.matrix);
    return position;
  },

  onMouseMove: function (event) {
    var pitchObject = this.pitchObject;
    var yawObject = this.yawObject;
    var previousMouseEvent = this.previousMouseEvent;

    if (!this.mouseDown || !this.data.enabled) { return; }

    var movementX = event.movementX || event.mozMovementX;
    var movementY = event.movementY || event.mozMovementY;

    if (movementX === undefined || movementY === undefined) {
      movementX = event.screenX - previousMouseEvent.screenX;
      movementY = event.screenY - previousMouseEvent.screenY;
    }
    this.previousMouseEvent = event;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;
    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
  },

  onMouseDown: function (event) {
    this.mouseDown = true;
    this.previousMouseEvent = event;
    document.body.classList.add('a-grabbing');
  },

  releaseMouse: function () {
    this.mouseDown = false;
    document.body.classList.remove('a-grabbing');
  },

  onTouchStart: function (e) {
    if (e.touches.length !== 1) { return; }
    this.touchStart = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    };
    this.touchStarted = true;
  },

  onTouchMove: function (e) {
    var deltaY, deltaX;
    var yawObject = this.yawObject;
    var pitchObject = this.pitchObject;
    if (!this.touchStarted) { return; }
    deltaY = 2 * Math.PI * (e.touches[0].pageX - this.touchStart.x) /
            this.el.sceneEl.canvas.clientWidth;
    if (!this.data.gyroEnabled) {
      deltaX = 2 * Math.PI * (e.touches[0].pageY - this.touchStart.y) /
        this.el.sceneEl.canvas.clientHeight;
    }
    // Limits touch orientaion to to yaw (y axis)
    yawObject.rotation.y -= deltaY * 0.5;
    pitchObject.rotation.x -= deltaY * 0.002;
    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
    if (!this.data.gyroEnabled) pitchObject.rotation.x -= deltaX * 0.5;
    this.touchStart = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    };
  },

  onTouchEnd: function () {
    this.touchStarted = false;
  },

  onExitVR: function () {
    this.previousHMDPosition.set(0, 0, 0);
  }
});

function isNullVector (vector) {
  return vector.x === 0 && vector.y === 0 && vector.z === 0;
}
  }

  change(str){
    this.props.data.map((value,index) => {
      if(value.name === str)
      {this.props.changeImage(value)}
    });
  }

  loadLinks()
  {
    this.links = Object.values(this.props.image.links).map(item => 
    {
      var splitrot=item.position.split(" ");
      var x= parseFloat(splitrot[0]*120);
      // var y= parseFloat(splitrot[1]*80);
      var z= parseFloat(splitrot[2]*120);
      
      return(
        <a-image
          id={item.name} key={item.name} src="#hotspot"
          position={x+" -8 "+z} scale="10 10"
          class="hotspot"
          look-at='#cam1' 
          onClick={(e) => this.change(e.target.id)}
          raycaster-listen
         >
        </a-image>
      ) 
    })
    // console.log(this.links);
  }
  
  render()
    { 
    this.loadLinks();
    return (
      <Segment>
        <a-scene >
            {/* Loads Assets */}
            <AssestsLoader data = {this.props.data}/>
            <a-sky src= {'#'+this.props.image.name} /> 
            {/* Loads Hotspots */}
            {this.links}
            {/* Loads Mouse */}
            {/* <a-entity id="cam1" camera cursor="rayOrigin: mouse; fuse: false;"></a-entity> */}
           
            {/* Loads Cursor */}
            <a-camera id="cam1" modlook-controls>
              {/* <a-entity cursor="rayOrigin: mouse;" raycaster="interval:5000;"></a-entity> */}
              <a-cursor  raycaster="interval: 3000; objects:.hotspot"></a-cursor>
            </a-camera>
        </a-scene>
      </Segment>
    );
    }
}
  
  export default VRViewer;



//cursor

{/* <a-camera id="cam1" look-controls="gyroEnabled: false;" >
  <a-cursor></a-cursor>
</a-camera> */}
{/* <a-entity id="cam1" camera cursor="rayOrigin: mouse"></a-entity> */}
         