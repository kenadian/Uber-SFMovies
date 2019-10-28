<img src="http://sfmapproject.s3-website.ca-central-1.amazonaws.com/images/splash.jpg" alt="San Francisco" width="400px" />

# San Francisco Movie Locations

The task was to create an application that displays on a map the location of movies filmed in San Francisco.

## Demonstrated Proficiencies

- Javascript Array's, Objects, and control structures
- consuming an API
- IndexedDB usage
- Using cookies
- ES6 functional programming
- Using Promises
- function composition
- Git
- Implementing [Material UI V3](https://v3.material-ui.com) for UI Elements
- [React](https://reactjs.org)
- Using React Components
- Improving render performance with PureComponent.
- Using [Redux](https://redux.js.org) to manage the application state
- [Axios](https://github.com/axios/axios) provides an easy to use wrapper for XMLHttpRequest. Used in place of raw XMLHttpRequest or the fetch api.
- [Google's Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/reference)
- [Socrata data platform](https://www.tylertech.com/products/socrata)
  and a whole lot more.

## Live Demo

You can check out a live version [here].(http://sfmapproject.s3-website.ca-central-1.amazonaws.com)

This is currently meant only as a desktop app.

## Install

    $ git clone https://github.com/kenadian/Uber-SFMovies.git
    $ cd Uber-SFMovies
    $ npm install

## Configure app

You will need to supply your own Google Maps Javascript API key. Instructions on how to obtain your key can be [found here](https://developers.google.com/maps/documentation/javascript/get-api-key).

Create a file called .env.production at the project root containing a REACT environment variable like this:

    REACT_APP_MAPS_API_KEY=YOUR API KEY

Add this file to your gitignore file before publishing your project to a repository like github.

## Start the app and explore locally

    $ npm start

## Simple build for production

    $ npm run build

## Tests

I haven't included any tests in this project.

## Authors

- **Ken Hare** - _Initial work_

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
