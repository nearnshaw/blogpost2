import * as DCL from 'metaverse-api'
import {Vector3Component} from 'metaverse-api'


export type BirdState = null | 'looking' | 'shake';

// This is an interface, you can use it to enforce the types of your state
export interface IState {
  birdPos: Vector3Component,
  birdState: BirdState,
}

export default class garden extends DCL.ScriptableScene<any, IState> {
  // This is your initial state and it respects the given IState interface
  state = {
    birdPos: {x:0, y:1, z:0},
    birdState: null,
  }

  sceneDidMount() {
    this.eventSubscriber.on('door_click', () => {
  
    })
    setInterval(() => {
      this.setState({birdPos: this.newBirdPos()});
      this.setState({birdState: this.newBirdState()});
    }, 4000);
  }

  newBirdPos()
  {
    const xPos = (Math.random() *10 )- 5;
    const zPos = (Math.random() *10 )- 5;  
    const yPos = Math.random() *2 + 1;
    return {x:xPos , y:yPos, z:zPos};
  }

  newBirdState()
  {
    const stateNow = Math.random();
    console.log(stateNow);
    if (stateNow < 0.6){ 
      return null 
    } else if (stateNow < 0.8) {
      return 'looking'
    } else {
      return 'shake'
    }
  }

  async render() {


    return (
      <scene position={{ x: 5, y: 0, z: 5 }}>
        <gltf-model
          src="models/hummingbird.gltf"
          scale={0.2}
          position={this.state.birdPos}
          lookAt={this.state.birdPos}
          transition={{ 
            position: { duration: 500, timing: "ease-in-out" }, 
            //lookAt: { duration: 100, timing: "linear" } 
        }}
          skeletalAnimation={
            this.state.birdState == 'looking'
            ?[
                { clip: "Armature_fly" , playing: true, loop:true },
                { clip: "Armature_look" , playing: true, loop:true },
                { clip: "Armature_shake" , playing: false, loop:false }
              ]
              :this.state.birdState == 'shake'
              ?[
                { clip: "Armature_fly" , playing: true, loop:true },
                { clip: "Armature_look" , playing: false },
                { clip: "Armature_shake" , playing: true, loop:true}
              ]
             :[
                { clip: "Armature_fly" , playing: true, loop:true },
                { clip: "Armature_look" , playing: false },
                { clip: "Armature_shake" , playing: false}
              ]
          }
         />

     
      </scene>
    )
  }
}
