import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
    apiKey: 'e43bee2e24e44c6489097fa76e1c58ac'
   });

const particlesOptions = {
    "particles": {
        "number": {
            "value": 30,
            "density": {
                "enable": true,
                "value-area": 800
            }
        }
    }
}

class App extends Component {
    /* Need state so App knows value user enters in ImageLinkForm, remembers it, updates */
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: ''
        }
    }

    /* Anytime there's an event listener, we receive "event" */
    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });

        app.models.predict(
            Clarifai.FACE_DETECT_MODEL, 
            this.state.input).then(
            function (response) {
                console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
            },
            function (err) {

            }
        );
    }

    render() {
        return (
            <div className="App">
                <Particles 
                    className="particles" 
                    params={particlesOptions} />
            <Navigation />
            <Logo />
            <Rank />
            {/* onInputChange passed as prop. B/c its part of this class, need to use "this" to access bc onInputChange is property of App */}
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={this.state.imageUrl}/>
            </div>
        );
    }
}

export default App;
