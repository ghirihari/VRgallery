import React from 'react'

import { Menu, Segment, Sidebar } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faExpandAlt,faInfo } from '@fortawesome/free-solid-svg-icons'

import VRViewer from './VRComponents/VRViewer'
import SecondaryView from './VRComponents/SecondaryView'; 
import Slider from './Slider'
import '../Styles/Home.css';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            VrMode: false,
            info:false,
            current_image: {
                    "info" : {
                        "About Innov8" : {
                            "Description" : "Innov8 Coworking offers beautifully crafted workspaces where people can create, connect, and grow their businesses at prime locations in multiple cities pan-India. Innov8 hosts people from diverse backgrounds such as digital nomads, entrepreneurs, freelancers, corporates employees and startup enthusiasts.",
                            "buyurl" : "",
                            "info3diosurl" : "",
                            "info3durl" : "",
                            "infoimgurl" : "",
                            "knowurl" : "",
                            "position" : "-0.8980867539712181 0.00034748211845683774 0.4203239232941025",
                            "vidurl" : "https://www.youtube.com/embed/0UA80LzjJh0"
                            }
                    },
                    "links" : {
                        "theatere" : {
                        "name" : "Theatre",
                        "dest-image" : "https://firebasestorage.googleapis.com/v0/b/realvr-eb62c.appspot.com/o/iHwPWJvWDQYW6ilIAfNfgupytcb2%2FInnov8%2F1579863181062-20200124_161208_885.jpg?alt=media&token=dc168d99-2e45-4758-b0fb-c41b356eb675",
                        "dest-thumb" : "https://firebasestorage.googleapis.com/v0/b/realvr-eb62c.appspot.com/o/iHwPWJvWDQYW6ilIAfNfgupytcb2%2FInnov8%2Fthumbs%2F1579863191216-20200124_161208_885.jpg?alt=media&token=bbffb628-3d4e-4369-8571-a0af07abb52b",
                        "position" : "0.8826060510846503 -0.08739164477592737 -0.48291200668298667"
                    }
                },
                    "name" : "Entrance",
                    "thumbnail" : "https://firebasestorage.googleapis.com/v0/b/realvr-eb62c.appspot.com/o/iHwPWJvWDQYW6ilIAfNfgupytcb2%2FInnov8%2Fthumbs%2F1579863216723-20200124_161250_786.jpg?alt=media&token=95e7d027-8490-4cf5-9679-0d5b7404ce14",
                    "url" : "https://firebasestorage.googleapis.com/v0/b/realvr-eb62c.appspot.com/o/iHwPWJvWDQYW6ilIAfNfgupytcb2%2FInnov8%2F1579863210017-20200124_161250_786.jpg?alt=media&token=3311ca91-4238-4b73-b75a-dfc37fdc6d24"
                    }
        }
        
        this.data = require('../Data/data.json');
        this.images = Object.values(this.data.images);   
        this.sideBarToggle = this.sideBarToggle.bind(this);
        this.hideSideBar = this.hideSideBar.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.info = this.info.bind(this);
        // this.VrModeToggle = this.VrModeToggle.bind(this);

    }


    sideBarToggle() {
        this.setState(state => ({visible: !state.visible}));
        // console.log('Toggled')
    }

    FullscreenToggle = () => {
        var doc = window.document;
        var docEl = doc.documentElement;
      
        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
      
        if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
          requestFullScreen.call(docEl);
        }
        else {
          cancelFullScreen.call(doc);
        }
    }

    info = () => {
        this.setState(
            state => ({info: !state.info})
        ,() => {
            if(this.state.info)
            {
                document.getElementById('info').className ='infoVisible';
            }else{
                document.getElementById('info').className ='info';
            }
        });
        
        }

    hideSideBar() {
        if(this.state.visible){
            this.setState({visible: false});
            // console.log('Hided');
        }
    }

    changeImage(str){
        // console.log(str);
        this.setState({current_image:str})
        this.hideSideBar();
    }

    
    render()
    {

    return (
        <div style={{height: '100vh'}} >
            
            <Sidebar.Pushable as={Segment}>
                <Sidebar as={Menu} animation='overlay'icon='labeled' inverted direction='right' vertical visible={this.state.visible}> 
                    {/* SLIDER COMPONENT */}
                    <Slider changeImage={this.changeImage.bind(this)} images = {this.images}/>
                </Sidebar>

                <Sidebar.Pusher onClick={this.hideSideBar}>
                    {/* 360 IMAGE COMPONENT */}
                    <VRViewer 
                        data={this.images} 
                        image={this.state.current_image}
                        changeImage={this.changeImage.bind(this)}
                    />
                </Sidebar.Pusher>
            </Sidebar.Pushable>

            {/* SIDEBAR TOGGLER */}
            {!this.state.visible &&
            <div className="top-right btn" onClick={this.sideBarToggle}>
                <FontAwesomeIcon icon={faBars} color="white" size="2x"/>
            </div>
            }

            {/* IMAGE LABEL */}
            <div className="top-left label">
                {this.state.current_image.name}
            </div>

            <div id="info" className="info">
                <img className="image" alt="info" src="https://cdn.glitch.com/a04a26d3-92af-4a88-9d49-8fcc2c5344a5%2Fclick.png?v=1570097488868"/>
                <p>Click to Jump</p>
            </div>


            {!this.state.visible &&
            <div className="bottom-right" >
                <div className="bottom-icons" onClick={this.info}>
                    <FontAwesomeIcon icon={faInfo} color="white" size="2x"/>
                </div>
                <div className="bottom-icons" onClick={this.FullscreenToggle}>
                    <FontAwesomeIcon icon={faExpandAlt} color="white" size="2x"/>
                </div>
            </div>
            }

        </div>
    )
    }
}

export default Home