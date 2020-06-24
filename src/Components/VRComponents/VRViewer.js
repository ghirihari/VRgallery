import React from 'react';
import { Segment } from 'semantic-ui-react'
import 'aframe';
import 'aframe-look-at-component';
// import 'aframe-mouse-cursor-component';

import AssestsLoader from "./AssetsLoader";


class VRViewer extends React.Component {

    constructor(props)
    {
      super(props);
      this.state = {
        loaded:false
    };
       
    this.change = this.change.bind(this);
    this.loadLinks = this.loadLinks.bind(this);
    
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
          look-at='#cam1' onClick={(e) => this.change(e.target.id)}
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
        <a-scene loading-screen="dotsColor: white; backgroundColor: black">
            <AssestsLoader data = {this.props.data}/>
            <a-sky src= {'#'+this.props.image.name} />
            {this.links}
            <a-camera id="cam1" mouse-cursor>
              <a-cursor></a-cursor>
            </a-camera>
        </a-scene>
      </Segment>
    );
    }
}
  
  export default VRViewer;
