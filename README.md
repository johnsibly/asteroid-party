# asteroid-party

Mutliplayer asteroids game building using express and socket.io

## Setup

* `npm install`
* `node index.js`

## Heroku deployment

In addition to running this locally, I was keen to make accessable accross the internet, so ran on Heroku.

Do do this assuming you have heroku set up (otherwise follow locally https://devcenter.heroku.com/articles/getting-started-with-nodejs)

`heroku create`
or 
`heroku apps:create --region eu`

Scale up
`heroku ps:scale web=1`

Open the site 
`heroku open`

## Usage

Open [http://localhost:3000](http://localhost:3000) on your computer and use arrow keys to control your spaceship.

