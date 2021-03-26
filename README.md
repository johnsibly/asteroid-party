# asteroid-party

Mutliplayer asteroids game built using express and socket.io

## Setup

* `npm install`

## Usage

Run locally using 

`node asteroids.js`

Open [http://localhost:3000](http://localhost:3000) on your computer and use arrow keys to control your spaceship.

## Deployment options

### Heroku deployment

To make accessable globally, below are instructions for running on Heroku
Make sure you have Heroku set up by following these steps https://devcenter.heroku.com/articles/getting-started-with-nodejs

#### Creating for the first time

Then do
`heroku create`
or 
`heroku apps:create --region eu`

Scale up
`heroku ps:scale web=1`

Open the site 
`heroku open`

#### Adding heroku remote for app already created (when this repo is cloned)

`git remote add heroku https://git.heroku.com/asteroid-party.git`

#### Deploy updates to Heroku

`git push heroku main`

#### Test on your desktop or mobile browser 

https://asteroid-party.herokuapp.com/

### Docker

Build image using

`docker build -t <your username>/asteroid-party .`

Publish to a repository (e.g. dockerhub)

`docker push <your username>/asteroid-party`

Run using 

`docker run -p 3000:3000 -d <your username>/asteroid-party`

### Kubernetes

Assuming you have a cluster available and kubectl, run the following to deploy a single instance

```
kubectl create deployment asteroid-party --image=johnsibly/asteroid-party
kubectl expose deployment asteroid-party --port=3000 --type=NodePort --name=asteroid-party
```

After deploying `kubectl get services` shows that there is no external IP set so we need to specify this (change IP to that of your node)

`kubectl patch svc asteroid-party -p '{"spec":{"externalIPs":["192.168.10.53"]}}'`

Scale back down

`kubectl scale deploy asteroid-party --replicas=0`

