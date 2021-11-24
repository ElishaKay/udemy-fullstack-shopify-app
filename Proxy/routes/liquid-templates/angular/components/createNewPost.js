const proxyRoute = '/apps/tribe';

module.exports.createNewPost = (tags) => {
  
  const displayTags = (data) => data.map((tag, i) => {
      return `<label class='checkbox px-2'>                
                  <input type='checkbox' ng-model='tags.${tag.id}'><span class='px-1'>${tag.name}</span>
              </label>
      `;
  }).join(' ')

  return `
      <div id='new-post' ng-controller='newPostController'>
          <div id='error-message' class='text-center'>
            <h3>Create New Post</h3>
          </div>
          <div class='form-group'>
            <label for='titleip'>Title:</label>
            <input
              ng-model='title'
              type='text'
              class='form-control'
              id='titleip'
              name='titleip'
              placeholder='Enter your awesome blog title'
              required
            />
          </div>
          <small>Write your awesome post below: (to embed videos, simply copy-paste any YouTube URL)</small>
          <div id='editorjs'></div>
          
          <form class='form-inline' id='post-tags'>
            ${displayTags(tags)}
          </form>
            
          <small>When you're all done, press 'Save'. Doesn't have to be perfect 😉</small>

           <div class='modal-footer'>
              <button type='submit' class='btn btn-primary btn-lg' data-dismiss='modal' aria-hidden='true' 
                ng-click='submitBlogPost({title: title})'>Save Post</button>
            </div> 
          <p id='json'></p>
      </div>`
};

module.exports.createNewPostJS = (tags) => {
  var tagsModel = {};
  tags.forEach( function(item){ 
     tagsModel[item.id] = false; 
  });
  console.log('tags obj: ', tagsModel);

  return `
    tribeApp.controller('newPostController', function($scope, $http) {
      console.log('newPostController function ran');
      
      // Checkbox logic 
       $scope.tags = {};

      //Loading Editor.js with all its configuration
      const editor = new EditorJS({
        autofocus: true,
        tools: {
          header: Header,
          image: {
              class: ImageTool,
              config: {
                endpoints: {
                  byFile: '${proxyRoute}/upload?email={{ customer.email }}&name={{ customer.name }}&hash={{ customer.email | append: 'somecrazyhash' | md5 }}', // Your backend file uploader endpoint
                  byUrl: '${proxyRoute}/upload-image-url', // Your endpoint that provides uploading by Url
                }
              }
            },
          embed: Embed,
          list: {
            class: List,
            inlineToolbar: true,
          },
        },
      });

      $scope.submitBlogPost = function(title){
        editor
            .save()
            .then((body) => {
              
              console.log('save button clicked');
              console.log('Tags data:', $scope.tags);
              let tagIDs = [];
              for (var prop in $scope.tags) {
                  if (Object.prototype.hasOwnProperty.call($scope.tags, prop)) {
                      tagIDs.push(prop)
                  }
              }
              
              const data = { title, body, tags: tagIDs };

              $http.post('${proxyRoute}/user/blog?email={{ customer.email }}&name={{ customer.name }}&hash={{ customer.email | append: 'somecrazyhash' | md5 }}', data)
                     .success(function(data) {
                      document.getElementById('new-post').innerHTML =
                        '<h3>'+data.message+'</h3>';
                      delete $scope.title;    
                })
              .error(function(data) {
                console.log('Error: ' + data);
                document.getElementById('error-message').innerHTML =
                 '<h3 style="color:red;">'+data.error+'</h3>';
               });
            })
            .catch((err) => {
              console.log(err);
            });
      }
    });
  `
}
