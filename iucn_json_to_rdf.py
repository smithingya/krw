import rdflib
import json
from rdflib import URIRef, BNode, Literal
from rdflib import Namespace, Graph
from rdflib.namespace import RDF, FOAF, XSD, RDFS, SKOS
import re, string

try:
    with open("mammals.json", "r") as read_file:
        print("Loading mammals from file.")
        mammals = json.load(read_file)
except:
    print("First run the API scraper, then return to this file.")
    exit()

nc = Namespace("http://iucn-knowledge-graph.org/class/")
np = Namespace("http://iucn-knowledge-graph.org/property/")
nr = Namespace("http://iucn-knowledge-graph.org/resource/")
g = Graph()
g.parse('classifications.ttl',format='turtle')

iucnToRdfMap = {
    'taxonid':{
        'type': XSD.int,
        'propertyName': 'hasTaxonId',
        'className': None
    },
    'scientific_name': {
        'type': XSD.string,
        'propertyName': 'hasScientificName',
        'className': None
    },
    'kingdom':{
        'type': XSD.string,
        'propertyName': 'inKingdom',
        'className': 'Kingdom',
        'other': [( (nc['Kingdom'], SKOS.narrower, nc['Phylum']) )]
    },
    "phylum": {
        'type': XSD.string,
        'propertyName': 'inPhylum',
        'className': 'Phylum',
        'other': [( (nc['Phylum'], SKOS.narrower, nc['Class']) ),
        ( (nc['Phylum'], SKOS.broader, nc['Kingdom']) )]
    },
    "class": {
       'type': XSD.string,
       'propertyName': 'inClass',
       'className': 'Class',
       'other': [( (nc['Class'], SKOS.narrower, nc['Order']) ),
       ( (nc['Class'], SKOS.broader, nc['Phylum']) )]
    },
    "order": {
       'type': XSD.string,
       'propertyName': 'inOrder',
       'className': 'Order',
       'other': [( (nc['Order'], SKOS.narrower, nc['Family']) ),
       ( (nc['Order'], SKOS.broader, nc['Class']) )]
    },
    "family": {
        'type': XSD.string,
        'propertyName': 'inFamily',
        'className': 'Family',
        'other': [( (nc['Family'], SKOS.narrower, nc['Genus']) ),
        ( (nc['Family'], SKOS.broader, nc['Order']) )]
    },
    "genus": {
       'type': XSD.string,
       'propertyName': 'inGenus',
       'className': 'Genus',
       'other': [( (nc['Genus'], SKOS.broader, nc['Family']) )]
    },
    "main_common_name": {
        'type': XSD.string,
        'propertyName': 'hasCommonName',
        'className': None
    },
    "subspecies": {
      'type': XSD.string,
      'propertyName': 'hasSubspeciesLabel',
      'className': None
    },
    "rank": {
        'type': XSD.string,
        'propertyName': 'hasRankLabel',
        'className': None
    },
    "subpopulation": {
        'type': XSD.string,
        'propertyName': 'hasSubpopulation',
        'className': None
    },
    "category": {
        'type': XSD.string,
        'propertyName': 'hasCategory',
        'className': 'Category'
    },
    "authority": {
         'type': XSD.string,
         'propertyName': 'hasAuthority',
         'className': None
    },
    "published_year": {
        'type': XSD.gYear,
        'propertyName': 'hasPublicationYear',
        'className': None
    },
    "assessment_date": {
        'type': XSD.date,
        'propertyName': 'hasAssesmentDate',
        'className': None
    },
    "criteria": {
        'type': XSD.string,
        'propertyName': 'meetsCriteria',
        'className': None
    },
    "population_trend": {
        'type': XSD.string,
        'propertyName': 'hasPopulationTrend',
        'className': None
    },
    "marine_system": {
        'type': XSD.boolean,
        'propertyName': 'livesInMarineSystem',
        'className': None
    },
    "freshwater_system": {
        'type': XSD.boolean,
        'propertyName': 'livesInFreshwaterSystem',
        'className': None
    },
    "terrestrial_system": {
        'type': XSD.boolean,
        'propertyName': 'livesInTerrestialSystem',
        'className': None
    },
    "assessor": {
        'type': XSD.string,
        'propertyName': 'hasAssesor',
        'className': 'Assesor'
    },
    "reviewer": {
        'type': XSD.string,
        'propertyName': 'hasReviewer',
        'className': 'Reviewer'
    },
    "aoo_km2": {
        'type': XSD.string,
        'propertyName': 'hasAreaOfOccupation',
        'className': None
    },
    "eoo_km2": {
        'type': XSD.string,
        'propertyName': 'hasExtendOfOccurence',
        'className': None
    },
    "elevation_upper": {
        'type': XSD.int,
        'propertyName': 'hasElevationUpperLimit',
        'className': None
    },
    "elevation_lower": {
        'type': XSD.int,
        'propertyName': 'hasElevationLowerLimit',
        'className': None
    },
    "depth_upper": {
        'type': XSD.int,
        'propertyName': 'hasDepthUpperLimit',
        'className': None
    },
    "depth_lower": {
        'type': XSD.int,
        'propertyName': 'hasDepthLowerLimit',
        'className': None
    },
    "errata_flag": {
        'type': XSD.boolean,
        'propertyName': 'hasErrataFlag',
        'className': None
    },
    "errata_reason": {
        'type': XSD.string,
        'propertyName': 'hasErrataReason',
        'className': None
    },
    "amended_flag": {
        'type': XSD.boolean,
        'propertyName': 'hasAmendFlag',
        'className': None
    },
    "amended_reason": {
        'type': XSD.string,
        'propertyName': 'hasAmendReason',
        'className': None
    },
    # start of threaths, habitats and measures
    "code": {
        'type': XSD.string,
        'propertyName': 'hasCode',
        'className': None
    },
    "title": {
        'type': XSD.string,
        'propertyName': 'hasTitle',
        'className': None
    },
    "timing": {
        'type': XSD.string,
        'propertyName': 'hasTiming',
        'className': None
    },
    "scope": {
        'type': XSD.string,
        'propertyName': 'hasScope',
        'className': None
    },
    "severity": {
        'type': XSD.string,
        'propertyName': 'hasSeverity',
        'className': None
    },
    "score": {
        'type': XSD.string,
        'propertyName': 'hasScore',
        'className': None
    },
    "invasive": {
        'type': XSD.boolean,
        'propertyName': 'isInvasive',
        'className': None
    },
    "suitability": {
        'type': XSD.string,
        'propertyName': 'hasSuitability',
        'className': None
    },
    "season": {
        'type': XSD.string,
        'propertyName': 'hasSeason',
        'className': None
    },
    "majorimportance": {
        'type': XSD.string,
        'propertyName': 'hasMajorImportance',
        'className': None
    }
}

g.add((nc['Mammal'], RDF.type, RDFS.Class))
g.add((nc['Assesor'], RDF.type, FOAF.Person))
g.add((nc['Reviewer'], RDF.type, FOAF.Person))
g.add((nc['Threat'], RDF.type, FOAF.Class))
g.add((nc['Habitat'], RDF.type, FOAF.Class))
g.add((nc['Country'], RDF.type, FOAF.Class))
g.add((nc['Measure'], RDF.type, FOAF.Class))

for key in iucnToRdfMap:
    relation = iucnToRdfMap[key]
    if relation['className'] != None:
        g.add( (nc[relation['className']], RDF.type, RDFS.Class) )
        other = relation.get('other',[])
        for ot in other:
            g.add(ot)

for mammal in mammals:
    taxonid = mammal['taxonid']
    newMammal = BNode()
    g.add( (nr[newMammal], RDF.type, nc['Mammal']) )
    for key in mammal:
        if key in ['threats','habitats','measures']:
            k = key[:-1].title()
            classifications = mammal[key]
            for classification in classifications:
                c = BNode()
                g.add( (nr[newMammal], np['has'+k] , nr[c]) )
                g.add( (nr[c], RDF.type, nc[k]) )
                code = classification['code']
                t = Literal(code, datatype = XSD.string)
                q = g.query(
                    'SELECT ?n \
                    WHERE { \
                        ?n np:hasCode ?code. \
                        ?n rdfs:subClassOf ?class \
                    }'
                , initBindings = {'code': t, 'class': nc[k]})
                for x in q:
                    g.add( (nr[c], RDF.type, x[0]) )
                for key2 in classification:
                    if key2 in ['code','title','habitat']:
                        continue
                    value = classification[key2]
                    mapping = iucnToRdfMap[key2]
                    t = mapping['type']
                    propertyName = mapping['propertyName']
                    g.add( (nr[c], np[propertyName], Literal(value, datatype=t)) )
        else:
            value = mammal[key]
            if value == None:
                continue
            mapping = iucnToRdfMap[key]
            t = mapping['type']
            propertyName = mapping['propertyName']
            className = mapping['className']
            if className == None:
                g.add( (nr[newMammal], np[propertyName], Literal(value, datatype=t)) )
            elif (key == 'assessor' or key == 'reviewer'):
                splitter = re.compile("(?<=\.),?\s&?\s?")
                assesors = splitter.split(value)
                for ass in assesors:
                    if 'tufek, B' in ass:
                        ass = 'Kryštufek, B.'
                        # print(ass)
                    ass = '_'.join(ass.translate(
                        str.maketrans('', '', string.punctuation)
                        ).split())
                    g.add( (nr[newMammal], np[propertyName] , nr[ass]) )
                    g.add( (nr[ass], RDF.type, nc[className]) )
                    g.add( (nr[ass], RDFS.label, Literal(ass, datatype=t)) )
            else:
                # b = BNode()
                value_pure = value
                if t == XSD.string:
                    value = '_'.join(value.translate(
                        str.maketrans('', '', string.punctuation)
                        ).title().split())
                g.add( (nr[newMammal], np[propertyName] , nr[value]) )
                g.add( (nr[value], RDF.type, nc[className]) )
                g.add( (nr[value], RDFS.label, Literal(value_pure, datatype=t)) )


# q = g.query(
#     'SELECT ?c1 ?c2 ?parentnode ?childnode ?parentcode ?childcode \
#     WHERE { \
#          ?parentnode a ?c1. \
#          ?c1 np:hasCode ?parentcode.\
#          ?childnode a ?c2. \
#          ?c2 np:hasCode ?childcode. \
#          ?c2 rdfs:subClassOf ?c1.\
#          FILTER STRSTARTS(?childcode, ?parentcode) \
#          FILTER (?childcode != ?parentcode) \
#     } LIMIT 10'
# )

# q = g.query(
#     'SELECT ?c ?code ?name ?cl ?subcl ?topcl\
#     WHERE { \
#         ?c np:hasCode ?code. \
#         ?c np:hasLabel ?name. \
#         ?c a ?cl. \
#         ?c rdfs:subClassOf/np:hasLabel ?subcl. \
#         ?c rdfs:subClassOf/rdfs:subClassOf ?topcl. \
#     } LIMIT 10'
# , initBindings = {'class': nc['Threat']})

# q = g.query(
#     'SELECT ?animalName ?threat ?threatType ?p ?o\
#     WHERE { \
#         ?animal np:hasScientificName ?animalName. \
#         ?animal ?class ?threat. \
#         ?threat a ?threatType. \
#         ?threatType ?p ?o.\
#     } ORDER BY ?animalName LIMIT 10 '
# , initBindings = {'class': np['hasHabitat']})

# for c in q:
#     print(*c)

g.serialize('iucn-full.ttl', format='turtle', encoding='unicode')

# for a,l,t in g.query('SELECT ?animal_label ?label ?threat_label WHERE \
#     { ?animal a nc:Mammal. \
#     ?animal np:hasCategory ?category. \
#     ?animal np:hasCommonName ?animal_label. \
#     ?animal np:hasThreat/np:hasTitle ?threat_label. \
#     ?category rdfs:label ?label. \
#     FILTER(?label = "EN" || ?label = "VU" || ?label = "CR") }'):
#     print(a,l,t)


