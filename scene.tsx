import * as DCL from 'metaverse-api'
import {Vector3Component} from 'metaverse-api'


export type BirdState = null | 'looking' | 'shake';

// This is an interface, you can use it to enforce the types of your state
export interface IState {
  birdPos: Vector3Component[],
  birdState: BirdState[],
}

export default class garden extends DCL.ScriptableScene<any, IState> {
  // This is your initial state and it respects the given IState interface
  state = {
    birdPos: [{x:0, y:1, z:0},{x:1, y:1, z:0}],
    birdState: [null, null],
  }

  sceneDidMount() {
    this.eventSubscriber.on('door_click', () => {
  
    })
   this.updateBird(0);
   this.updateBird(1);
  }

  async updateBird(bird: number=0)
  {
    setInterval(() => {
      this.setState({birdPos: this.newBirdPos(bird)});
      this.setState({birdState: this.newBirdState(bird)});
    }, 4000);
  }


  newBirdPos(bird: number=0)
  {
    let newPos : Vector3Component[] = this.state.birdPos;
    newPos[bird].x = (Math.random() *10 )- 5;
    newPos[bird].z = (Math.random() *10 )- 5;  
    newPos[bird].y = Math.random() *2 + 1;
    
    return newPos;
  }

  newBirdState(bird: number=0)
  {
    let newState : BirdState[] = this.state.birdState;
    const stateNow = Math.random();
    console.log(stateNow);
    if (stateNow < 0.6){ 
      newState[bird] = null 
    } else if (stateNow < 0.8) {
      newState[bird] =  'looking'
    } else {
      newState[bird] =  'shake'
    }
    return newState;
  }

  renderBirds()
  {
    return this.state.birdPos.map( (pos, birdNum) =>  
    <gltf-model
      src="models/hummingbird.gltf"
      scale={0.2}
      position={this.state.birdPos[birdNum]}
      lookAt={this.state.birdPos[birdNum]}
      transition={{ 
        position: { duration: 500, timing: "ease-in-out" }, 
        //lookAt: { duration: 100, timing: "linear" } 
      }}
      skeletalAnimation={
        [
            { clip: "Armature_fly" , loop:true, playing:true },
            { clip: "Armature_look" , playing:
            this.state.birdState[birdNum] == 'looking'?true:false },
            { clip: "Armature_shake" , playing: this.state.birdState[birdNum] == 'shake'}
          ] 
          
      }
    />

  )
  }



  async render() {


    return (
      <scene position={{ x: 5, y: 0, z: 5 }}>
        {this.renderBirds()}

        <gltf-model
          src="models/apple tree.gltf"
          scale={0.25}
          id="tree"
         />
      </scene>
    )
  }
}
