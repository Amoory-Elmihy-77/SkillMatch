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
    const opportunities = await Opportunity.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: opportunities.length,
      data: {
        opportunities,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: "No opportunities found" });
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
