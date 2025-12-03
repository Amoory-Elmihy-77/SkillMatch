const User = require("../models/User.model");
const Opportunity = require("../models/Opportunity.model");

const getUniqueArray = (arr) =>
  [...new Set(arr.map((item) => item.toLowerCase().trim()))].filter(
    (item) => item
  );

// Admins only
exports.createOpportunity = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    // clean requiredSkills and tags to ensure uniqueness
    if (req.body.requiredSkills) {
      req.body.requiredSkills = getUniqueArray(req.body.requiredSkills);
    }
    if (req.body.tags) {
      req.body.tags = getUniqueArray(req.body.tags);
    }

    const newOpportunity = await Opportunity.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        opportunity: newOpportunity,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateOpportunity = async (req, res) => {
  try {
    if (req.body.requiredSkills) {
      req.body.requiredSkills = getUniqueArray(req.body.requiredSkills);
    }
    if (req.body.tags) {
      req.body.tags = getUniqueArray(req.body.tags);
    }

    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!opportunity) {
      return res
        .status(404)
        .json({ status: "fail", message: "No opportunity found with that ID" });
    }

    res.status(200).json({
      status: "success",
      data: {
        opportunity,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findByIdAndDelete(req.params.id);

    if (!opportunity) {
      return res
        .status(404)
        .json({ status: "fail", message: "No opportunity found with that ID" });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Public
exports.getOpportunities = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let query = Opportunity.find(queryObj);
    // Selection fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Search
    if (req.query.search) {
      query = query.find({
        title: { $regex: req.query.search, $options: "i" },
      });
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const total = await Opportunity.countDocuments(query.getQuery());

    query = query.skip(skip).limit(limit);

    const opportunities = await query;

    // const opportunities = await Opportunity.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: opportunities.length,
      total: total,
      page: page,
      data: {
        opportunities,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res
        .status(404)
        .json({ status: "fail", message: "No opportunity found with that ID" });
    }

    res.status(200).json({
      status: "success",
      data: {
        opportunity,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

// Prodected
exports.getRecommendedOpportunities = async (req, res) => {
  try {
    const userSkills = req.user.skills || [];
    const userInterests = req.user.interests || [];
    const userKeywords = getUniqueArray([...userSkills, ...userInterests]);

    if (userKeywords.length === 0) {
      return res.status(200).json({
        status: "success",
        message:
          "No keywords found in your profile. Please update your skills and interests for personalized recommendations.",
        data: { recommendedOpportunities: [] },
      });
    }

    const matchQuery = {
      $or: [
        { requiredSkills: { $in: userKeywords } },
        { tags: { $in: userKeywords } },
      ],
    };

    const matchingOpportunities = await Opportunity.find(matchQuery);

    // Score and rank opportunities based on keyword matches
    const scoredOpportunities = matchingOpportunities.map((opp) => {
      const oppKeywords = getUniqueArray([...opp.requiredSkills, ...opp.tags]);

      const matchCount = oppKeywords.filter((keyword) =>
        userKeywords.includes(keyword)
      ).length;

      const score = matchCount;

      return {
        opportunity: opp,
        score: score,
      };
    });

    const recommendedOpportunities = scoredOpportunities
      .sort((a, b) => b.score - a.score)
      .map((item) => item.opportunity);

    res.status(200).json({
      status: "success",
      results: recommendedOpportunities.length,
      data: {
        recommendedOpportunities,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Save or unsave an opportunity
// exports.saveOpportunity = async (req, res) => {
//   try {
//     const opportunityId = req.params.id;

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { $addToSet: { savedOpportunities: opportunityId } },
//       { new: true }
//     );

//     res.status(200).json({
//       status: "success",
//       message: "Opportunity saved successfully.",
//       data: {
//         savedCount: user.savedOpportunities.length,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({ status: "fail", message: err.message });
//   }
// };

// exports.unsaveOpportunity = async (req, res) => {
//   try {
//     const opportunityId = req.params.id;

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { $pull: { savedOpportunities: opportunityId } },
//       { new: true }
//     );

//     res.status(200).json({
//       status: "success",
//       message: "Opportunity unsaved successfully.",
//       data: {
//         savedCount: user.savedOpportunities.length,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({ status: "fail", message: err.message });
//   }
// };

exports.saveOpportunity = async (req, res, next) => {
  const currentUserId = req.user.id;
  const opportunityId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { savedOpportunities: opportunityId } },
      { new: true }
    ).select("savedOpportunities");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Opportunity saved successfully.",
      data: {
        savedOpportunities: updatedUser.savedOpportunities,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.unsaveOpportunity = async (req, res, next) => {
  const currentUserId = req.user.id;
  const opportunityId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { savedOpportunities: opportunityId } },
      { new: true }
    ).select("savedOpportunities");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Opportunity unsaved successfully.",
      data: {
        savedOpportunities: updatedUser.savedOpportunities,
      },
    });
  } catch (error) {
    next(error);
  }
};
