exports.blogsList = ({ blogs, categories, tags, size }) => {
    const proxyRoute = '/apps/tribe';
    
    const showLoadedBlogs = () => {
        return blogs.map((blog, i) => `
                <div class="pure-u-1">
                    <div class="l-box community-card">
                        <div class="community-author">Posted by ${blog.postedBy.username}</div>
                        <h3><a href="${proxyRoute}/blog/${blog.slug}">${blog.title}</a></h3>
                        Image Goes Here
                        <p>${blog.mdesc}</p>
                        <div class="community-card-comments">3 comments</div>
                     </div>
                </div>
            `).join('');
    };

    const showAllCategories = () => {
        return categories.map((c, i) => `
            <a href="${proxyRoute}/categories/${c.slug}"} key=${i}>
                <button class="pure-button pure-button-primary">${c.name}</a>
            </a>
        `).join('');
    };

     const showAllTags = () => {
        return tags.map((t, i) => `
            <a href="${proxyRoute}/tags/${t.slug}" key=${i}>
                <button class="tag-btn pure-button pure-button-primary">${t.name}</a>
            </a>
        `).join('');
    };

    return `
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css" integrity="sha384-cg6SkqEOCV1NbJoCu11+bm0NvBRc8IYLRGXkmNrqUBfTjmMYwNKPWBTIKyw9mHNJ" crossorigin="anonymous">
        <header class="community-header">
            <div class="community-header-title">
                <div class="page-width community-header-title-box">
                    <img src="https://styles.redditmedia.com/t5_2qiuc/styles/communityIcon_s6mblzvh8t051.png?width=256&s=851a80f05e1194ee216a999370fe45bdfd2b5010" class="community-icon" />
                    <div class="community-h2">Home Improvement Community</div>
                </div>
            </div>
        </header>
        <div class="community-background">
            <main class="page-width">
                <div class="pure-g">
                    <div class="pure-u-2-3">
                        <div class="community-pad-20">
                            <div class="community-card">
                                <div class="community-card-body">
                                    <input type="text" class="community-instant-post" placeholder="Create Post" />
                                </div>
                            </div>
                            <div class="pure-g">${showLoadedBlogs()}</div>
                        </div>
                    </div>
                    <div class="pure-u-1-3">
                        <div class="community-pad-20">
                            <div class="community-card">
                                <div class="community-card-header">About Community</div>
                                <div class="community-card-body">Welcome to the home improvement community page! Share your creations with fellow builders, and get inspired for new projects.
                                <hr class="community-hr" />
                                <button class="pure-button pure-button-primary community-full-width">CREATE POST</button>
                                </div>
                            </div>
                            <div class="community-card">
                                <div class="community-card-header">Choose a Channel</div>
                                <div class="community-card-body">
                                    ${showAllTags()}
                                </div>
                            </div>
                            <div class="community-card">
                                <div class="community-card-header">Community Rules</div>
                                <div class="community-card-body">
                                    <ol>
                                        <li><strong>Be respectful</strong><br />Treat others how you'd like to be treated!</li>
                                        <hr class="community-hr-minimal" />
                                        <li><strong>No ads</strong><br />This is an ad-free zone</li>
                                        <hr class="community-hr-minimal" />
                                        <li><strong>Keepin it clean</strong><br />Use nice words only :)</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        <script>
            console.log('injected script from server ran');
        </script>
        <style type="text/css">
            .community-background { background-color: #edeff1;padding-top:20px; }
            .l-box { padding:1em; }
            .tag-btn { margin-top: 1em;
                      margin-bottom: 1em;
                      margin-right: 1em;
                      margin-left: 1em;
                      background-color: lightblue; }
            .tag-btn:hover {
              background-color: lightgreen;
            }
            .community-icon { border:4px solid #fff;border-radius:100%;max-width:75px;margin-top:-10px; }
            .community-header { background-image: url("https://previews.123rf.com/images/donatas1205/donatas12051202/donatas1205120200008/12455190-carpentry-construction-tools-home-improvement-background-.jpg");padding-top:120px;margin-top:-55px }
            .community-header-title { background:#fff; }
            .community-header-title-box { display:flex }
            .community-header-title .community-h2 { display:inline-block;margin-left:20px;font-size:30px;font-weight:bold;color:#000;padding-top:10px; }
            .community-card { border:1px solid #ccc;border-radius:4px;margin-bottom:20px;background:#fff }
            .community-card-header { background:darkblue;color:white;padding:10px;font-weight:bold; }
            .community-card-body { padding:10px }
            .community-pad-20 { padding:10px 20px 20px 20px }
            .community-hr { margin:20px 0 }
            .community-hr-minimal { margin:8px 0 }
            .community-full-width { width: 100% }
            .community-instant-post { width:100%;border:1px solid #edeff1; background: #f6f7f8;padding:10px }
            .community-instant-post:hover, .community-instant-post:focus { background:#fff }
            .community-author { color:#969696;font-size:12px;margin-bottom:5px }
            .community-card h3 { font-size:20px;margin-bottom:8px }
            .community-card p { margin-bottom:8px }
            .community-card-comments { font-size:12px;font-weight:bold; }
        </style>
        `
};