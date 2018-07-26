import * as DCL from 'metaverse-api'
import {Vector3Component} from 'metaverse-api'


export type BirdState = null | 'looking' | 'shake';

// This is an interface, you can use it to enforce the types of your state
export interface IState {
  birdPos: Vector3Component[],
  birdState: BirdState[],
  treePulse: Boolean,
}

export default class garden extends DCL.ScriptableScene<any, IState> {
  // This is your initial state and it respects the given IState interface
  state = {
    birdPos: [{x:0, y:1.5, z:3},],
    birdState: [null,],
    treePulse: false,
  }

  sceneDidMount() {
    this.eventSubscriber.on('tree_click', () => {
      this.createBird();
      console.log("new bird");
      this.setState({treePulse : true});
      
    })
   //this.updateBird(0);
  }

  setUpdateBird(bird: number)
  {
    setInterval(() => {
      this.newBirdPos(bird);
      this.newBirdState(bird);
    }, 4000);
  }

  createBird()
  {
    const bird = this.state.birdPos.length;
    if (bird > 10) {return};
    this.setState({birdPos:  [ ...this.state.birdPos, {x:0, y:1.5, z:3} ]});
    this.setState({birdState: [ ...this.state.birdState, null] });
    this.setUpdateBird(bird);
    this.newBirdPos(bird);  // to avoid having to wait a full cycle to see it
  }

  async newBirdPos(bird: number)
  {
    const newPos = {
      x: (Math.random() *10 )- 5,
      y:  Math.random() *2 + 1,
      z: (Math.random() *10 )- 5  
    }  
    this.setState({birdPos: [
      ...this.state.birdPos.slice(0, bird),
      newPos,
      ...this.state.birdPos.slice(bird + 1),
    ]});
  }

  newBirdState(bird: number)
  {
    let newState : BirdState;
    const stateNow = Math.random();
    if (stateNow < 0.4){ 
      newState = null 
    } else if (stateNow < 0.7) {
      newState =  'looking'
    } else {
      newState =  'shake'
    }
    this.setState({birdState: [
      ...this.state.birdState.slice(0, bird),
      newState,
      ...this.state.birdState.slice(bird + 1),
    ]});
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
            { clip: "Bird_fly" , loop:true, playing:true },
            { clip: "Bird_look" , playing:
            this.state.birdState[birdNum] == 'looking'?true:false },
            { clip: "Bird_shake" , playing: this.state.birdState[birdNum] == 'shake'}
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
          src="models/Ground.gltf"
         />

        <gltf-model
          src="models/Tree.gltf"
          id="tree"          
          skeletalAnimation={
            [
                { clip: "Armature_ArmatureAction" , loop:true, playing: this.state.treePulse? true : false },]
            }
         />


      </scene>
    )
  }
}
