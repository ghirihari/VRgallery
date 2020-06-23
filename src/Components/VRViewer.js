import React from 'react';
import { Segment } from 'semantic-ui-react'
import 'aframe';
import 'aframe-look-at-component';
import 'aframe-mouse-cursor-component';


class VRViewer extends React.Component {

    constructor(props)
    {
      super(props);
      this.state = {
        loaded:false
    };

    // Load Assets
    this.assets = this.props.data.map((value,index) => {
        return(
          <img crossOrigin="anonymous" id={value.name} src={value.url} alt={value.name} key={index}/>
        )})

    this.hotspotIcon = <img 
        id="hotspot" 
        crossOrigin="anonymous"
        src="https://cdn.glitch.com/a04a26d3-92af-4a88-9d49-8fcc2c5344a5%2Fhotspots.png?v=1562761623319"
        alt="Hotspot"/>
      
        this.change = this.change.bind(this);
    
  }

  change(str){
    // console.log(str);
    this.props.data.map((value,index) => {
      if(value.name === str)
      {
        // console.log('Found');
        this.props.changeImage(value)
      }
    });
  }

    

    // componentDidMount() {
    //   var link = document.querySelector("a-image")
    //   link.addEventListener("click",function(event)
    //   {
    //     console.log((event.target.id))
    //   })
    //   this.props.changeImage(change);
    // }

    
    render()
    {
      
    // Load Links
    this.links = Object.values(this.props.image.links).map(item => 
      {
        var splitrot=item.position.split(" ");
        var x= parseFloat(splitrot[0]*120);
        // var y= parseFloat(splitrot[1]*80);
        var z= parseFloat(splitrot[2]*120);
        // console.log(x+" "+"-8"+z)
        var pos = x+" -8 "+z

        // console.log(item)
        return(
          <a-image
            id={item.name}
            key={item.name}
            src="#hotspot"
            position={pos}
            scale="10 10"
            look-at='#cam1'
            onClick={(e) => this.change(e.target.id)}
            >
          </a-image>
        ) 
        
      })

    // console.log(this.props.image.links);

    return (
      <Segment>
        <a-scene loading-screen="dotsColor: white; backgroundColor: black">
            <a-assets>
              {this.assets}
              {this.hotspotIcon}
            </a-assets>
            
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
