const years = [1990, 1995, 2000, 2005, 2010, 2015, 2019];


const places = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'properties': {
                'description': "926 km²",
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [25.6714, -100.308611].reverse()
            }
        },
    ]
};


mapboxgl.accessToken = 'pk.eyJ1Ijoicm9wb25teCIsImEiOiJjazg1OHpseHcwMG1lM2VrbGo1emY5enVzIn0.v27OOfnnNHFavaO04-affQ';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-100.8126957, 25.801482],
    zoom: 8.8
});

let changeLayer = (value)=>(
    new Promise((resolve, reject)=>{
        let year = years[value]; 
        map.setLayoutProperty(year.toString(), 'visibility', 'visible');
        map.setLayoutProperty(year.toString()+'-label', 'visibility', 'visible');
        function hideOthers(e,_year=year) {
            setTimeout(()=>{
                console.log('A render event occurred.', _year);
                years.filter(y=>y!=_year).forEach(y=>{
                    map.setLayoutProperty(y.toString(), 'visibility', 'none');
                    map.setLayoutProperty(y.toString()+'-label', 'visibility', 'none');
                    resolve();
                })
                map.off('idle',hideOthers)
            }, 2500)
        }
        map.on('idle', hideOthers)
    })
)

let loadMap = async ()=>{
    map.resize();
    let rows = await d3.csv('./data/FishnetRecortado.csv');
    let geojson = await d3.json('./data/gridDef2.geojson');
    let area = await d3.csv('./data/Extensiones.csv');
    map.addSource('expansion', {
        type: 'geojson',
        data: geojson
    });
    years.forEach((year)=>{
        var expression = ['match', ['get', 'Id']
            // ...rows.map(row=>([Number(row['Id']), row['MU'+year]=='1' ? '#F3775D' : 'transparent' ])).flat()
        ];
        rows.forEach(function(row) {
            if(row['MU'+year]=='1'){
                expression.push(Number(row['Id']), '#F3775D');
            } 
        });
        expression.push('transparent')
        map.addLayer({
            'id': year.toString(),
            'type': 'fill',
            'source': 'expansion',
            'layout': {},
            'paint': {
                'fill-color': expression,
                'fill-opacity': 0.8
            }
        });
        let label = {...places};
        label.features[0].properties.description = (area[2][year] || area[2]["2019*"])+" km²";
        map.addSource(year.toString()+'-value', {
            'type': 'geojson',
            'data': places
        });

        map.addLayer({
            'id': year.toString()+'-label',
            'type': 'symbol',
            'source': year.toString()+'-value',
            'layout': {
                'text-field': [
                    'format',
                    year.toString(),
                    { 'font-scale': 0.4 },
                    '\n',
                    {},
                    ['get', 'description'],
                    { 'font-scale': 0.4 }
                ],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-variable-anchor': ['bottom'],
                'text-justify': 'auto',
                "text-size": 60,
            },
            'paint': {"text-color": "#ffffff"}
        });
        map.setLayoutProperty(year.toString()+"-label", 'visibility', 'none');
        map.setLayoutProperty(year.toString(), 'visibility', 'none');
    });
    map.setLayoutProperty(years[6].toString(), 'visibility', 'visible');
    map.setLayoutProperty(years[6].toString()+"-label", 'visibility', 'visible');
}

map.on('load', loadMap)

document.querySelector('#slider').addEventListener('change', (e)=>{
    changeLayer(e.target.value)
})

document.querySelector('#autoplay').addEventListener('click', ()=>{
    document.getElementById("autoplay").setAttribute("disabled","true");
    
    let is = [0,1,2,3,4,5,6];
    is.reduce((prevPromise, i)=>{
        return prevPromise.then(()=>{
                document.querySelector("#slider").value = i;
                return changeLayer(i)
        })
    }, Promise.resolve())

    document.getElementById("autoplay").removeAttribute("disabled");
    // Promise.all(promises).then(()=>{
    //     console.log("resolve")
    //     document.querySelector("#slider").value = 6;
    //     // changeLayer(6);
    // })
    return;
})