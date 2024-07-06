import Swal from "sweetalert2";

const Alert = (options) => {
  const {
    title = "Are you sure?",
    text = "",
    icon = "warning",
    showCancelButton = true,
    confirmButtonColor = "#3085d6",
    cancelButtonColor = "#d33",
    confirmButtonText = "Yes",
    cancelButtonText = "No",
    ...rest
  } = options;

  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText,
    ...rest,
  });
};

export default Alert;
