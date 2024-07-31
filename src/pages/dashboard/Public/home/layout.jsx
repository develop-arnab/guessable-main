/* eslint-disable react/prop-types */
import { useState } from "react";
import Header from "../../../../layout/header";
import { FaRegCalendarAlt, FaUser } from "react-icons/fa";
import { GoQuestion } from "react-icons/go";
import { IoIosStats } from "react-icons/io";
import Modal from "../../../../components/Modal";
import Calender from "../../../../components/Modal/Content/calender";
import Stats from "../../../../components/Modal/Content/stats";
import Faq from "../../../../components/Modal/Content/faqs";
import Login from "../../../authentication/signin";
import Signup from "../../../authentication/signup";
import { useAuth0 } from "@auth0/auth0-react";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import moment from "moment";
const Home = ({
  children,
  userSelectedDate,
  setUserSelectedDate,
  questionLoading,
  questionError,
  open,
  setOpen,
  errorMessage,
  setErrorMessage,
  setGlobalSelectedDate,
  globalSelectedDate,
}) => {
  const [modalType, setModalType] = useState("");
  const { isAuthenticated, logout } = useAuth0();
  const [value, setValue] = useState(null);

  const checkUserLoggedIn = () => {
    if (isAuthenticated) {
      return true;
    } else if (localStorage.getItem("token")) {
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    if (localStorage.getItem("token")) {
      localStorage.clear();
      if (isAuthenticated) {
        logout();
      }
      window.location.reload();
    } else {
      logout();
    }
  };
const items = [
  {
    key: "1",
    label: (
      <a target="_blank" rel="noopener noreferrer">
        {localStorage.getItem("token") && (
          <div className="text-center font-[600] text-[15px] mt-4 font-poppins">
            {JSON.parse(localStorage.getItem("user")).email}
          </div>
        )}
      </a>
    )
  },
  {
    key: "2",
    danger: true,
    label: <a onClick={logoutUser}>Logout</a>
  }
];
  return (
    <div className="bg-white3 min-h-screen flex flex-col">
      <div className="flex flex-col flex-grow bg-white sm:mx-auto sm:w-full sm:max-w-xl ">
        <div className="flex flex-col">
          <Header isSignIn={false} name="GUESSABLE">
            <div className="flex text-gray4 font-poppins">
              <div className="flex gap-[10px]">
                <button
                  onClick={() => {
                    setOpen(!open);
                    setModalType("calender");
                  }}
                  className="text-2xl"
                >
                  <FaRegCalendarAlt />
                </button>
                <button
                  onClick={() => {
                    setOpen(!open);
                    setModalType("faq");
                  }}
                  className="text-2xl"
                >
                  <GoQuestion />
                </button>
                <button
                  onClick={() => {
                    setOpen(!open);
                    setModalType("stats");
                  }}
                  className="text-2xl"
                >
                  <IoIosStats />
                </button>
                {!checkUserLoggedIn() ? (
                  <button
                    onClick={() => {
                      setOpen(!open);
                      setModalType("login");
                    }}
                    className="font-[600] text-[16px]"
                  >
                    Login
                  </button>
                ) : (
                  <div
                    className="font-[600] text-[16px]"
                    style={{ marginTop: 5 }}
                  >
                    <Dropdown
                      menu={{
                        items
                      }}
                    >
                      <Space>
                        <FaUser size={20}/>
                      </Space>
                    </Dropdown>
                  </div>
                )}
              </div>
            </div>
          </Header>

          <div className="">{children}</div>
        </div>
      </div>
      <Modal
        footer={false}
        isModalOpen={open}
        handleCancel={() => {
          setOpen(false);
          setErrorMessage("");
        }}
        handleOk={() => {
          setOpen(false);
          setErrorMessage("");
        }}
      >
        {(modalType === "calender" && (
          <Calender
            questionLoading={questionLoading}
            questionError={questionError}
            setUserSelectedDate={setUserSelectedDate}
            userSelectedDate={userSelectedDate}
            open={open}
            setOpen={setOpen}
            errorMessage={errorMessage}
            setValue={setValue}
            value={value}
            setGlobalSelectedDate={setGlobalSelectedDate}
            globalSelectedDate={globalSelectedDate}
          />
        )) ||
          (modalType === "faq" && <Faq />) ||
          (modalType === "stats" && <Stats open={open} setOpen={setOpen} recallStats = {moment.now()} />) ||
          (modalType === "login" && (
            <Login
              modalType={modalType}
              setOpen={setOpen}
              open={open}
              setModalType={setModalType}
            />
          )) ||
          (modalType === "signup" && (
            <Signup setOpen={setOpen} open={open} setModalType={setModalType} />
          ))}
      </Modal>
    </div>
  );
};

export default Home;
