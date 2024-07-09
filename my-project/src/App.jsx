import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./componets/Layout";
import Portal from "./componets/Portal";

import NotFound from "./componets/NotFound";
import NewBalances from "./componets/NewBalances";
import NewSwap from "./componets/swap/NewSwap";
import NewHomePage from "./componets/NewHome/NewHomePage";
import NewFriend from "./componets/friend/NewFriend";
import Analytics from "./componets/Analytics";
import SwapMain from "./componets/swapv2/SwapMain";
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Portal />} />
          <Route path="/home" element={<NewHomePage />} />
          <Route path="/friend/:address" element={<NewFriend />} />
          <Route path="/new" element={<NewBalances />} />
          {/* <Route path="/newswap" element={<NewSwap />} /> */}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/swap" element={<SwapMain />} />

          {/* <Route path="/newfriend/:address" element={<NewFriend />} /> */}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
