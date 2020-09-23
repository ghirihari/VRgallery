import React from 'react';
import { Segment } from 'semantic-ui-react';
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

  change(str){
    this.props.data.map((value,index) => {
      if(value.name === str)
      {
        this.props.changeImage(value)
      }
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
  }
  
  render()
    { 
    this.loadLinks();
    return (
      <Segment>
        <a-scene >
            <AssestsLoader data = {this.props.data}/>
            <a-sky id="sky" cursor="rayOrigin: mouse; fuse: false;" src= {'#'+this.props.image.name} /> 
            {this.links}
           <a-camera id="cam1" rotation="0 0 0" cursor="rayOrigin: mouse; fuse: false;"></a-camera> 
        </a-scene>
      </Segment>
    );
    }
}

export default VRViewer;