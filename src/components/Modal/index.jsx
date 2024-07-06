import { Modal } from "antd";
import PropTypes from "prop-types";

const CustomModal = ({
  title,
  isModalOpen,
  handleOk,
  handleCancel,
  width,
  style,
  footer,
  children,
}) => {
  return (
    <>
      <Modal
        width={width}
        footer={footer}
        centered
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        style={style}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </>
  );
};
export default CustomModal;

CustomModal.propTypes = {
  title: PropTypes.string,
  isModalOpen: PropTypes.bool,
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
  children: PropTypes.any,
  footer: PropTypes.any,
  width: PropTypes.number,
  style: PropTypes.object,
};
