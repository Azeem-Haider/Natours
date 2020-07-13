const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsyc = require('../utils/catchAsyc');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'public/img/users');
//   },
//   filename: (req, file, callback) => {
//     const ext = file.mimetype.split('/')[1];
//     callback(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('Not an Image! Please upload only image', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsyc(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});
const filterobj = (obj, ...allowedfields) => {
  const newobj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedfields.includes(el)) newobj[el] = obj[el];
  });
  return newobj;
};
exports.updateMe = catchAsyc(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'this route is not for password updates please use /updateMyPassword',
        400
      )
    );
  }
  //filter unwanted fields
  const filteredBody = filterobj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.deleteMe = catchAsyc(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route not defined yet!Please use /Signup instead',
  });
};
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
//do not update Password with this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
