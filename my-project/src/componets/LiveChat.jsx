import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { supabase } from "../client";
import { useWallets } from "@privy-io/react-auth";
import { postMessageData, createUserName } from "../requests/supaBaseHandler";
function LiveChat() {
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [messagesData, setMessagesData] = useState(null);
  const [userNamesData, setUserNamesData] = useState(null);
  let [isOpen, setIsOpen] = useState(false);
  const [hasUserName, setHasUserName] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [postMessage, setPostMessage] = useState(null);
  const [userNameInput, setUserNameInput] = useState(null);
  const pepeUrls = [
    "https://i.pinimg.com/originals/07/a3/b5/07a3b592ab0b733e6eb87e0767b1feeb.jpg",
    "https://www.candlepowerforums.com/media/pepe-hype-png.1887/full",
    "https://icon2.cleanpng.com/20240405/wpu/transparent-pepe-the-frog-cartoon-frog-with-blue-cap-and-rainbow66106bcb2a6231.10801675.webp",
  ];
  const backgroundColors = [];
  const handleChange = () => [console.log("handling")];
  useEffect(() => {
    fetchUserNames();
    fetchMessages();
  });

  async function fetchMessages() {
    const { data, error } = await supabase.from("messages").select();
    if (error) {
      console.log(error);
    }
    if (data) {
      setMessagesData(data);
    }
  }

  async function fetchUserNames() {
    const { data, error } = await supabase.from("usernames").select();
    if (error) {
      console.log(error);
    }
    if (data) {
      setUserNamesData(data);
    }
  }

  function validateUser() {
    let userIsFound = false;
    for (const key in userNamesData) {
      const currentUser = userNamesData[key];
      if (currentUser.user_address === w0?.address) {
        userIsFound = true;
        setCurrentUserName(currentUser.username);
      }
    }
    setHasUserName(userIsFound);
  }

  useEffect(() => {
    if (userNamesData) {
      validateUser();
    }
  }, [userNamesData]);

  useEffect(() => {
    if (!hasUserName) {
      console.log("create username");
    } else {
      console.log(currentUserName);
    }
  }, [hasUserName]);

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="border p-1 border-stone-700 text-white flex justify-center text-[8px] p-1 rounded-lg"
      >
        <img
          src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
          alt=""
          className="w-3 h-3 rounded-full"
        />
        <h3 className="mt-0.5">Live Chat</h3>
      </button>
      {hasUserName ? (
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gradient-to-br from-stone-950">
            <DialogPanel className="w-[350px] h-[500px] text-white border border-stone-800 rounded-lg bg-black p-3">
              <DialogTitle className="font-bold flex justify-start mb-2 mt-1">
                <img
                  src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
                  alt=""
                  className="2-5 h-5 rounded-full"
                />
                Live Chat With frenmint users
              </DialogTitle>

              <div className="border overflow-y-auto h-[390px] scroll-snap-y-container bg-stone-900 border-stone-800 rounded-lg text-[10px]">
                {messagesData !== null || messagesData ? (
                  <div className="grid grid-flow-row">
                    {messagesData.map((item) => {
                      return (
                        <div
                          className="border border-stone-700 grid grid-rows-1 p-1"
                          key={item}
                        >
                          <div className=" ">
                            <div className="flex justify-between gap-1">
                              <div className="flex justify-center gap-1">
                                <img
                                  src={pepeUrls[1]}
                                  alt=""
                                  className="w-7 h-7 rounded-lg"
                                />
                                <h3 className="mt-1">
                                  {item?.frenmint_username}
                                </h3>
                              </div>
                              <div className="flex justify-end mt-1">
                                {item?.created_at}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 p-2 break-all">
                            {item?.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <div className="flex justify-center mt-3 gap-2">
                <input
                  type="text"
                  className="bg-stone-900 rounded-lg w-[300px] h-[25px] mt-1 text-[10px]"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setPostMessage(e.target.value);
                  }}
                  value={postMessage}
                />
                <button
                  className="border border-stone-800 text-white rounded-lg text-[10px] font-bold  p-1"
                  onClick={async () => {
                    const postStatus = await postMessageData(
                      supabase,
                      postMessage,
                      currentUserName
                    );
                    if (postStatus) {
                      setPostMessage("");
                      fetchMessages();
                    }
                  }}
                >
                  Send
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      ) : (
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gradient-to-br from-stone-950">
            <DialogPanel className="w-[350px] h-[200px] text-white border border-slate-500 rounded-lg bg-black p-2">
              <DialogTitle className="font-bold flex justify-start mb-5">
                <img
                  src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
                  alt=""
                  className="2-5 h-5 rounded-full"
                />
                Create a username
              </DialogTitle>
              <label htmlFor="" className="text-[10px] ms-4">
                Enter name
              </label>
              <div className="flex justify-center">
                <input
                  type="text"
                  className="border-slate-500 bg-stone-900 w-[300px] rounded-lg"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setUserNameInput(e.target.value);
                  }}
                />
              </div>
              <div className="flex justify-center mt-5">
                <button
                  className="border border-slate-500 rounded-lg p-1 text-white text-[10px]"
                  onClick={async () => {
                    const isCreated = await createUserName(
                      supabase,
                      userNameInput,
                      w0?.address
                    );
                    if (isCreated) {
                      fetchUserNames();
                      fetchMessages();
                    }
                  }}
                >
                  Create Username
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default LiveChat;
