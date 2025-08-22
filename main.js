const datastore = {
    numFloors : 0,
    numLifts : 0,
    liftPositions : [],
    liftDirections : [],
    isLiftBusy : [],
    liftRequestQueue : [],

    initialize(numFloors,numLifts) {
        this.numFloors = numFloors;
        this.numLifts = numLifts;
        this.liftPositions = Array(numLifts).fill(0);
        this.liftDirections = Array(numLifts).fill(null);
        this.isLiftBusy = Array(numLifts).fill(false);
        this.liftRequestQueue = [];

        console.log(`Initialized building with ${numFloors} floors and ${numLifts} lifts.`);
        console.log("Lift positions:", this.liftPositions);
        console.log("Lift directions:", this.liftDirections);
        console.log("Lift busy states:", this.isLiftBusy);

    },

    updateLiftPosition(liftIndex , floor){
        this.liftPositions[liftIndex]=floor;
        console.log(`lift moved from ${liftIndex} to floor ${floor}`);
    },

    getLiftPosition(liftIndex){
        return this.liftPositions[liftIndex];
    },

    updateLiftDirection(liftIndex , direction){
        this.liftDirections[liftIndex] =direction;
        console.log(`Lift ${liftIndex} is now moving in ${direction}`);
    },

    getLiftsDirection(liftIndex){
        return this.liftDirections[liftIndex];
    },

    updateLiftStatus(liftIndex,status){
        this.isLiftBusy[liftIndex]=status;
        console.log(`Lift ${liftIndex} status now updated to → ${status ? "Busy" : "Free"}`);
    },

   getLiftBusyStatus(liftIndex){
        return this.isLiftBusy[liftIndex];
   },

   addLiftRequest(floor,direction){
    this.liftRequestQueue.push({floor , direction});
    console.log(`New lift request added: Floor ${floor}  , direction ${direction}`);
    console.log("Current request queue:", this.liftRequestQueue);
   },

   getNextLiftRequest(){
     return this.liftRequestQueue.shift();
   },

   isLiftRequestQueueEmpty(){
    return this.liftRequestQueue.length === 0;
   }
}

const Lift_Simulation = () => {

    const numFloors =parseInt(document.getElementById('floors').value);
    const numLifts =parseInt(document.getElementById('lifts').value);

    document.body.innerHTML ="";

    datastore.initialize(numFloors,numLifts);

    generateFloors(numFloors);
    generateLifts(numLifts);
}

const generateFloors = (numFloors) =>{
    const floorContainer = document.createElement('div');
    floorContainer.id = "floorContainer";
    floorContainer.classList.add('floorContainer');

    for(let i=numFloors -1 ;i >=0; i--){
        const floor = document.createElement('div');
        floor.id = `floor-${i}`;
        floor.classList.add('floor');

        const floorControls = document.createElement('div');
        floorControls.classList.add('floorControls');

        if(i !== numFloors -1){
            const upButton = document.createElement('button');
            upButton.textContent = '▲ UP';
            upButton.classList.add('up-button');
            upButton.addEventListener('click' , () => {
                requestLift(i , 'up');
            });
            floorControls.appendChild(upButton);
        }
        
        const floorNumber = document.createElement('span');
        floorNumber.classList.add(`floor-number`);
        floorNumber.textContent = `Floor ${i}`;
        floorContainer.appendChild(floorNumber);

        if(i!== 0){
            const downButton = document.createElement('button');
            downButton.textContent ='▼ DOWN';
            downButton.classList.add('down-button');
            downButton.addEventListener('click' ,() => {
                requestLift(i , 'down');
            });
            floorControls.appendChild(downButton);
        }

        floor.appendChild(floorControls);
        floorContainer.appendChild(floor);
        document.body.appendChild(floorContainer);
    }
}

const generateLifts =(numLifts) => {
    const groundFloor = document.getElementById('floor-0');
    const liftWidth =80;   

    for(let i=0; i< numLifts ; i++){
        const lift = document.createElement('div');
        lift.classList.add('lift');
        lift.id = `lift-${i}`;
        lift.style.left = `${260 + i * liftWidth}px`;

        const liftDoors =document.createElement('div');

        const leftDoor = document.createElement('div');
        const rightDoor =document.createElement('div');
        
        leftDoor.classList.add('left-door');
        rightDoor.classList.add('right-door');

        liftDoors.appendChild(leftDoor);
        liftDoors.appendChild(rightDoor);

        lift.appendChild(liftDoors);

        groundFloor.appendChild(lift);
    }
}

const allocateLift = (floor, direction) => {
    const liftPositions = datastore.liftPositions;
    const liftDirections = datastore.liftDirections;
    const isLiftBusy = datastore.isLiftBusy;

    const availableLifts =[];
    for(let i = 0; i < liftPositions.length; i++){
        if(!isLiftBusy[i]){
            if(liftDirections[i] === null){
                availableLifts.push(i);
            }else if(direction === 'up' && liftPositions[i] < floor){
                availableLifts.push(i);
            }else if(direction === 'down' && liftPositions[i] > floor){
            availableLifts.push(i);
            }
        }
    }

    if(availableLifts.length > 0){
        let closestLiftIndex = availableLifts[0];
        let minDistance = Math.abs(liftPositions[closestLiftIndex] - floor);

        //chooses closest lift to floor using min search 
        for(let i = 1; i< availableLifts.length ; i++){
            const liftIndex =availableLifts[i];
            const distance = Math.abs(liftPositions[liftIndex] - floor);
            if(distance < minDistance) {
                minDistance = distance;
                closestLiftIndex = liftIndex;
            }
        }

        console.log("The closest lift is", closestLiftIndex);
        return closestLiftIndex; 
    }
    return -1;         // when no lift is found
}

const requestLift = (floor , direction) => {
    const allLiftsAreBusy = datastore.isLiftBusy.every((value) => value === true); // checks if all lifts are busy . every returns true only if ecah value is true.

    if(!allLiftsAreBusy){
        console.log("Lift requested on floor" , floor , "which is now going " , direction);
        const allocatedLift = allocateLift(floor , direction);
        datastore.isLiftBusy[allocatedLift] = true;        // marks the lift as busy
        console.log("lift" , allocatedLift , "has now been allocated");
    
        if(allocatedLift !== -1){ // if valid lift is found , disable buttons to avoid spam
            animateLift(allocatedLift , floor , direction);
            disableLiftButtons(floor , direction);    // disables the floor button
        }
    }else{
        console.log("All lifts are busy !");
        datastore.addLiftRequest(floor , direction);   // add lift request to queue as all lift busy now
        disableLiftButtons(floor , direction);
    }
}

const disableLiftButtons = (floor , direction) => {
    let floorButtons = document.getElementById(`floor-${floor}`).querySelector('.down-button');
    if(direction === "up"){
        floorButtons =document.getElementById(`floor-${floor}`).querySelector('.up-button');
    }
    floorButtons.disabled =true;
}

const enableLiftButton = (floor , direction) => {
    let floorButtons =document.getElementById(`floor-${floor}`).querySelector('.down-button');
    if(direction === "up"){
        floorButtons =document.getElementById(`floor-${floor}`).querySelector('.up-button');
    }
    floorButtons.disabled =false;
}

const animateLift = (liftNumber, targetFloor, direction) => {
    const liftElement = document.getElementById(`lift-${liftNumber}`);
    const currentFloor = datastore.liftPositions[liftNumber];
    const floorHeight = document.getElementById('floor-1').clientHeight + 1; // Height of each floor in pixels
    // Calculate the correct distance to travel based on the current and target floor
    const distanceToTravel = Math.abs(targetFloor) * floorHeight;

    // Calculate the duration of the animation based on the number of floors to travel
    const duration = Math.abs(currentFloor - targetFloor) * 2000; // Delay of 1s per floor

    liftElement.style.transition = `transform ${duration / 1000}s linear`;
    liftElement.style.transform = `translateY(-${distanceToTravel}px)`;

    setTimeout(() => {
        liftElement.classList.add('open');

        let sound = new Audio("./ding.mp3"); // added ding audio 
        sound.play();
        setTimeout(() => {
            // Close the lift doors after 2.5 seconds
            liftElement.classList.remove('open');
            setTimeout(() => {
                datastore.isLiftBusy[liftNumber] = false;
                datastore.liftDirections[liftNumber] = null;
                datastore.updateLiftPosition(liftNumber, targetFloor);

                enableLiftButton(targetFloor, direction);

                // Check if there are pending lift requests in the queue
                if (datastore.liftRequestQueue.length > 0) {
                    const nextRequest = datastore.liftRequestQueue.shift(); // Get the next request from the queue
                    const { floor, direction } = nextRequest;
                    requestLift(floor, direction); // Process the next request
                }
            }, 2100); // lifts door closed
        }, 2100); // lifts door open
    }, duration); // Add a delay of 5 seconds before processing the next request
}