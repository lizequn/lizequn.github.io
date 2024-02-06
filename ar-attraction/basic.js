
function getObjByType(featureType){
    return "None"
}
function renderObject(feature){
    let modelURL = getObjByType(feature.properties.featureType);
    let model;
    if(modelURL=="None"){
        model = document.createElement("a-box");
        model.setAttribute("scale", {
            x: 10,
            y: 10,
            z: 10
        });
        model.setAttribute('material', { color: 'red' } );
        model.setAttribute("position", {
            x : 0,
            y : 10,
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

window.onload = () => {
    let attractions = false;
    const el = document.querySelector("[gps-new-camera]");
    el.addEventListener("gps-camera-update-position", async(e) => {
        if(!attractions) {
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
                const textScale = 50;
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