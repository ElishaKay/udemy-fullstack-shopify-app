exports.blogSlug = (blog) => {
    console.log('blog object in blog slug:',blog)
    const proxyRoute = '/apps/tribe';
    
    const showAllTags = () => {
        return blog.tags.map((t, i) => `
            <a href="${proxyRoute}/tags/${t.slug}" key=${i}>
                <button class="btn btn-outline-primary mr-1 ml-1 mt-3">${t.name}</a>
            </a>
        `).join('');
    };

    const showBlogContent = (blog) => {
        return `
            <div>${blog.body[0].blocks ? 
               blog.body[0].blocks.map((block, i) => {
                    switch(block.type) {
                        case 'paragraph':
                            return `<br/><p>${block.data.text}</p>`
                            break;
                        case 'image':
                            return `<br/><img src='${block.data.file.url}'/>
                                    <h6>${block.data.caption}</h6>`
                            break;
                        case 'header':
                            return `<br/><br/><h2>${block.data.text}</h2>`
                            break;
                        case 'list':
                            return `<br/><ol>
                                        ${block.data.items.map((item, i) => {
                                            return '<li>'+item+'</li>'
                                        }).join('')}
                                    </ol>`
                            break;
                        case 'embed':
                            return `<iframe width='100%' 
                                        height='540' 
                                        src='${block.data.embed}' 
                                        frameborder="0" 
                                        allow="accelerometer; 
                                        autoplay; 
                                        encrypted-media; 
                                        gyroscope; 
                                        picture-in-picture" 
                                        allowfullscreen>
                                    </iframe>
                                    <h6>${block.data.caption}</h6>`
                        default:
                            return `<p>${block}</p>`
                        }
               }).join('') 
             : ''}
            </div>
        `
    }

    return `
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css" integrity="sha384-cg6SkqEOCV1NbJoCu11+bm0NvBRc8IYLRGXkmNrqUBfTjmMYwNKPWBTIKyw9mHNJ" crossorigin="anonymous">
               
        <div class="row">
            <div class="text-center details col-md-1">
            </div>
            <div class="text-center details col-md-3">
                <div class="pb-5">
                    ${showAllTags()}
                </div>
                <h3 class="product-title">${blog.title}</h3>
                
                <p>Posted By</p>
                ${blog.postedBy.cover_photo ? "<img src='"+blog.postedBy.cover_photo+"'/>" : ''}

                <div class="action">
                    <a href="${proxyRoute}/user/${blog.postedBy.username}" class="btn btn-default">${blog.postedBy.name}</a>
                </div>
            </div>

            <div class="col-md-6">
                ${showBlogContent(blog)}      
            </div>
        </div>

        <script>
            console.log('injected script from server ran');
        </script>`
};