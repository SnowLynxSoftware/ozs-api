# VistaTable API Project
The Official OpenZooSim API project.

### Setup Developer Environment

Pre-reqs:
   - NodeJS v20 LTS

NOTE: # After doing the .env step--you will need to fill out the values in the 
.env file before starting the app! The .env file explains what each property is for.
```shell
# Setup your local .env file
cp .env.example .env

# OPTIONAL: You can run this helper command to generate secure app keys and JWT Secrets.
npm run app-key:generate

# Install Dependencies
npm ci

# Run the DB Migrations against your DB
npm run migration:run

# Start the application in DEV mode.
npm start
```

### Building the docker image locally
Our official build server will host private versions in our repository for the docker image
that we use for the official games. However, if you want to build a docker image locally
for testing purposes, to host in your own repository, etc---you can do so like this:

```shell
docker build -t openzoosim/ozs-api:latest .
```

NOTE: That you will be responsible for figuring out how to load Environment Variables in your own version!
You should be able to set the same properties that the `.env` file has, but by default the DOCKERFILE will not 
include the `.env` in the build and the Official Source Code will not allow loading a DOTENV file while running
in PRODUCTION mode anyway.

### Google Cloud

We host our API on Google Cloud as an application deployed
from a docker image to Google Cloud Run. The docker image
is created and uploaded to the Google Artifact Registry.
When a new image is uploaded with specific tags, the Google 
Cloud Run instance gets updated with the new docker image automatically.

All CI/CD is facilitated through Google Cloud Build.

