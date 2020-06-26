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

  // componentDidMount(){
  //   var _ = this;
  //   const AFRAME = window.AFRAME;

  //   AFRAME.registerComponent('raycaster-listen', {
  //     init: function () {    
  //       this.el.addEventListener('raycaster-intersected', evt => {
  //         this.raycaster = evt.detail.el;
  //         console.log('Intersected');
  //       });
  //       this.el.addEventListener('raycaster-intersected-cleared', evt => {
  //         this.raycaster = null;
  //         // console.log('Cleared')
          
  //       });
  //     },  
  //     tick: function () {
  //       if (!this.raycaster) { return; }  // Not intersecting.
  //       let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
  //       if (!intersection) { return; }
  //       _.change(this.el.id);
  //     }
  //   });
  // }

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
            <a-entity id="cam1" camera cursor="rayOrigin: mouse; fuse: false;"></a-entity>
           
        </a-scene>
      </Segment>
    );
    }
}

export default VRViewer;