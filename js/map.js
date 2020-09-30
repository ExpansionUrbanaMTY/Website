const years = [1990, 1995, 2000, 2005, 2010, 2015, 2019]

function onChange(value){
    let year = years[value]
    document.querySelector('#year').innerHTML = `Año seleccionado`;
    map2.setLayoutProperty(year.toString(), 'visibility', 'visible');
    
    setTimeout(()=>{
        years.filter(y=>y!=year).forEach(y=>{
            map2.setLayoutProperty(y.toString(), 'visibility', 'none');
        })
    }, 500)

    
}

document.querySelector('#slider').addEventListener('change', (e)=>{
    onChange(e.target.value)
})

function advanceSlider(i){
return new Promise((resolve, reject)=>{
    setTimeout(()=>{
        if(i<=7){
            document.querySelector("#slider").value = i-1;
            onChange(i-1);
        }
        resolve("Donwe")    
        console.log(i-1);    
    }, 1500*i)
})
}

function playSlider(){
    document.getElementById("simulationBtn").setAttribute("disabled","true");
    let promises = [];
    for(let i=1;i<=8;i++){
        promises.push( advanceSlider(i) );
    }
    Promise.all(promises).then(()=>{
        document.querySelector("#slider").value = 0;
        onChange(0);
        document.getElementById("simulationBtn").removeAttribute("disabled");
    })
    return;
}

// Generar mapa
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9wb25teCIsImEiOiJjazg1OHpseHcwMG1lM2VrbGo1emY5enVzIn0.v27OOfnnNHFavaO04-affQ';
let map2 = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-100.309, 25.6714],
    zoom: 8.43
});
loadMap()

// Cargar datos de csv y geojson al mapa
async function loadMap(){
    map2.resize();
    let rows = await d3.csv('./data/FishnetRecortado.csv');
    let geojson = await d3.json('./data/gridDef2.geojson')
    map2.on('load', (e)=>{
        map2.addSource('expansion', {
            type: 'geojson', 
            data: geojson
        });
        years.forEach((year)=>{
            var expression = ['match', ['get', 'Id']];
            rows.forEach(function(row) {
                if(row['MU'+year]=='1') expression.push(Number(row['Id']), '#992B81');
            });
            map2.addLayer({
                'id': year.toString(),
                'type': 'fill',
                'source': 'expansion',
                // 'source-layer': 'expansion',
                'layout': {},
                'paint': {
                    'fill-color': expression,
                    // 'fill-color': '#088',
                    'fill-opacity': 0.9
                }
            });
            map2.addSource(year.toString()+"-text-source", {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': {'description': "Ford's Theater"},
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [25.6031389,-100.3714064]
                            }
                        },
                    ]
                }
            });
            map2.addLayer({
                'id': year.toString()+"-text",
                'type': 'symbol',
                'source': year.toString()+"-text-source",
                'layout': {
                    'text-field': ['get', 'description'],
                    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                    'text-radial-offset': 0.5,
                    'text-justify': 'auto',
                }
            })
            map2.setLayoutProperty(year.toString(), 'visibility', 'none');
        })
        // map2.setLayoutProperty(years[0].toString(), 'visibility', 'visible');
    })
}




// var rows;

// d3.csv("./data/FishnetRecortadoT.csv", function(loadedRows) {
//     rows = loadedRows;
//     // console.log(rows)
//     var map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mapbox/streets-v11',
//         center: [-100.309, 25.6714],
//         zoom: 8
//     });
    
//     map.on('load', ()=>{
//         d3.json('./data/gridDef2.geojson', (err, data)=>{
//             if (err) throw err;
//             map.addSource('expansion', {
//                 'type': 'geojson',
//                 data: data
//             });
        
//             map.addLayer({
//                 'id': 'id',
//                 'type': 'fill',
//                 'source': 'expansion',
//                 'layout': {},
//                 'paint': {
//                 'fill-color': '#088',
//                 'fill-opacity': 0.8
//                 }
//             });
            
        
//         });
//     });


// });



