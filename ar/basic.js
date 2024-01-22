models=[]
//lat,long
marker_position = [50.71269,-1.9874]
function getObjByType(featureType){
    if(featureType=="cafe"){
        return "#coffee"
    }else{
        return "None"
    }
}
function renderObject(feature){
    let modelURL = getObjByType(feature.properties.featureType);
    console.log(modelURL);
    let model;
    if(modelURL=="None"){
        model = document.createElement("a-box");
        model.setAttribute("scale", {
            x: 20,
            y: 20,
            z: 20
        });
        model.setAttribute('material', { color: 'red' } );
        model.setAttribute("position", {
            x : 0,
            y : 20,
            z: 0
        } );
    }else{
        model = document.createElement('a-entity');
        model.setAttribute('gltf-model',modelURL);
        model.setAttribute("position", {
            x : 0,
            y : 5,
            z: 0
        } );
        model.setAttribute("scale", {
            x: 100,
            y: 100,
            z: 100
        });
        // model.setAttribute('rotation','0 180 0');
        // model.setAttribute('animation-mixer','');
        // model.setAttribute('scale','20 20 20');
        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });
    }
    return model;
}
function initRenderOnUser(position){
    const compoundEntity = document.createElement("a-entity");
    compoundEntity.setAttribute('gps-new-entity-place', {
        latitude: position.latitude+0.01,
        longitude: position.longitude
    });
    compoundEntity.setAttribute("visible","false");
    compoundEntity.setAttribute("model-id","church");
    const model = document.createElement('a-entity');
    model.setAttribute('gltf-model','#church');
    model.setAttribute("position", {
        x : 0,
        y : 5,
        z: 0
    } );
    model.setAttribute("scale", {
        x: 10,
        y: 10,
        z: 10
    });
    model.addEventListener('loaded', () => {
        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
        // window.dispatchEvent(new CustomEvent('trackstart'));
    });
    const text = document.createElement("a-text");
    const textScale = 100;
    text.setAttribute("look-at", "[gps-new-camera]");
    text.setAttribute("scale", {
        x: textScale,
        y: textScale,
        z: textScale
    });
    text.setAttribute("value", "Trigger Example");
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
        x: 10,
        y: 10,
        z: 10
    });
    model.setAttribute("position", {
        x : 0,
        y : 20,
        z: 0
    } );
    const text = document.createElement("a-text");
    const textScale = 100;
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
    //window.addEventListener('load', () => {
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
                if(distance<=10){
                    models[0].setAttribute("visible","true");
                }else{
                    models[0].setAttribute("visible","false");
                }
                // do what you want with the distance:
                console.log(distance);
            }, 1000);
        });

        compoundEntity.addEventListener('trackstop', () => {
            clearInterval(check);
        });
    //});
    return compoundEntity;
}

window.onload = () => {
    let attractions = false;
    let initRender = false;
    let initTrigger=false;
    const el = document.querySelector("[gps-new-camera]");
    if (!initTrigger){
        compoundEntity = initTriggerMarker(marker_position[0],marker_position[1])
        document.querySelector("a-scene").appendChild(compoundEntity);
        initTrigger=true;
        compoundEntity.dispatchEvent(new CustomEvent('trackstart'));
    }
    el.addEventListener("gps-camera-update-position", async(e) => {
        if (!initRender){
            compoundEntity = initRenderOnUser(e.detail.position);
            models.push(compoundEntity);
            document.querySelector("a-scene").appendChild(compoundEntity);
            initRender=true;
        }
        if(attractions) {
            const west = e.detail.position.longitude - 0.03,
                  east = e.detail.position.longitude + 0.03,
                  south = e.detail.position.latitude - 0.03;
                  north = e.detail.position.latitude + 0.03;
            console.log(`${west} ${south} ${east} ${north}`);
            const response = await fetch(`https://hikar.org/webapp/map?bbox=${west},${south},${east},${north}&layers=poi&outProj=4326`);
            const pois = await response.json();
            console.log(pois)
            pois.features.forEach ( feature => {
                const compoundEntity = document.createElement("a-entity");
                compoundEntity.setAttribute('gps-new-entity-place', {
                    latitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0]
                });
                const object = renderObject(feature);
                const text = document.createElement("a-text");
                const textScale = 100;
                text.setAttribute("look-at", "[gps-new-camera]");
                text.setAttribute("scale", {
                    x: textScale,
                    y: textScale,
                    z: textScale
                });
                text.setAttribute("value", feature.properties.name.replace(/ *\([^)]*\) */g, ""));
                text.setAttribute("align", "center");
                compoundEntity.appendChild(object);
                compoundEntity.appendChild(text);
                document.querySelector("a-scene").appendChild(compoundEntity);
            });
            attractions = true;
        } 
    });
    
};