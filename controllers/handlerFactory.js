const catchAsyc = require('../utils/catchAsyc');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/ApiFeatures');

exports.deleteOne = (Model) =>
  catchAsyc(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('not document found with that id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
exports.updateOne = (Model) =>
  catchAsyc(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('not document found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
exports.createOne = (Model) =>
  catchAsyc(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
exports.getOne = (Model, populateOptions) =>
  catchAsyc(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('not document found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsyc(async (req, res, next) => {
    let filter;
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const freatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();
    // const doc = await freatures.query.explain();
    const doc = await freatures.query;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
