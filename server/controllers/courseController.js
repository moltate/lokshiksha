const Course = require('../models/Course');

exports.getAllCourses = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    
    let filter = { isApproved: true };
    
    if (category) filter.category = category;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const courses = await Course.find(filter)
      .populate('teacher', 'name email avatar')
      .sort({ createdAt: -1 });
      
    res.json(courses);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name email avatar');
      
    if (!course) {
      return res.status(404).json({ message: 'Course nahi mila' });
    }
    
    res.json(course);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, price, location, schedule } = req.body;
    
    const course = await Course.create({
      title,
      description,
      category,
      price,
      location,
      schedule,
      teacher: req.user._id
    });
    
    res.status(201).json(course);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course nahi mila' });
    }
    
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Tumhara course nahi hai yeh' });
    }
    
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updated);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course nahi mila' });
    }
    
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Tumhara course nahi hai yeh' });
    }
    
    await course.deleteOne();
    res.json({ message: 'Course delete ho gaya' });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id })
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) {
      return res.status(404).json({ message: 'Course nahi mila' })
    }
    if (course.studentsEnrolled.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled ho' })
    }
    course.studentsEnrolled.push(req.user._id)
    await course.save()
    res.json({ message: 'Successfully enrolled!' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
};