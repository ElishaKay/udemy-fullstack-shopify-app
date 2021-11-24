$http.get('${proxyRoute}/tags?email={{ customer.email }}&name={{ customer.name }}&hash={{ customer.email | append: 'somecrazyhash' | md5 }}')
               .success(function(data) {
                console.log('succesfully fetched tags data', data);
                document.getElementById('post-tags').innerHTML =
                        <p>Test</p>
          })
        .error(function(data) {
          console.log('Error: ' + data);
          
          });