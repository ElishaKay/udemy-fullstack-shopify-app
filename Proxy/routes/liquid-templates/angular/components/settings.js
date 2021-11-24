const proxyRoute = '/apps/tribe';

module.exports.settings = (user) => {
  console.log('user in settings view', user);

  const makeTitle = (slug) => {
    let title = slug ? slug.split('//')[1].split('.')[0] : '';

    if(title.includes('-')){
      let words = title.split('-');
      for (var i = 0; i < words.length; i++) {
        let word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
      }

      return words.join(' '); 
    }

    let capitalizedTitle = title ? title.charAt(0).toUpperCase() + title.slice(1) : '';

    return capitalizedTitle;
  }

  function formatQuotes(str){
   var reg = /"/g;
   var newstr = `\\"`;
   str = str.replace(reg,newstr);

   var reg2 = /'/g;
   newstr = "\\'"
   return  str.replace(reg2,newstr);
  }

  return `
      <div>
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
              <div id='profile-photo'>${user.cover_photo ? "<img id='the-profile-img' src='"+user.cover_photo+"' ng-model='formData.cover_photo'/>" : ''}</div>
            </div>

            <div class='form-group'>
                <label class='text-muted'>Name</label>
                <input type='text' value='${formatQuotes(user.name)}' class='form-control' ng-model='formData.name'/>
            </div>
            <div class='form-group'>
                <label class='text-muted'>Favorite Things About ${makeTitle(user.profile)}</label>
                <input type='text' value='${formatQuotes(user.storeFavorites)}' class='form-control' ng-model='formData.storeFavorites'/>
            </div>
            <div class='form-group'>
                <label class='text-muted'>About</label>
                <textarea type='text' value='${formatQuotes(user.about)}' class='form-control' ng-model='formData.about'/></textarea>
            </div>
            <div>
              <button ng-click='updateProfileDetails(formData)' class='btn btn-primary'>
                  Update
              </button>
            </div>
      </div>`
};

module.exports.settingsJS = (user) => {
  function formatQuotes(str){
   var reg = /"/g;
   var newstr = `\\"`;
   str = str.replace(reg,newstr);

   var reg2 = /'/g;
   newstr = "\\'"
   return  str.replace(reg2,newstr);
  }

  return `
    tribeApp.controller('settingsController', function($scope, $http) {
        console.log('settingsController function ran');
        
        $scope.getProfileURL = function(){        
          $http.get('${proxyRoute}/get-profile-photo?email={{ customer.email }}&name={{ customer.name }}&hash={{ customer.email | append: 'somecrazyhash' | md5 }}')
          .success(function(data) {
                   let currentImg = document.getElementById('the-profile-img').src;
                  if(currentImg!=data.src){
                      document.getElementById('profile-photo').innerHTML =
                      '<img src='+data.src+'/>';
                    }
                  })
                .error(function(data) {
                  console.log('Error: ' + data);
                    document.getElementById('error-message').innerHTML =
                   '<h3 style="color:red;">'+data.error+'</h3>';  
                 })
        }

       $scope.clickedSettingsTab = function(){
         console.log('clickedSettingsTab');
         $scope.getProfileURL();
       }


        $scope.formData = {
          cover_photo: '${user.cover_photo}',
          name: '${formatQuotes(user.name)}',
          storeFavorites: '${formatQuotes(user.storeFavorites)}',
          about: '${formatQuotes(user.about)}'
        }
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
