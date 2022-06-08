import { Layout, Card, Page, Button } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";

function Assets() {
  const [theme, setMainTheme] = useState();
  const [hasAsset, setHasAsset] = useState(false);

  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  const getMainTheme = async () => {
    const themes = await fetch("/themes").then((res) => res.json());
    const mainTheme = themes.find((aTheme) => aTheme.role === "main");
    setMainTheme(mainTheme);
  };

  const getAsset = async () => {
    const path = "assets/dropp-checkout.js";
    const request = await fetch(`/asset?assets=${path}&theme_id=${theme?.id}`);
    const assets = await request.json();
    const theAsset = assets.find((anAsset) => anAsset.key === path);

    setHasAsset(!!theAsset);
  };

  const updateCreateAsset = async () => {
    const key = "assets/dropp-checkout.js";
    const script =
      "https://checkout-widget.withdropp.com/static/js/dropp-checkout.js";
    const request = await fetch(
      `/createCheckoutWidget?key=${key}&theme_id=${theme?.id}&src=${script}`
    );
    const status = request.status;
    setHasAsset(status === 200);
  };

  const deleteAsset = async () => {
    const key = "assets/dropp-checkout.js";
    const request = await fetch(
      `/deleteAsset?key=${key}&theme_id=${theme?.id}`
    );

    const status = request.status;
    setHasAsset(!(status === 200));
  };

  useEffect(() => {
    getMainTheme();
  }, []);

  useEffect(() => {
    theme && getAsset();
  }, [theme]);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card title="Dropp-Checkout asset exists?" sectioned>
            <h1>{`Result: ${hasAsset}`}</h1>
            <Button
              type="submit"
              onClick={updateCreateAsset}
              disabled={hasAsset}
            >
              Create/Update Dropp-Checkout Asset
            </Button>
            <br />
            <Button
              type="submit"
              onClick={deleteAsset}
              disabled={!hasAsset}
            >
              Delete Dropp-Checkout Asset
            </Button>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Assets;
