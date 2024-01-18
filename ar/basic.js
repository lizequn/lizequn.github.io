function getObjByType(featureType){
    if(featureType==='cafe'){
        return "./assets/model/coffee/scene.glt'"
    }else{
        return "None"
    }
}
function renderObject(feature){
    let modelURL = getObjByType(feature.properties.featureType);
    let model;
    if(modelURL==="None"){
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
        model.setAttribute('rotation','0 180 0');
        model.setAttribute('animation-mixer','');
        model.setAttribute('scale','20 20 20');
    }
    return model;
}
window.onload = () => {
    let downloaded = false;

    const el = document.querySelector("[gps-new-camera]");

    el.addEventListener("gps-camera-update-position", async(e) => {
        if(!downloaded) {
            const west = e.detail.position.longitude - 0.01,
                  east = e.detail.position.longitude + 0.01,
                  south = e.detail.position.latitude - 0.01;
                  north = e.detail.position.latitude + 0.01;
            console.log(`${west} ${south} ${east} ${north}`);
            const response = await fetch(`https://hikar.org/webapp/map?bbox=${west},${south},${east},${north}&layers=poi&outProj=4326`);
            const pois = await response.json();
            console.log(pois)
            pois.features.forEach ( feature => {
                if (feature.properties.name.length <=10){
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
                    text.setAttribute("value", feature.properties.name);
                    text.setAttribute("align", "center");
                    compoundEntity.appendChild(object);
                    compoundEntity.appendChild(text);
                    document.querySelector("a-scene").appendChild(compoundEntity);
                }
            });
        }
        downloaded = true;
    });
};