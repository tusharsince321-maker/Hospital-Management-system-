import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, res, tokenName) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE || 7);
  const isSecure = process.env.NODE_ENV === "production";
  const sameSite = isSecure ? "none" : "lax";

  res
    .status(statusCode)
    .cookie(tokenName, token, {
      httpOnly: true,
      secure: isSecure,
      sameSite,
      path: "/",
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      message: "Authenticated",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        nic: user.nic,
        dob: user.dob,
        gender: user.gender,
        role: user.role,
        doctorDepartment: user.doctorDepartment,
        docAvatar: user.docAvatar,
      },
    });
};

