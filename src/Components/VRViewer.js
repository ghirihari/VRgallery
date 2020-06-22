import React from 'react';
import { Segment } from 'semantic-ui-react'

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
     
      }

    
    render()
    {
      
    // Load Links
    this.links = Object.values(this.props.image.links).map(item => 
      {
        var splitrot=item.position.split(" ");
        var x= parseFloat(splitrot[0]*120);
        var y= parseFloat(splitrot[1]*80);
        var z= parseFloat(splitrot[2]*120);
        console.log(x+" "+"-8"+z)
        
        return(
          <a-image 
            id={item.name}
            src="#hotspot"
            position={x+" "+"-8 "+z}
            scale="10 10"
            look-at='[camera]'>   
          </a-image>
        ) 
        
      })

    // console.log(this.props.image.links);

    return (
      <Segment>
        <a-scene>
            <a-assets>
              {this.assets}
              {this.hotspotIcon}
            </a-assets>
            
            <a-sky src= {'#'+this.props.image.name} />
            {this.links}
{/*             
            <a-image 
              src="#hotspot"
              position="0.8826060510865503 -0.08739164477592737 -0.48291200668298667"
              look-at='[camera]'>   
            </a-image> */}
        </a-scene>
      </Segment>
    );
    }
}
  
  export default VRViewer;
