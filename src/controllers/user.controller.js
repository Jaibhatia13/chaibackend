import { asyncHandler } from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOncloudinary } from "../utilis/cloudinary.js";
import { ApiResponse } from "../utilis/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend step 1
  // and these detalis are based on the model we make of user
  // validation like empty fileds, step 2
  //check if user already exisits // step 3 (note by username or email)
  // if file is send or not, here we taking avatar and cover image in user model
  // if yes file is there upload them to cloudinary, avatar
  //create user object - create enrty in db
  // if user create in database it return us the
  // same object so now i don't wish to give password and refresh token so remove theses two fields from response
  // check for user creation
  // if created successfully return res
  //
  const { fullName, email, username, password } = req.body;
  console.log("body: ", req.body);

  // if (fullName === "") {
  //   throw new ApiError(400, "FullName is required");
  // }

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this username or email Already exists");
  }

  //console.log("files: ", req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOncloudinary(avatarLocalPath);
  const coverImage = await uploadOncloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
