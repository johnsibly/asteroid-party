# asteroid-party

Mutliplayer asteroids game building using express and socket.io

## Setup

* `npm install`
* `node asteroids.js`

## Heroku deployment

In addition to running this locally, I was keen to make accessable accross the internet, so ran on Heroku.
Make sure you have Heroku set up by following there steps on https://devcenter.heroku.com/articles/getting-started-with-nodejs

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

## Usage

Open [http://localhost:3000](http://localhost:3000) on your computer and use arrow keys to control your spaceship.

