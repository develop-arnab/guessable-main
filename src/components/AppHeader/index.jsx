import { Link } from "react-router-dom";
import removeSpacesAndLowercase from "../../utils/helperFunctions";
import { Skeleton } from "antd";

/* eslint-disable react/prop-types */
const Index = ({ name, isLoading, children }) => {
  const data = name?.split("/");
  return (
    <div className="flex items-center bg-sidebar p-3">
      <div className="flex-grow font-sans text-[22px] font-[400]">
        <div className="flex items-center ">
          {isLoading ? (
            <Skeleton.Input active shape="round" />
          ) : Array.isArray(data) && data.length > 0 ? (
            data.map((currElem, index, originalArr) => {
              return (
                <div key={index}>
                  {index !== originalArr.length - 1 ? (
                    <div className="flex">
                      <Link
                        className="mx-[5px]"
                        to={`/${removeSpacesAndLowercase(currElem)}`}
                      >
                        {currElem}
                      </Link>
                      <span>/</span>
                    </div>
                  ) : (
                    <span className="mx-[5px]">
                      {originalArr?.length > 0 && data[index]
                        ? data[index]
                        : ""}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <>{name}</>
          )}
        </div>
      </div>
      <div className="self-center">{children}</div>
    </div>
  );
};

export default Index;
