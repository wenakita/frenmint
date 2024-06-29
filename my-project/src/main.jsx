import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";
import "./index.css";
import { base } from "viem/chains";
console.log(import.meta.env.VITE_NEXT_PUBLIC_PRIVY_APP_ID);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={import.meta.env.VITE_NEXT_PUBLIC_PRIVY_APP_ID}
        config={{
          appearance: {
            theme: "dark",
            logo: "https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png",
          },
          loginMethods: ["email", "wallet", "google", "farcaster", "twitter"],
          embeddedWallets: {
            createOnLogin: "users-without-wallets",
          },
        }}
      >
        <App />
      </PrivyProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
