models=[]
markers=[]
//lat,long
// marker_position = [50.74325,-1.89793]
marker_position = [36.71853,-4.42941]

function initRenderOnLocation(lat,long){
    const compoundEntity = document.createElement("a-entity");
    compoundEntity.setAttribute('gps-new-entity-place', {
        latitude: lat,
        longitude: long
    });
    compoundEntity.setAttribute("visible","false");
    compoundEntity.setAttribute("model-id","church");
    const model = document.createElement('a-entity');
    model.setAttribute('gltf-model','#church');
    model.setAttribute("position", {
        x : 0,
        y : 0,
        z: 0
    } );
    model.setAttribute("scale", {
        x: 5,
        y: 5,
        z: 5
    });
    model.addEventListener('loaded', () => {
        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
        // window.dispatchEvent(new CustomEvent('trackstart'));
    });
    const text = document.createElement("a-text");
    const textScale = 5;
    text.setAttribute("look-at", "[gps-new-camera]");
    text.setAttribute("scale", {
        x: textScale,
        y: textScale,
        z: textScale
    });
    text.setAttribute("value", "Church Example");
    text.setAttribute("align", "center");
    compoundEntity.appendChild(model);
    compoundEntity.appendChild(text);
    return compoundEntity;
}
function initTriggerMarker(lat,long){
    const compoundEntity = document.createElement("a-entity");
    compoundEntity.setAttribute('gps-new-entity-place', {
        latitude: lat,
        longitude: long
    });
    compoundEntity.setAttribute("model-id","marker");
    const model = document.createElement('a-box');
    model.setAttribute('material', { color: 'red' } );
    model.setAttribute("scale", {
        x: 5,
        y: 5,
        z: 5
    });
    model.setAttribute("position", {
        x : 0,
        y : 2,
        z: 0
    } );
    const text = document.createElement("a-text");
    const textScale = 10;
    text.setAttribute("look-at", "[gps-new-camera]");
    text.setAttribute("scale", {
        x: textScale,
        y: textScale,
        z: textScale
    });
    text.setAttribute("value", "Trigger Marker");
    text.setAttribute("align", "center");
    compoundEntity.appendChild(model);
    compoundEntity.appendChild(text);
    console.log("marker init");
    compoundEntity.addEventListener('trackstart', () => {
        console.log("tractstart");
        const camera = document.querySelector('[gps-new-camera]');
        let cameraPosition = camera.object3D.position;
        let markerPosition = compoundEntity.object3D.position;
        let distance = cameraPosition.distanceTo(markerPosition)
        check = setInterval(() => {
            cameraPosition = camera.object3D.position;
            markerPosition = compoundEntity.object3D.position;
            distance = cameraPosition.distanceTo(markerPosition)
            if(distance<=20){
                models[0].setAttribute("visible","true");
                markers[0].setAttribute("visible","false");
            }else{
                models[0].setAttribute("visible","false");
                markers[0].setAttribute("visible","true");
            }
            // do what you want with the distance:
            console.log(distance);
        }, 1000);
    });

    compoundEntity.addEventListener('trackstop', () => {
        clearInterval(check);
    });
    return compoundEntity;
}

window.onload = () => {

    let initRender = false;
    let initTrigger=false;
    const el = document.querySelector("[gps-new-camera]");
    if (!initRender){
        compoundEntity = initRenderOnLocation(e.detail.position);
        models.push(compoundEntity);
        document.querySelector("a-scene").appendChild(compoundEntity);
        initRender=true;
    }
    if (!initTrigger){
        compoundEntity = initTriggerMarker(marker_position[0],marker_position[1]);
        markers.push(compoundEntity);
        document.querySelector("a-scene").appendChild(compoundEntity);
        initTrigger=true;
        compoundEntity.dispatchEvent(new CustomEvent('trackstart'));
    }
    
    el.addEventListener("gps-camera-update-position", async(e) => {
        
    });
    
};