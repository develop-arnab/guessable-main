/* eslint-disable react/prop-types */
import { Oval } from "react-loader-spinner";

const Loader = ({ height, width }) => {
  return (
    <div className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
      <Oval
        height={height ? height : "80"}
        width={width ? width : "80"}
        color="#42474e"
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#DBE2F9"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default Loader;
