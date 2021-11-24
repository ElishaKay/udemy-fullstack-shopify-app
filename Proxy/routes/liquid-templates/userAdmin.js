exports.userAdmin = (user, tags) => {
    const proxyRoute = '/apps/tribe';
    const { ngApp } = require('./angular/app.js');
 
    return `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.4-build.3588/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.26/angular-ui-router.min.js"></script>
    
    <script src='https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest'></script>
    <script src='https://cdn.jsdelivr.net/npm/@editorjs/header@latest'></script>
    <script src='https://cdn.jsdelivr.net/npm/@editorjs/simple-image@latest'></script>
    <script src='https://cdn.jsdelivr.net/npm/@editorjs/image@2.3.0'></script>
    <script src='https://cdn.jsdelivr.net/npm/@editorjs/list@1.4.0'></script>
    <script src='https://cdn.jsdelivr.net/npm/@editorjs/embed@2.2.1'></script>
    <script src='https://cdn.jsdelivr.net/g/filesaver.js'></script>

    <script>${ngApp(user, tags)}</script>

    <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' />
    <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css" integrity="sha384-cg6SkqEOCV1NbJoCu11+bm0NvBRc8IYLRGXkmNrqUBfTjmMYwNKPWBTIKyw9mHNJ" crossorigin="anonymous">
    <div class="container-fluid" ng-app="tribe" ng-controller='settingsController'>
        <div class="page-width">
            <div class="col-md-12 pt-5 pb-5">
                <h2>User Dashboard</h2>
            </div>
            <div class='row'>
              <div class="col-md-4">
                  <p>Welcome ${user.name}</p>   
                  <ul class="list-group">
                     <li class="list-group-item">
                        <a class='tag-btn pure-button pure-button-primary' ui-sref="create-new-post">Create New Post</a>
                     </li>

                      <li class="list-group-item">
                          <a class='tag-btn pure-button pure-button-primary' ui-sref="manage-posts">Manage Posts</a>
                      </li>

                      <li class="list-group-item">
                          <a class='tag-btn pure-button pure-button-primary' ng-click='clickedSettingsTab()' ui-sref="settings">Settings</a>
                      </li>

                      <li class="list-group-item">
                          <a class='tag-btn pure-button pure-button-primary' href="${proxyRoute}/blogs">Browse Tribe Chatter</a>
                      </li>
                  </ul>
              </div>
                  <ui-view class='col-md-8'></ui-view>
            </div>
        </div>
      </div>

    <style>
        .tag-btn { margin-top: 1em;
                  margin-bottom: 1em;
                  margin-right: 1em;
                  margin-left: 1em;
                  background-color: lightblue; }
        .tag-btn:hover {
          background-color: lightgreen;
        }
        .btn-default{
            color: #fff !important;
            text-transform: uppercase;
            text-decoration: none;
            background: #60a3bc;
            padding: 20px;
            border-radius: 50px;
            display: inline-block;
            border: none;
            transition: all 0.4s ease 0s;
        }
    </style>`
};