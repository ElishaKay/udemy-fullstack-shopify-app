import React, {useCallback, useState} from 'react';
import {Button, Modal, TextContainer, Form, FormLayout, TextField} from '@shopify/polaris';

export default function ModalExample(props) {
  console.log('props in Modal Example: ',props);

  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);

//input logic
  const [newsletter, setNewsletter] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = useCallback((_event) => {
    setEmail('');
    setNewsletter(false);
  }, []);

  const handleEmailChange = useCallback((value) => setEmail(value), []);

  return (
    <div>
      <Button primary onClick={handleChange}>Add Promoted Products</Button>
      <Modal
        open={active}
        onClose={handleChange}
        title={`Choose Products`}
        primaryAction={{
          content: 'Send Feedback',
          onAction: handleChange,
        }}
        secondaryActions={[
          {
            content: 'Learn more',
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
                 Choose the Products which are related to the given post.
            </p>
             <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  multiline={5}
                  value={email}
                  onChange={handleEmailChange}
                  label=""
                  type="text"
                  helpText={
                    <span>
                       These products will be listed alongside the blog post in the public page.
                    </span>
                  }
                />

                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
}

