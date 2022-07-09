const router = require("express").Router();
const SubCategory = require("../schema").subCategory;
const FurtherSubCategory = require("../schema").furtherSubCategory;
const slugify = require("slugify");

const admin_auth = require("./middleware/admin_auth");

router.get("/table-data", async (req, res) => {
  const subCategories = await SubCategory.find({}).populate("category");
  if (!subCategories) res.json({ data: [] });
  else res.json({ data: subCategories });
});

router.post("/table-data-auto", async (req, res) => {
  if (Object.keys(req.body).length !== 0) {
    const subCategories = await SubCategory.find({ category: req.body });
    res.json({ data: subCategories });
  } else {
    const subCategories = await SubCategory.find({});
    res.json({ data: subCategories });
  }
});

router.get("/get-sub-categories", async (req, res) => {
  const subCategories = await SubCategory.find({}, { _id: 0 });
  if (!subCategories) res.json({ data: [] });
  else res.json({ data: subCategories });
});

router.post("/add", admin_auth, async (req, res) => {
  const data = req.body;
  let i = 0;
  let slug = "";
  while (true) {
    slug = `${slugify(data.name, { lower: true })}-${i}`;
    const objExists = await SubCategory.exists({ slug: slug });
    if (objExists) i += 1;
    else break;
  }
  const newSubCategory = new SubCategory({
    name: data.name,
    slug: slug,
    active: data.active,
    keywords: data.keywords,
    description: data.description,
    category: data.category,
  });
  newSubCategory.save();
  res.json({ data: newSubCategory });
});

router.post("/update", admin_auth, async (req, res) => {
  const data = req.body;
  const subCategory = await SubCategory.findOne({ _id: data._id });
  let slug = "";
  if (subCategory.name === data.name) slug = subCategory.slug;
  else {
    let i = 0;
    while (true) {
      slug = `${slugify(data.name, { lower: true })}-${i}`;
      const objExists = await SubCategory.exists({ slug: slug });
      if (objExists) i += 1;
      else break;
    }
  }
  subCategory.name = data.name;
  subCategory.slug = slug;
  subCategory.keywords = data.keywords;
  subCategory.description = data.description;
  subCategory.category = data.category;
  subCategory.active = data.active;
  subCategory.save();
  res.json({ data: subCategory });
});



router.post('/delete', admin_auth, async (req, res) => {
  await SubCategory.deleteMany({ _id: { $in: req.body.data } });
  await FurtherSubCategory.deleteMany({ subCategory: { $in: req.body.data } });
  const sub_categories = await SubCategory.find({});
  res.json({ success: true, data: sub_categories });
});


router.post("/set-active", admin_auth, async (req, res) => {
  const { active, selected } = req.body;
  await SubCategory.updateMany({ _id: { $in: selected } }, { active: active });
  const subCategories = await SubCategory.find({}).populate("category");
  if (!subCategories) res.json({ data: [] });
  else res.json({ data: subCategories });
});

module.exports = router;
