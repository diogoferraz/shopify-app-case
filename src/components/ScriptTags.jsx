import { gql, useQuery, useMutation } from "@apollo/client";
import {
  Button,
  Card,
  Layout,
  Page,
  ResourceList,
  Stack,
} from "@shopify/polaris";

const CREATE_SCRIPT_TAG = gql`
  mutation scriptTagCreate($input: ScriptTagInput!) {
    scriptTagCreate(input: $input) {
      scriptTag {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const QUERY_SCRIPTTAGS = gql`
  query {
    scriptTags(first: 5) {
      edges {
        node {
          id
          src
          displayScope
        }
      }
    }
  }
`;

const DELETE_SCRIPTTAG = gql`
  mutation scriptTagDelete($id: ID!) {
    scriptTagDelete(id: $id) {
      deletedScriptTagId
      userErrors {
        field
        message
      }
    }
  }
`;

function ScriptTags() {
  const [createScripts] = useMutation(CREATE_SCRIPT_TAG);
  const [deleteScripts] = useMutation(DELETE_SCRIPTTAG);
  const { loading, error, data } = useQuery(QUERY_SCRIPTTAGS);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card title="These are the Script Tags:" sectioned>
            <p>Create or Delete a Script Tag</p>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card title="Delete Tag" sectioned>
            <Stack spacing="loose" distribution="center" alignment="center">
              <Button
                primary
                size="slim"
                type="submit"
                onClick={() => {
                  createScripts({
                    variables: {
                      input: {
                        src: "https://order.qa.dropp.rocks/dropp.js",
                        displayScope: "ORDER_STATUS",
                      },
                    },
                    refetchQueries: [{ query: QUERY_SCRIPTTAGS }],
                  });
                }}
              >
                Create dropp order status Widget Script Tag
              </Button>
              <Button
                primary
                size="slim"
                type="submit"
                onClick={() => {
                  createScripts({
                    variables: {
                      input: {
                        src: "https://dropp-popup.withdropp.com/dropp-popup.js",
                        displayScope: "ONLINE_STORE",
                      },
                    },
                    refetchQueries: [{ query: QUERY_SCRIPTTAGS }],
                  });
                }}
              >
                Create Marketing Popup Script Tag
              </Button>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <ResourceList
              showHeader
              resourceName={{ singular: "Script", plural: "Scripts" }}
              items={data.scriptTags.edges}
              renderItem={(item) => {
                return (
                  <ResourceList.Item id={item.id}>
                    <Stack>
                      <Stack.Item>
                        <p>{item.node.id}</p>
                      </Stack.Item>
                      <Stack.Item>
                        <Button
                          type="submit"
                          onClick={() => {
                            deleteScripts({
                              variables: {
                                id: item.node.id,
                              },
                              refetchQueries: [{ query: QUERY_SCRIPTTAGS }],
                            });
                          }}
                        >
                          Delete Script Tag
                        </Button>
                      </Stack.Item>
                    </Stack>
                  </ResourceList.Item>
                );
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default ScriptTags;
