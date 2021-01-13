import React, { useState } from "react";
// prettier-ignore
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react'
import { API, graphqlOperation } from "aws-amplify";
import { createMarket } from "../graphql/mutations";

import { UserContext } from "../App";

const NewMarket = () => {
  const [marketD, marketDHandler] = useState(false);
  const [formData, formDataHandler] = useState({
    name: "",
    tags: ["Arts", "Tech", "Music", "Food"],
    selectedTags: [],
    options: [],
  });

  const handleAddMarket = async (user) => {
    try {
      marketDHandler(false);
      const input = {
        name: formData.name,
        owner: user.username,
        tags: formData.selectedTags,
      };
      const response = await API.graphql(
        graphqlOperation(createMarket, { input })
      );

      console.info(`created market ${response.data.createMarket.id}`);
      formDataHandler({ name: "", selectedTags: [] });
    } catch (error) {
      formDataHandler({ name: "" });
      console.error(error, "error adding new market");
      Notification.error({
        title: "Error",
        message: `${error.message || "Error Adding Market"}`,
      });
    }
  };

  const handleFilteredTags = (query) => {
    const options = formData.tags
      .map((tag) => ({ value: tag, label: tag }))
      .filter((tag) => tag.label.toLowerCase().includes(query.toLowerCase()));

    formDataHandler({ options });
  };
  return (
    <UserContext.Consumer>
      {({ user }) => (
        <>
          <div>
            <div className='market-header'>
              <h1 className='market-title'>
                Create Your Market Place
                <Button
                  type='text'
                  icon='edit'
                  className='market-title-button'
                  onClick={() => marketDHandler(true)}
                />
              </h1>
            </div>
            <Dialog
              title='Create New Market'
              visible={marketD}
              onCancel={() => marketDHandler(false)}
              size='large'
              customClass='dialog'
            >
              <Dialog.Body>
                <Form labelPosition='top'>
                  <Form.Item label='Add Market Name'>
                    <Input
                      placeholder='Market Name'
                      trim={true}
                      onChange={(name) => formDataHandler({ name })}
                      value={formData.name}
                    />
                  </Form.Item>
                  <Form.Item label='Add Tags'>
                    <Select
                      multiple={true}
                      filterable={true}
                      placeholder='Market Tags'
                      onChange={(selectedTags) =>
                        formDataHandler({
                          selectedTags
                        })
                      }
                    >
                    
                      {formData.options && formData.options.map((option) => {
                        return (
                          <Select.Option
                            key={option.value}
                            label={option.label}
                            value={option.value}
                          />
                        );
                      })}{" "}
                    </Select>
                  </Form.Item>
                </Form>
              </Dialog.Body>
              <Dialog.Footer>
                <Button onClick={() => marketDHandler(false)}>Cancel</Button>
                <Button
                  type='primary'
                  disabled={!formData.name}
                  onClick={() => handleAddMarket(user)}
                  remoteMethod={handleFilteredTags}
                  remote={true}
                >
                  Add Market
                </Button>
              </Dialog.Footer>
            </Dialog>
          </div>
        </>
      )}
    </UserContext.Consumer>
  );
};

export default NewMarket;
