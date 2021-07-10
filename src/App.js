import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
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
            imageUrl: '',
            box: {},
            route: 'signIn',
            isSignedIn: false
        }
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        // Want to return object which will fill up box state
        // Need to figure out top left, top right, bottom right, bottom left dots
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox = (box) => {
        this.setState({box: box});  // can do ({box}) with ES6
        console.log(box);
    }

    /* Anytime there's an event listener, we receive "event" */
    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });

        app.models.predict(
            Clarifai.FACE_DETECT_MODEL, 
            this.state.input)
            // Must use this. bc using classes here
            // calculateFaceLocation takes response and returns box object
            // That object is now going into displayFaceBox
            .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
            .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
        if (route === 'signOut') {
            this.setState({ isSignedIn: false })
        } else if (route === 'home') {
            this.setState({ isSignedIn: true })
        }
        this.setState({route: route});
    }

    render() {
        return (
            <div className="App">
                <Particles 
                    className="particles" 
                    params={particlesOptions} />
            <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
            { this.state.route === 'home'
                ? <div>
                    <Logo />
                    <Rank />
                    {/* onInputChange passed as prop. B/c its part of this class, need to use "this" to access bc onInputChange is property of App */}
                    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                    <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
                </div>
                : (
                    this.state.route === 'signIn' 
                    ? <SignIn onRouteChange={this.onRouteChange} />
                    : <Register onRouteChange={this.onRouteChange} />
                )
                     
            }
            </div>
        );
    }
}

export default App;
