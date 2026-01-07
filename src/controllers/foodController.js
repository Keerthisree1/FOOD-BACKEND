const axios = require('axios');
const Food = require('../models/foodModel');

// Sync meals from TheMealDB API and store in MongoDB
exports.syncMeals = async (req, res) => {
  try {
    // Fetch data from external API
    const response = await axios.get(
      'https://www.themealdb.com/api/json/v1/1/search.php?s='
    );

    const data = response.data;

    if (!data.meals) {
      return res.status(404).json({ message: 'No meals found' });
    }

    // Optional: clear old data
    await Food.deleteMany();

    // Map and save meals
    const meals = data.meals.map(meal => ({
      foodId: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
      image: meal.strMealThumb
    }));

    await Food.insertMany(meals);

    res.status(200).json({
      message: 'Meals synced successfully',
      total: meals.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFoods = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { area, category, sort, foodId } = req.query;

    // 1. Filters
    let filter = {};

    if (area) filter.area = area;
    if (category) filter.category = category;

    //foodId filter
    if (foodId) filter.foodId = foodId;

    // 2. Sorting
    let sortOption = {};
    if (sort === 'name_asc') sortOption.name = 1;
    if (sort === 'name_desc') sortOption.name = -1;

    // 3. Count (AFTER filter)
    const totalItems = await Food.countDocuments(filter);

    // 4. Query DB
    let query = Food.find(filter).sort(sortOption);

    //Apply pagination ONLY when foodId is NOT present
    if (!foodId) {
      query = query.skip(skip).limit(limit);
    }

    const foods = await query;

    const totalPages = foodId ? 1 : Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      page: foodId ? 1 : page,
      limit: foodId ? totalItems : limit,
      totalItems,
      totalPages,
      filters: filter,
      data: foods
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Get single food item
exports.getFoodById = async (req, res) => {
  try {
    const { foodId } = req.query; 

    if (!foodId) {
      return res.status(400).json({ message: 'foodId is required' });
    }

    const food = await Food.findOne({ foodId });

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  exports.getFoodsByArea = async (req, res) => {
  try {
    const { area } = req.params;

    const foods = await Food.find({ area });

    res.status(200).json({
      success: true,
      area,
      total: foods.length,
      data: foods
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get All Areas
exports.getAreas = async (req, res) => {
  try {
    const { areas } = req.query;

    //If area is provided - return FOOD DETAILS
    if (areas) {
      const foods = await Food.find({ area: areas });

      return res.status(200).json({
        success: true,
        area: areas,
        total: foods.length,
        data: foods
      });
    }

    //If no area - return ALL UNIQUE AREAS
    const allAreas = await Food.distinct('area');

    res.status(200).json({
      success: true,
      total: allAreas.length,
      data: allAreas
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







