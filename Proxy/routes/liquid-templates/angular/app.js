module.exports.ngApp = (user, tags) => {
  const proxyRoute = '/apps/tribe';
  const { createNewPost, createNewPostJS } = require('./components/createNewPost.js');
  const { managePosts, managePostsJS } = require('./components/managePosts.js');
  const { settings, settingsJS } = require('./components/settings.js');
  
  return ` 
    var tribeApp = angular.module('tribe', ['ui.router']);

    ${createNewPostJS(tags)}
    ${settingsJS(user)}
    ${managePostsJS(user)}

    tribeApp.config(function($stateProvider, $urlRouterProvider) {
      
      let createNewPostState = {
        name: 'create-new-post',
        url: '/create-new-post',
        template: "${createNewPost(tags).replace(/(\r\n|\n|\r|\t)/gm,"").trim()}"
      }

      let managePostsState = {
        name: 'manage-posts',
        url: '/manage-posts',
        template: "${managePosts().replace(/(\r\n|\n|\r|\t)/gm,"").trim()}"
      }

      let settingsState = {
        name: 'settings',
        url: '/settings',
        template: "${settings(user).replace(/(\r\n|\n|\r|\t)/gm,"").trim()}"
      }

      $stateProvider.state(createNewPostState);
      $stateProvider.state(managePostsState);
      $stateProvider.state(settingsState);

      $urlRouterProvider.otherwise('create-new-post')
    });`
}
