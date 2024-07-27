import { useEffect } from "react";
import Home from "../src/pages/dashboard/Public/home/index";
import { PrivateOutlet } from "./utils/privateOutlet";
import WelcomePage from "../src/pages/dashboard/Public/home/welcomePage";
import { useIsLoggedInQuery } from "./services/auth";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  const { data, error, isLoading } = useIsLoggedInQuery();

  useEffect(() => {
    if (data) {
      console.log("Is logged in:", data);
    }
    if (error) {
      console.error("Error: isLoggedInQuery: ", error);

      // check if the error.data.message is "Token expired" and reload the page
      if (
        error.data.message === "Token expired." ||
        error.data.message === "Invalid token."
      ) {
        // delete localStorage everywhere and redirect and refresh
        localStorage.clear();
        window.location.reload();
      }
    }
  }, [data, error]);

  useEffect(() => {
    document.title = "Guessable.in";
  });
  return (
    <>
      <ToastContainer
        closeButton={false}
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="w-[100%] justify-center sm:w-[545px] ml-auto mr-auto"
        theme="dark"
      />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/countries" element={<Home />} />
        <Route path="/movies" element={<Home />} />
        <Route path="/people" element={<Home />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route element={<PrivateOutlet />}></Route>
      </Routes>
    </>
  );
}

export default App;
