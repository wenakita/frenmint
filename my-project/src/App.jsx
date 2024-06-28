import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./componets/Layout";
import Portal from "./componets/Portal";
import Home from "./componets/Home";
import Friend from "./componets/Friend";
import BalancesPage from "./componets/BalancesPage";
import MyPools from "./componets/MyPools";

import FriendTechPools from "./componets/FriendTechPools";
import Pool from "./componets/Pool";
import UniversalSwap from "./componets/UniversalSwap";
import NotFound from "./componets/NotFound";
import NewBalances from "./componets/NewBalances";
import NewSwap from "./componets/swap/NewSwap";
import NewHomePage from "./componets/NewHome/NewHomePage";
import NewFriend from "./componets/friend/NewFriend";
import Analytics from "./componets/Analytics";
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Portal />} />
          <Route path="/home" element={<NewHomePage />} />
          <Route path="/friend/:address" element={<NewFriend />} />
          <Route path="/balances" element={<BalancesPage />} />
          <Route path="/my-pools" element={<MyPools />} />
          <Route path="/pools" element={<FriendTechPools />} />
          <Route path="/swap" element={<UniversalSwap />} />
          <Route path="/new" element={<NewBalances />} />
          <Route path="/newswap" element={<NewSwap />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* <Route path="/newfriend/:address" element={<NewFriend />} /> */}

          <Route path="/pool/:id" element={<Pool />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
