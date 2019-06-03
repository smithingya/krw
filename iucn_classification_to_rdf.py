import csv
import rdflib
from rdflib import URIRef, BNode, Literal
from rdflib import Namespace, Graph
from rdflib.namespace import RDF, FOAF, XSD, RDFS, SKOS

with open('threats.csv', 'r') as f:
    threats = []
    rows = csv.reader(f)
    for row in rows:
        threats.append(row)

with open('habitats.csv', 'r') as f:
    habitats = []
    rows = csv.reader(f)
    for row in rows:
        habitats.append(row)

with open('measures.csv', 'r') as f:
    measures = []
    rows = csv.reader(f)
    for row in rows:
        measures.append(row)

nc = Namespace("http://iucn-knowledge-graph.org/class/")
np = Namespace("http://iucn-knowledge-graph.org/property/")
nr = Namespace("http://iucn-knowledge-graph.org/resource/")
g = Graph()
g.bind('nc', nc)
g.bind('np', np)
g.bind('nr', nr)

g.add((nc['Threat'], RDF.type, FOAF.Class))
g.add((nc['Habitat'], RDF.type, FOAF.Class))
g.add((nc['Measure'], RDF.type, FOAF.Class))

def addRows(rows, cl):
    for row in rows:
        code, label = row
        if label == '':
            continue
        label = label.strip()
        b = BNode()
        g.add( (nr[b], RDF.type, nc[cl]) )
        g.add( (nr[b], np['hasCode'], Literal(code, datatype = XSD.string)) )
        g.add( (nr[b], np['hasLabel'], Literal(label, datatype = XSD.string)) )
        if len(code) > 3: # two digit number with a dot
            top_level = '.'.join(code.split('.')[:-2]+[''])
            t = Literal(top_level, datatype = XSD.string)
            q = g.query(
                'SELECT ?n \
                WHERE { \
                    ?n np:hasCode ?top_level. \
                    ?n np:hasLabel ?label. \
                    ?n a ?class \
                }'
            , initBindings = {'top_level': t, 'class': nc[cl]})
            for c in q:
                g.add( (c[0], SKOS.narrower, nr[b]) )
                g.add( (nr[b], SKOS.broader, c[0]) )

addRows(threats, 'Threat')
addRows(habitats, 'Habitat')
addRows(measures, 'Measure')

g.serialize('classifications.ttl', format='turtle')
