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

def addRows(rows, cl, pr=False):
    g.add((nc[cl], RDF.type, FOAF.Class))
    for row in rows:
        if pr:
            print(row)
        code, label = row
        if label == '':
            continue
        label = label.strip()
        # b = BNode()
        b = cl + '#' + code[:-1]
        g.add( (nc[b], RDF.type, FOAF.Class) )
        g.add( (nc[b], np['hasCode'], Literal(code[:-1], datatype = XSD.string)) )
        g.add( (nc[b], np['hasLabel'], Literal(label, datatype = XSD.string)) )
        g.add( (nc[b], RDFS.subClassOf, nc[cl]) )
        if len(code) > 3: # two digit number with a dot
            top_level = '.'.join(code.split('.')[:-2])
            tl = cl + '#' + top_level
            g.add( (nc[b], RDFS.subClassOf, nc[tl]) )
            # t = Literal(top_level, datatype = XSD.string)
            # q = g.query(
            #     'SELECT ?n \
            #     WHERE { \
            #         ?n np:hasCode ?top_level. \
            #         ?n np:hasLabel ?label. \
            #         ?n rdfs:subClassOf ?class \
            #     }'
            # , initBindings = {'top_level': t, 'class': nc[cl]})
            # for c in q:
            #     g.add( (nc[b], RDFS.subClassOf, c[0]) )

addRows(threats, 'Threat')
addRows(habitats, 'Habitat')
addRows(measures, 'Measure')

g.serialize('classifications.ttl', format='turtle')
