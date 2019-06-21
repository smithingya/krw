import defaultImage from '../Img/IUCN_Red_List.svg.png'
import * as search from './searchActions'
import {GRAPHDB} from '../graphDB.js'
import axiosRetry from 'axios-retry';


const axios = require("axios");

export function retrieveWars(){
  var q = GET_WARS;

  var warNames = axios.get(GRAPHDB,{
    headers: {'Accept': 'application/sparql-results+json'},
    params: {
      query: q
    }
  })
  .then(function (warNames){
    var details = warNames.data.results.bindings
    return details
  })
  return {
    type: "WARS_RETRIEVED",
    payload: warNames
  }
}

export function clickedRetrieval(string,type){
  return function(dispatch){
    dispatch(search.searchPending())
    dispatch(retrieveAnimalNames(string,type))
    if (type == 'rank' || type == 'category'){
      string = string.replace(/.*\//g,'')
    }
    dispatch(search.typeChange(type))
    dispatch(search.inputChange(string))
  }
}

function retrieveAnimalsByWar(string){
  return function(dispatch){
    dispatch(search.searchPending())
    var latlng = string.split(",")
    var lat = parseFloat(latlng[0]), lng = parseFloat(latlng[1]), rad = parseFloat(latlng[2]);
    const INATURALIST = "https://api.inaturalist.org/v1/observations"
    var obs = axios.get(INATURALIST,{
      headers: {'Accept': 'application/sparql-results+json'},
      params: {
        quality_grade: 'research',
        lat: lat,
        lng: lng,
        radius: rad,
        order: 'desc',
        order_by: 'created_at',
        per_page: 200,
        d1: '2018/01/01',
        iconic_taxa: 'Mammalia',
        locale: 'en',
      }
    })
    .catch(function (error) {
      dispatch(empty())
      dispatch(search.searchDone())
      console.log(error);
    })
    .then(function (res){
      var data = res.data.results
      if (data.length < 1){
        dispatch(empty())
        dispatch(search.searchDone())
        return
      }
      var animalNames = []
      data.forEach(function(item,index,array){
        animalNames[index] = item.taxon.name
      })
      var animalNamesSet = new Set(animalNames)
      var animalNames = [...animalNamesSet]
      return animalNames
    })
    .then(function(animalNames){
      var animals = []
      var promises = []
      animalNames.forEach(function(item, index, array){
        var q = BY_NAME_WARS
        q = q.replace("SEARCHSTRING", item)
        promises[index] = axios.get(GRAPHDB,{
          headers: {'Accept': 'application/sparql-results+json'},
          params: {
            query: q
          }
        })
        .then(function (response) {
          var animalsSub = response.data.results.bindings;
          if (animalsSub[0].taxon !== undefined){
            animals.push(...animalsSub)
          }
        })
      })
      Promise.all(promises).then(() => dispatch(retrieveImages(animals)))
    })
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function empty(){
  return {
    type: "EMPTY_SEARCH",
  }
}

export function retrieveAnimalNames(string, type){
  if (string === ''){
    return {
      type: "EMPTY_SEARCH",
    }
  }
  var animals = []
  var q = '';
  switch (type) {
    case 'animal': q = BY_NAME;
      break;
    case 'habitat': q = BY_HABITAT;
      break;
    case 'threat': q = BY_THREAT;
      break;
    case 'measure': q = BY_MEASURE;
      break;
    case 'ecoregion': q = BY_ECOREGION;
      break;
    case 'rank': q = BY_TAXON_RANK;
      break;
    case 'category': q = BY_CATEGORY;
      break;
  };

  q = q.replace(/SEARCHSTRING/g, string)

  return function(dispatch) {
    dispatch(search.searchPending())
    if (type == 'war'){
      dispatch(retrieveAnimalsByWar(string))
      return
    }
    animals = axios.get(GRAPHDB,{
      headers: {'Accept': 'application/sparql-results+json'},
      params: {
        query: q
      }
    })
    .then(function (response) {
      var animals = response.data.results.bindings;
      if (animals[0].taxon == undefined){
        dispatch(empty())
        dispatch(search.searchDone())
        return
      }
      dispatch(retrieveImages(animals))
      // return animals
    })
    .catch(function (error) {
      dispatch(empty())
      dispatch(search.searchDone())
      console.log(error);
    })
  }
}

function retrieveImages(animals){
  return function(dispatch){
    var promises = [];
    animals.forEach(async function(item, index, array){
      var taxon = item.taxon.value;
      array[index].image = defaultImage
      var qq = GET_IMAGES.replace('TAXON', taxon)
      axiosRetry(axios, { retries: 5, retryDelay: (retryCount) => {
  return retryCount * 200;
} });
      promises[index] = axios.get('https://query.wikidata.org/sparql',{
        headers: {'Accept': 'application/sparql-results+json'},
        params: {
          query: qq
        }
      })
      .then(async function (response){
        await sleep(50)
        if (response.data.results.bindings[0] == undefined){
          var im = defaultImage;
          array[index].image = im
          return im
        }
        var im = response.data.results.bindings[0].image.value
        array[index].image = im
        return im
      })
      .catch(function (error) {
        console.log(error);
      })
      await sleep(50)
      array[index].animal = item.animal.value;
      array[index].name = item.name.value;
      array[index].taxon = taxon
    })
    Promise.all(promises).then(() => {dispatch(imagesRetrieved(animals)); dispatch(search.searchDone())})
  }
}

function retrieveImage(taxon){
  var qq = GET_IMAGES.replace('TAXON', taxon)
  var image = axios.get('https://query.wikidata.org/sparql',{
    headers: {'Accept': 'application/sparql-results+json'},
    params: {
      query: qq
    }
  })
  .then(function (response){
    if (response.data.results.bindings[0] == undefined){
      var im = defaultImage;
      return im
    }
    var im = response.data.results.bindings[0].image.value
    return im
  })
  .catch(function (error) {
    console.log(error);
  })
  return {
    type: "RETRIEVE_IMAGE",
    payload: image
  }
}

function retrieved(animals) {
  return{
    type: "RETRIEVED_ANIMALS",
    payload: animals,
  }
}
function imagesRetrieved(animals) {
  return{
    type: "IMAGES_RETRIEVED",
    payload: animals,
  }
}

export function retrieveAnimalDetails(animal){
  if (animal.detailsRetrieved){
    return {
      type: "SELECTED_ANIMAL",
      payload: animal,
    }
  }
  return function(dispatch){
    if (animal.image === defaultImage){
      dispatch(retrieveImage([animal.taxon]))
    }
    var q = DETAILS.replace('ANIMAL',animal.animal)
    var res = axios.get(GRAPHDB,{
      headers: {'Accept': 'application/sparql-results+json'},
      params: {
        query: q
      }
    })
    .then(function (res){
      var details = res.data.results.bindings
      details.forEach(function(item, index, array){
        var prop = item.property.value.replace(/.*\//g,'')
        if (item.value.type == 'literal'){
          animal[prop] = item.value.value
        }
        else if (item.code != undefined){
          if (animal[prop] == undefined){
            animal[prop] = {}
          }
          // this is the case for threats, habitats and measures
          var code = item.code.value
          var label = item.label.value
          var type = item.subval.value
          var id = item.value.value.replace(/.*\//g,'') // unique identifier for threat,habitat and measure
          if (animal[prop][id] == undefined){
            animal[prop][id] = {}
            animal[prop][id].code = []
            animal[prop][id].label = []
            animal[prop][id].type = []
          }
          animal[prop][id].code.push(code)
          animal[prop][id].label.push(label)
          animal[prop][id].type.push(type)
          // var o = {code,label,type}
          // if (!animal[prop].some(elem => JSON.stringify(elem) === JSON.stringify(o))){
          //   animal[prop].push(o)
          // }
        }
        else if (item.subp.value != "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
          // this is the case for all other things
          if (animal[prop] == undefined){
            animal[prop] = {}
          }
          var obj = animal[prop]
          var subprop = item.subp.value.replace(/.*\//g,'').replace(/.*#/g,'')
          var id = item.value.value.replace(/.*\//g,'')
          if (obj[id] == undefined){
            obj[id] = {}
          }
          obj[id][subprop] = item.subval.value
          obj[id].link = item.value.value
        }
      })
      animal.detailsRetrieved = true
      dispatch(detailsRetrieved(animal))
      dispatch(search.searchDone())
    })
  }
}

function detailsRetrieved(animal){
  return {
    type: "SELECTED_ANIMAL",
    payload: animal,
  }
}

const DETAILS = `
PREFIX nc: <http://iucn-knowledge-graph.org/class/>
PREFIX np: <http://iucn-knowledge-graph.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT DISTINCT ?property ?value ?subp ?subval ?code ?label
WHERE {
    <ANIMAL> ?property ?value .
    OPTIONAL {
        ?value ?subp ?subval.
        OPTIONAL {
            ?subval np:hasCode ?code.
            ?subval np:hasLabel ?label .
        }
    }
    FILTER (?property != owl:sameAs)
    FILTER (?property != rdf:type)
}`;

const BY_NAME = `
PREFIX nc: <http://iucn-knowledge-graph.org/class/>
PREFIX np: <http://iucn-knowledge-graph.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT DISTINCT (SAMPLE(?animal) AS ?animal) (SAMPLE(?name) AS ?name) ?taxon
WHERE {
    ?animal np:hasCommonName ?name .
    ?animal np:hasTaxonId ?id .
    ?animal np:hasScientificName ?taxon .
    FILTER (CONTAINS(LCASE(?name), LCASE("SEARCHSTRING")) || CONTAINS(LCASE(?taxon), LCASE("SEARCHSTRING")))
}
GROUP BY ?taxon
`;

const BY_HABITAT = `
PREFIX nc: <http://iucn-knowledge-graph.org/class/>
PREFIX np: <http://iucn-knowledge-graph.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT DISTINCT (SAMPLE(?animal) AS ?animal) (SAMPLE(?name) AS ?name) ?taxon
WHERE{
    ?animal np:hasHabitat ?habitat ;
        np:hasCommonName ?name ;
        np:hasScientificName ?taxon .
    ?habitat rdf:type ?habitatType .
    ?habitatType ?p ?c .
    FILTER (?p = np:hasCode || ?p = np:hasLabel)
    FILTER CONTAINS(LCASE(?c), LCASE('SEARCHSTRING'))
}
GROUP BY ?taxon
`;

const BY_THREAT = `
PREFIX nc: <http://iucn-knowledge-graph.org/class/>
PREFIX np: <http://iucn-knowledge-graph.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT DISTINCT (SAMPLE(?animal) AS ?animal) (SAMPLE(?name) AS ?name) ?taxon
WHERE{
    ?animal np:hasThreat ?threat ;
        np:hasCommonName ?name ;
        np:hasScientificName ?taxon .
    ?threat rdf:type ?threatType .
    ?threatType ?p ?c .
    FILTER (?p = np:hasCode || ?p = np:hasLabel)
    FILTER CONTAINS(LCASE(?c), LCASE('SEARCHSTRING'))
}
GROUP BY ?taxon
`;

const BY_MEASURE = `
PREFIX nc: <http://iucn-knowledge-graph.org/class/>
PREFIX np: <http://iucn-knowledge-graph.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT DISTINCT (SAMPLE(?animal) AS ?animal) (SAMPLE(?name) AS ?name) ?taxon
WHERE{
    ?animal np:hasMeasure ?measure ;
        np:hasCommonName ?name ;
        np:hasScientificName ?taxon .
    ?measure a ?measureType .
    ?measureType ?p ?c .
    FILTER (?p = np:hasCode || ?p = np:hasLabel)
    FILTER CONTAINS(LCASE(?c), LCASE('SEARCHSTRING'))
}
GROUP BY ?taxon
`;

const BY_ECOREGION = `
PREFIX nc: <http://iucn-knowledge-graph.org/class/>
PREFIX np: <http://iucn-knowledge-graph.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX wwf_p: <http://WWF.org/property/>

SELECT DISTINCT (SAMPLE(?animal) AS ?animal) (SAMPLE(?name) AS ?name) ?taxon
WHERE{
    ?animal np:hasCommonName ?name ;
        np:hasScientificName ?taxon ;
        wwf_p:hasEcoregion ?c .
    FILTER CONTAINS(LCASE(?c), LCASE('SEARCHSTRING'))
}
GROUP BY ?taxon
`;

const BY_TAXON_RANK = `
PREFIX nc: <http://iucn-knowledge-graph.org/class/>
PREFIX np: <http://iucn-knowledge-graph.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT DISTINCT (SAMPLE(?animal) AS ?animal) (SAMPLE(?name) AS ?name) ?taxon
WHERE{
    ?animal ?p <SEARCHSTRING> ;
        np:hasCommonName ?name ;
        np:hasScientificName ?taxon .
}
GROUP BY ?taxon
`;

const BY_CATEGORY = `
PREFIX nc: <http://iucn-knowledge-graph.org/class/>
PREFIX np: <http://iucn-knowledge-graph.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT DISTINCT (SAMPLE(?animal) AS ?animal) (SAMPLE(?name) AS ?name) ?taxon
WHERE{
    ?animal ?p <SEARCHSTRING> ;
        np:hasCommonName ?name ;
        np:hasScientificName ?taxon .
}
GROUP BY ?taxon
`;

const GET_IMAGES= `
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX bd: <http://www.bigdata.com/rdf#>

SELECT ?animal_wikidata ?image WHERE {
  ?s wdt:P225 'TAXON' .
  ?s wdt:P18 ?image .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
} LIMIT 1
`;

const GET_WARS = `
PREFIX wns1: <http://unmissions.com/resource/vocab/>

SELECT DISTINCT ?warName ?lat ?lng
WHERE{
    ?war wns1:Mission_Acronym ?warName;
        wns1:hasLatitude ?lat;
        wns1:hasLongitude ?lng.
    FILTER (?lat != 'NULL')
}
`;

const BY_NAME_WARS = `
PREFIX nc: <http://iucn-knowledge-graph.org/class/>
PREFIX np: <http://iucn-knowledge-graph.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT DISTINCT (SAMPLE(?animal) AS ?animal) (SAMPLE(?name) AS ?name) ?taxon
WHERE {
    ?animal np:hasCommonName ?name .
    ?animal np:hasTaxonId ?id .
    ?animal np:hasScientificName ?taxon .
    ?animal np:hasThreat ?threat .
    ?threat rdf:type ?threatType .
    ?threatType np:hasCode '6.2'.
    FILTER CONTAINS(LCASE(?taxon), LCASE("SEARCHSTRING"))
}
GROUP BY ?taxon
`;
