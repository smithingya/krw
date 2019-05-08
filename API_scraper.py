import json
import requests
import time

api_endpoint = 'http://apiv3.iucnredlist.org/api/v3/'
token ='?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee'

# get all the species
try:
    with open("species.json", "r") as read_file:
        print("Loading species from file.")
        species = json.load(read_file)
except:
    print("Retrieving species from API...")
    api_request = 'species/page/'
    pagination = 0
    species = []
    retrieved_all = False
    while not retrieved_all:
        print(f'    page {pagination}')
        url = api_endpoint + api_request + str(pagination) + token
        species_response = requests.get(url=url).json()
        species.extend(species_response['result'])
        if species_response['count'] < 10000:
            retrieved_all = True
            print("All retrieved.")
        pagination += 1
        # sleep to not over query the api and be locked out
        time.sleep(0.5)
    with open('species.json', 'w') as fout:
        j = json.dumps(species, indent=4)
        print(j, file=fout)
        print("Species written to file.")

try:
    with open("animals.json", "r") as read_file:
        print("Loading animals from file.")
        animals = json.load(read_file)
except:
    animals = [specie for specie in species if specie['kingdom_name'] == 'ANIMALIA']
    with open('animals.json', 'w') as fout:
        j = json.dumps(animals, indent=4)
        print(j, file=fout)
        print("Animals written to file.")

try:
    with open("mammals.json", "r") as read_file:
        print("Loading mammals from file.")
        mammals = json.load(read_file)
except:
    print("Retrieving all mammals...")
    api_request = 'comp-group/getspecies/mammals'
    url = api_endpoint + api_request + token
    mammals_result = requests.get(url=url).json()
    mammals = mammals_result['result']
    print(f"Mammals retrieved, {len(mammals)} in total.")
    print("Retrieving extensive information about the mammals...")
    skipped = []
    for i,animal in enumerate(mammals):
        taxonid = animal['taxonid']
        # general species information
        api_request = 'species/id/' + str(taxonid)
        url = api_endpoint + api_request + token
        animal_result = requests.get(url=url)
        try:
            animal_result = animal_result.json()
        except:
            print("Error in general information retrieval")
            print(taxonid)
            print(animal_result)
            skipped.append(taxonid)
            continue
        if len(animal_result['result']) < 1:
            print("Error in general information retrieval")
            print(taxonid)
            skipped.append(taxonid)
            continue
        animal.update(animal_result['result'][0])
        # countries
        api_request = 'species/countries/id/' + str(taxonid)
        url = api_endpoint + api_request + token
        animal_result = requests.get(url=url)
        try:
            animal_result = animal_result.json()
        except:
            print("Error in countries retrieval")
            print(taxonid)
            print(animal_result)
            skipped.append(taxonid)
            continue
        # threats
        api_request = 'threats/species/id/' + str(taxonid)
        url = api_endpoint + api_request + token
        animal_result = requests.get(url=url)
        try:
            animal_result = animal_result.json()
        except:
            print("Error in threat retrieval")
            print(taxonid)
            print(animal_result)
            skipped.append(taxonid)
            continue
        animal['threats'] = animal_result['result']
        # habitats
        api_request = 'habitats/species/id/' + str(taxonid)
        url = api_endpoint + api_request + token
        animal_result = requests.get(url=url).json()
        animal['habitats'] = animal_result['result']
        # measures
        api_request = 'measures/species/id/' + str(taxonid)
        url = api_endpoint + api_request + token
        animal_result = requests.get(url=url)
        try:
            animal_result = animal_result.json()
        except:
            print("Error in measures retrieval")
            print(taxonid)
            print(animal_result)
            skipped.append(taxonid)
            continue
        animal['measures'] = animal_result['result']
        time.sleep(0.1)
        if (i + 1) % 100 == 0:
            print(f"   {i + 1} mammals retrieved, {len(mammals)-(i + 1)} to go")
    with open('mammals.json', 'w') as fout:
        j = json.dumps(mammals, indent=4)
        print(j, file=fout)
        print("Mammals written to file.")

# for every animal in the api, retrieve all the different types of information
# for animal in animals:
#     taxonid = animal['taxonid']
#     # general species information
#     api_request = 'species/id/' + str(taxonid)
#     url = api_endpoint + api_request + token
#     animal_result = requests.get(url=url).json()
#     animal.update(animal_result['result'][0])
#     # threats
#     api_request = 'threats/species/id/' + str(taxonid)
#     url = api_endpoint + api_request + token
#     animal_result = requests.get(url=url).json()
#     animal['threats'] = animal_result['result']
#     # habitats
#     api_request = 'habitats/species/id/' + str(taxonid)
#     url = api_endpoint + api_request + token
#     animal_result = requests.get(url=url).json()
#     animal['habitats'] = animal_result['result']
#     # measures
#     api_request = 'measures/species/id/' + str(taxonid)
#     url = api_endpoint + api_request + token
#     animal_result = requests.get(url=url).json()
#     animal['measures'] = animal_result['result']
# with open('animals-full.json', 'w') as fout:
#     json.dump(animals, fout)
#     print("Animals written to file.")

# # convert the knowledge into triples
# for animal in knowledge:
#     speciesKnowledge = knowledge[animal]
#     triples = [animal,key,value for key,value in speciesKnowledge.items()]
#     # write triples to file, append!
#     for s,p,o in triples:
#         # write s,p,o to file

# after file writing, convert to RDF with COW
