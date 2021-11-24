import Tag from '../../components/blog/Tag';
import Link from 'next/link';
import withAppLayout from '../../components/with/app-layout'

import {
  Layout,
  Page,
} from '@shopify/polaris';

const ManageTags = (props) => {
    return (
    <Page>
        <Layout>    
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <Tag props={props}/>
                    </div>
                </div>
            </div>
         </Layout>
    </Page>
    );
};


export default
    withAppLayout(
      ManageTags);