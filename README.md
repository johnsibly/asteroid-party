# asteroid-party

Mutliplayer asteroids game built using express and socket.io

## Setup

* `npm install`

## Usage

Run locally using 

`node asteroids.js`

Open [http://localhost:3000](http://localhost:3000) on your computer and use arrow keys to control your spaceship.

## Heroku deployment

To make accessable globally, below are instructions for running on Heroku
Make sure you have Heroku set up by following these steps https://devcenter.heroku.com/articles/getting-started-with-nodejs

### Creating for the first time

Then do
`heroku create`
or 
`heroku apps:create --region eu`

Scale up
`heroku ps:scale web=1`

Open the site 
`heroku open`

### Adding heroku remote for app already created (when this repo is cloned)

git remote add heroku https://git.heroku.com/asteroid-party.git

### Deploy updates to Heroku

git push heroku main

### Test on your desktop or mobile browser 

https://asteroid-party.herokuapp.com/

## Docker

Build image using

`docker build -t <your username>/asteroid-party .`

Run using 

`docker run -p 3000:3000 -d <your username>/asteroid-party`


