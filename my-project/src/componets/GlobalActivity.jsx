import { useEffect } from "react";
import { fetchGlobalActivity } from "../requests/friendCalls";
function GlobalActivity() {
  const globalActivity = fetchGlobalActivity();
  return (
    <div>
      <h3 className="text-white font-mono font-bold text-[20px]">
        Global Activity
      </h3>
    </div>
  );
}

export default GlobalActivity;
