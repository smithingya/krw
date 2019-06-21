Knowledge representation on the web

Web App:
Install Node.js, React and Yarn (mostly likely installed with React).
Change to iucn folder and install dependecies by running 'yarn install'.
In the file graphDB.js, make sure it points to the local triplestore.

Triplestore:
Run GraphDB with options: -Dgraphdb.workbench.cors.enable=true
                          -Dgraphdb.workbench.cors.origin=*
Import complete_dataset.ttl.

Run Web App:
In the iucn folder, run yarn start. This should open up the web app in the browser.
