import { Modal } from "antd";
import React from "react";

const CustomModal = (props) => {
  const { title, open, onOk, onCancel } = props;

  return (
    <>
      <Modal title={title} open={open} onOk={onOk} onCancel={onCancel} centered>
        {props.children}
      </Modal>
    </>
  );
};

export default CustomModal;
