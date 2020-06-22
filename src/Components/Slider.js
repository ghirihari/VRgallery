import React from 'react';
import { Menu } from 'semantic-ui-react'

import '../Styles/Slider.css';

class Slider extends React.Component {
  
    render()
    {
        return(
            <div>
                {this.props.images.map((value,index) => {
                    return(
                    <Menu.Item as='a' onClick={() => this.props.changeImage(value)} key={index}>
                    <div className="thumbnail">
                        <img src={value.thumbnail} alt={value.name} className="thumbnailImg"/>
                    <div className="centered">{value.name.toUpperCase()}</div>
                    </div>
                    </Menu.Item>
                    );
                })}
            </div>
        );
        
          
    }
}

export default Slider;
