import PropTypes from "prop-types";

const Layout = ({ children }) => {
  return (
    <>
      <div className="relative align-center flex flex-col justify-center min-h-screen px-6 py-12 lg:px-8 bg-white">
        {children}
      </div>
    </>
  );
};

export default Layout;

Layout.propTypes = {
  children: PropTypes.element,
};
