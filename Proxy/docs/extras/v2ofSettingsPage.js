const proxyRoute = '/apps/tribe';

module.exports.settings = (user) => {
  console.log('user in settings view', user);

  return `
      <div ng-controller='settingsController'>
          <div id='error-message' class='text-center'>
            <h3>Settings</h3>
          </div>
          <div id='message'></div>
            <div class='form-group'>
                <form action='/upload' method='POST' enctype='multipart/form-data'>
                  <label class='btn btn-outline-info'>
                      Profile photo
                      <input type='file' name='image' accept='image/*' hidden onchange='angular.element(this).scope().uploadFile(this.files)'/>
                  </label>
                </form>
            </div>

            <div class='form-group'>
                <div id='profile-photo'>${user.cover_photo ? "<img src='"+user.cover_photo+"' ng-model='formData.cover_photo'/>" : ''}</div>
              </div>

            <div id='user-settings'>
            </div

            <div>
              <button ng-click='updateProfileDetails(formData)' class='btn btn-primary'>
                  Update
              </button>
            </div>
      </div>`
};

module.exports.settingsJS = (user) => {
  let proxyRoute = '/apps/tribe';
  console.log('ran settingsJS function');

  const displaySettings = (data) => {
      console.log('data in displaySettings function', data);
      let proxyRoute = '/apps/tribe';
      return `
            <div class='form-group'>
                <label class='text-muted'>Name</label>
                <input type='text' value='${data.name}' class='form-control' ng-model='$scope.formData.name'/>
            </div>
            <div class='form-group'>
                <label class='text-muted'>Favorite Things About '${data.profile.split('.')[0]}'</label>
                <input type='text' value='${data.storeFavorites}'' class='form-control' ng-model='formData.storeFavorites'/>
            </div>
            <div class='form-group'>
                <label class='text-muted'>About</label>
                <textarea type='text' value="${data.about}" class='form-control' ng-model='formData.about'/></textarea>
            </div>
      `;
  }

  return `
    tribeApp.controller('settingsController', function($scope, $http) {
        console.log('settingsController function ran');
        $scope.formData = {};
        $scope.displaySettings = ${displaySettings};

        $http.get('${proxyRoute}/user/settings?email={{ customer.email }}&name={{ customer.name }}&hash={{ customer.email | append: 'somecrazyhash' | md5 }}')
               .success(function(data) {
                console.log('user settings data: ', data);
                 $scope.formData = {
                    username: data.username,
                    name: data.name,
                    storeFavorites: data.storeFavorites,
                    about: data.about
                  }
                document.getElementById("user-settings").innerHTML = $scope.displaySettings(data);
          })
        .error(function(data) {
          console.log('Error: ' + data);
          document.getElementById("error-message").innerHTML =
           '<h3>'+data.error+'</h3>';
         });

        $scope.uploadFile = function(files) {
            console.log('ran upload file function with files:',files)
            var fd = new FormData();
            //Take the first selected file
            fd.append('file', files[0]);

            $http.post('${proxyRoute}/upload-profile-photo?email={{ customer.email }}&name={{ customer.name }}&hash={{ customer.email | append: 'somecrazyhash' | md5 }}', fd, {
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(data) {
                       $scope.formData.cover_photo = data.file.url;
                      document.getElementById('profile-photo').innerHTML =
                        '<img src='+data.file.url+'/>';   
                })
              .error(function(data) {
                console.log('Error: ' + data);
                document.getElementById('error-message').innerHTML =
                 '<h3 style="color:red;">'+data.error+'</h3>';
               });
        };

        $scope.updateProfileDetails = function(formData){
          console.log('formData: ', formData);

          $http.put(
            '${proxyRoute}/user/update?email={{ customer.email }}&name={{ customer.name }}&hash={{ customer.email | append: 'somecrazyhash' | md5 }}', 
            formData).success(function(data) {
                document.getElementById('message').innerHTML =
                  '<p>Profile Updated Successfully</p>'   
          })
            .error(function(data) {
              console.log('Error: ' + data);
              document.getElementById('error-message').innerHTML =
               '<h3 style="color:red;">'+data.error+'</h3>';
             });
        }
      
      });
  `
}
