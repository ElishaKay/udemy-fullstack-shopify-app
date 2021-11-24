// import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { list, removeBlog, toggleBlogVisibility } from '../../actions/blog';
import moment from 'moment';
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  Stack,
  TextField,
  SettingToggle,
  TextStyle,
  Link
} from '@shopify/polaris';

import withAppLayout from '../../components/with/app-layout'

const ManagePosts = (props) => {
    props = JSON.parse(JSON.stringify(props))
    // console.log('props in ManagePosts function: ',props);

    const [blogs, setBlogs] = useState([]);
    const [loaded, setLoaded] = useState({value: false});
    const [message, setMessage] = useState('');
    const [toggleValue, setToggleValue] = useState(true);
    const token = getCookie('token');

    useEffect(() => {
        loadBlogs();
    }, []);

    const hideShowBlog = slug => {
        console.log('ran hideShowBlog with this slug:', slug);
        toggleBlogVisibility(slug).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setMessage(data.message);
                console.log('data',data);
                loadBlogs();
            }
        });
    };

    const deleteBlog = slug => {
        removeBlog(slug, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setMessage(data.message);
                loadBlogs();
            }
        });
    };


    const loadBlogs = () => {
        list(props).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log('blog array after updating: ',data);
                setBlogs(data);
                setLoaded(true);
            }
        });
    };

    
    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure you want to delete this post?');
        if (answer) {
            deleteBlog(slug);
        }
    };

    const showUpdateButton = blog => {
        if (isAuth() && isAuth().role === 0) {
            return (
                <Link href={`/user/crud/${blog.slug}`}>
                    <a className="ml-2 btn btn-sm btn-warning">Update</a>
                </Link>
            );
        } else if (isAuth() && isAuth().role === 1) {
            return (
                <Link href={`/admin/crud/${blog.slug}`}>
                    <a className="ml-2 btn btn-sm btn-warning">Update</a>
                </Link>
            );
        }
    };

    const showAllBlogs = () => {
        // const contentStatus = enabled ? 'Disable' : 'Enable';
        // const textStatus = enabled ? 'enabled' : 'disabled';

        return blogs.map((blog, i) => {
            return (
                <React.Fragment>
                    <SettingToggle
                        key={i}
                        action={{
                          content: blog.hidden ? 'Make Public': 'Make Hidden',
                          onAction: hideShowBlog.bind(null, blog.slug)
                          // onAction: hideShowBlog(blog.slug)

                        }}
                        hidden={blog.hidden}
                      >
                        <h3>{blog.title}</h3>

                        <p className="mark">
                            Written by {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()}
                        </p>
                        {showUpdateButton(blog)}
                        This post is{' '}
                        <TextStyle variation="strong">{blog.hidden ? 'hidden': 'public'}</TextStyle>.
                        <ButtonGroup segmented={true} fullWidth={false} connectedTop={true}>
                          <Button primary url={`/app/blog/${blog.slug}`}>
                                   Review   
                          </Button>
                          <Button onClick={() => deleteConfirm(blog.slug)}>Delete</Button>
                        </ButtonGroup>
                    </SettingToggle>
                </React.Fragment>
            );
        });
    };

    return (
        <Page>
            <Layout>
                <div className="row">
                    <div className="col-md-12">
                        {message && <div className="alert alert-warning">{message}</div>}

                        {loaded && blogs.length == 0
                            ? <p>Loading</p>
                            : <div className="row">
                                    <Layout.AnnotatedSection
                                        title="Manage Posts"
                                        description="Review new posts and set approved content live."
                                      >
                                        {showAllBlogs()}
                                    </Layout.AnnotatedSection>
                              </div>
                      }
                    </div>
                </div>
            </Layout>
        </Page>
    );
};

export default
    withAppLayout(
      ManagePosts);