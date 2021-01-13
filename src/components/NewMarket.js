import React, { useState } from "react";
// prettier-ignore
import { Form, Button, Dialog, Input, Notification } from 'element-react'
import { API, graphqlOperation } from "aws-amplify";
import { createMarket } from "../graphql/mutations";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { UserContext } from "../App";

const NewMarket = () => {
  const [marketD, marketDHandler] = useState(false);
  const [formData, formDataHandler] = useState({
    name: "",
    tags: [
      { value: "Arts", label: "Arts" },
      { value: "Tech", label: "Tech" },
      { value: "Music", label: "Music" },
      { value: "Food", label: "Food" },
    ],
    selectedTags: [],
    options: [],
  });

  const animatedComponents = makeAnimated();
  const { tags, selectedTags } = formData;

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
      formDataHandler({ ...formData, name: "", selectedTags: [] });
    } catch (error) {
      formDataHandler({...formData, name: "" });
      console.error(error, "error adding new market");
      Notification.error({
        title: "Error",
        message: `${error.message || "Error Adding Market"}`,
      });
    }
  };

  const handleFilteredTags = (query) => {
    const options = formData.tags.filter((tag) =>
      tag.label.toLowerCase().includes(query.toLowerCase())
    );

    formDataHandler({ ...formData, options });
  };

  const handleTags = (tags) => {

    formDataHandler({
      ...formData,
      selectedTags: tags
    })

  }

 
  return (
    <UserContext.Consumer>
      {({ user }) => (
        <>
          <div>
            <div className="market-header">
              <h1 className="market-title">
                Create Your Market Place
                <Button
                  type="text"
                  icon="edit"
                  className="market-title-button"
                  onClick={() => marketDHandler(true)}
                />
              </h1>
            </div>
            <Dialog
              title="Create New Market"
              visible={marketD}
              onCancel={() => marketDHandler(false)}
              size="large"
              customClass="dialog"
            >
              <Dialog.Body>
                <Form labelPosition="top">
                  <Form.Item label="Add Market Name">
                    <Input
                      placeholder="Market Name"
                      trim={true}
                      onChange={(name) => formDataHandler({...formData, name })}
                      value={formData.name}
                    />
                  </Form.Item>
                  <Form.Item label="Add Tags">
                    <Select
                      isMulti
                      components={animatedComponents}
                      placeholder="Market Tags"
                      options={tags}
                      value={selectedTags}
                      onChange={handleTags}
                      
                    />
                  </Form.Item>
                </Form>
              </Dialog.Body>
              <Dialog.Footer>
                <Button onClick={() => marketDHandler(false)}>Cancel</Button>
                <Button
                  type="primary"
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
