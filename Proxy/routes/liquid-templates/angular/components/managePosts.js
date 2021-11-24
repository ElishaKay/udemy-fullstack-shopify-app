module.exports.managePosts = (user) => {
  console.log('user in managePosts function:', user);
  // const { listByUser } = require('../../../proxy-controllers/blog'); 
  
  return `
      <div id='new-post' ng-controller='managePostsController'>
          <div id='error-message' class='text-center'>
            <h3 >Manage Posts</h3>
          </div>
          <div id='user-posts'></div>
      </div>`
};

module.exports.managePostsJS = (user) => {
  let proxyRoute = '/apps/tribe';
  console.log('ran managePostsJS function');
  const displayPosts = (data) => data.map((blog, i) => {
      let proxyRoute = '/apps/tribe';
      return `<div key=${i} class="pb-5">
                  <a href='${proxyRoute}/blog/${blog.slug}'><h3>${blog.title}</h3></a>
                  <p class="mark">
                      Written by ${blog.postedBy.name} | Published on ${blog.updatedAt.split('T')[0]}
                  </p>
                  <button class="btn btn-sm btn-danger"}>
                      Delete
                  </button>
              </div>
      `;
  }).join(' ')
  
  return `
    tribeApp.controller('managePostsController', function($scope, $http) {
      console.log('managePosts function ran');
      
      $scope.displayPosts = ${displayPosts};

      $http.get('${proxyRoute}/${user.username}/blogs?email={{ customer.email }}&name={{ customer.name }}&hash={{ customer.email | append: 'somecrazyhash' | md5 }}')
             .success(function(data) {
              console.log('user post data: ', data);
              document.getElementById("user-posts").innerHTML = $scope.displayPosts(data);
        })
      .error(function(data) {
        console.log('Error: ' + data);
        document.getElementById("error-message").innerHTML =
         '<h3>'+data.error+'</h3>';
       });

    });
  `
}
