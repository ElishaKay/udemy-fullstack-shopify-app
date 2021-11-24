exports.userSlug = ({user, blogs}) => {
    const proxyRoute = '/apps/tribe';

    const showUserBlogs = () => {
        return blogs.map((blog, i) => `           
            <div class="mt-4 mb-4" key={i}>
                <a href="${proxyRoute}/blog/${blog.slug}">
                    <span class="lead">${blog.title}</a>
                </a>
            </div>
        `).join('');
    };

    return `
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css" integrity="sha384-cg6SkqEOCV1NbJoCu11+bm0NvBRc8IYLRGXkmNrqUBfTjmMYwNKPWBTIKyw9mHNJ" crossorigin="anonymous">
        <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-8">
                                              <h5>${user.name}</h5>
                                              <img src='${user.cover_photo ? user.cover_photo : 'https://mysteryshopperblog.files.wordpress.com/2014/07/mystery-shopper-image.gif'}'
                                                   alt="Profile Picture" class="img-responsive img-rounded">
                                        </div>
                                        <div class="col-md-4">
                                         
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div class="container pb-5">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-white">
                                        Recent blogs by ${user.name}
                                    </h5>

                                    ${showUserBlogs()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        <script>
            console.log('injected script from server ran');
        </script>`
};