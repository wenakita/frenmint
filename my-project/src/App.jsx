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
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Portal />} />
          <Route path="/home" element={<Home />} />
          <Route path="/friend/:address" element={<Friend />} />
          <Route path="/balances" element={<BalancesPage />} />
          <Route path="/my-pools" element={<MyPools />} />
          <Route path="/pools" element={<FriendTechPools />} />
          <Route path="/swap" element={<UniversalSwap />} />

          <Route path="/pool/:id" element={<Pool />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
