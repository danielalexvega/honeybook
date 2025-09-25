import { Auth0Provider } from "@auth0/auth0-react";
import { FC, PropsWithChildren } from "react";

const Auth0ProviderWithRedirect: FC<PropsWithChildren<object>> = ({ children }) => {
  const onRedirectCallback = () => {
    // Use window.location instead of navigate since we're outside router context
    window.location.href = "/";
  };

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH_DOMAIN}
      clientId={import.meta.env.VITE_AUTH_CLIENT_ID!}
      onRedirectCallback={onRedirectCallback}
      authorizationParams={{
        audience: "https://app.kenticocloud.com/",
        redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URL,
        scope: "openid",
        responseType: "token id_token",
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithRedirect;
