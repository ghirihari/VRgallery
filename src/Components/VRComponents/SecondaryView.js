import React from 'react';
import { Segment } from 'semantic-ui-react';
import 'aframe';
import 'aframe-look-at-component';
import './AframeComp';

import AssestsLoader from "./AssetsLoader";


class SecondryView extends React.Component {

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
    const AFRAME = window.AFRAME

    // AFRAME.registerComponent('rotation-reader', {
    //   tick: function () {
    //     var x,y;
    //     x = this.el.object3D.rotation.x;
    //     y = this.el.object3D.rotation.y
    //     console.log(this.el.getAttribute('rotation').x);
    //     console.log(this.el.getAttribute('rotation').y);
    //    }
    // });

    // AFRAME.registerComponent('rotation-setter', {
    //   tick: function () {
    //    this.el.setAttribute('rotation', {x: 0, y: 90, z: 30});
    //    }
    // });

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
          <a-scene embedded style={{height: 200 ,width: 400}}>
            <AssestsLoader data = {this.props.data}/>
            <a-sky src= {'#'+this.props.image.name} /> 
            {this.links}
            <a-camera id="cam1" rotation-reader></a-camera>  
          </a-scene>
      </Segment>
    );
    }
}

export default SecondryView;