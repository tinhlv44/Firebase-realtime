import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required('Email là bắt buộc').email('Email không hợp lệ').label('Email'),
  password: Yup.string().required('Mật khẩu là bắt buộc').min(8, 'Mật khẩu phải có ít nhất 8 ký tự').label('Mật khẩu')
});

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string().required('Email là bắt buộc').email('Email không hợp lệ').label('Email'),
  password: Yup.string().required('Mật khẩu là bắt buộc').min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái thường")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái hoa")
    .matches(/\d/, "Mật khẩu phải chứa ít nhất một chữ số")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt")
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu nhập lại không khớp')
    .required('Nhập lại mật khẩu là bắt buộc')
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Vui lòng nhập email đã đăng ký')
    .label('Email')
    .email('Vui lòng nhập email hợp lệ')
});
