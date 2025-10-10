const yup = require("yup");

const removeUserValidator = yup.object().shape({
  id: yup
    .string()
    .required("User ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});

const banUserValidator = yup.object().shape({
  id: yup
    .string()
    .required("User ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});

const editUserValidator = yup.object().shape({
  username: yup.string(),
  email: yup.string().email("Invalid email address"),
  password: yup.string().min(8, "Password must be at least 8 characters"),
  name: yup
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(40, "Full name must be at most 40 characters"),
  phone: yup
    .string()
    .matches(/^(\+34|0034)?[6-9][0-9]{8}$/, "Invalid Spain phone number"),
  role: yup
    .string()
    .oneOf(["ADMIN", "USER"], "Role must be one of ADMIN or USER"),
  id: yup
    .string()
    .required("User ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});

const updateUserValidator = yup.object().shape({
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^(\+34|0034)?[6-9][0-9]{8}$/, "Invalid Spain phone number"),
});

const changeUserRoleValidator = yup.object().shape({
  id: yup
    .string()
    .required("User ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  role: yup
    .string()
    .oneOf(["ADMIN", "USER"], "Role must be one of ADMIN or USER")
    .required("Role is required"),
});

module.exports = {
  removeUserValidator,
  banUserValidator,
  editUserValidator,
  updateUserValidator,
  changeUserRoleValidator,
};
