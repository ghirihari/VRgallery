import React from 'react';

function AssetsLoader(props){
  
    // Load Assets        
    let assets = props.data.map((value,index) => {
    return(
        <img crossOrigin="anonymous" id={value.name} src={value.url} alt={value.name} key={index}/>
    )});
    
    // Load Hotspot Icon
    let hotspotIcon = <img 
        id="hotspot" 
        crossOrigin="anonymous"
        src="https://cdn.glitch.com/a04a26d3-92af-4a88-9d49-8fcc2c5344a5%2Fhotspots.png?v=1562761623319"
        alt="Hotspot"/>
    
    return(
        <a-assets>
            {assets}
            {hotspotIcon}
        </a-assets>
    )
    }

export default AssetsLoader;
