const recipe = require('../models/recipe')
//get all recipes
exports.getRecipes = async (req, res) => {
    const info = await recipe.find().sort({"_id":-1})
    res.status(200).json({info:info})
}

//get single recipe
exports.getSingleRecipe = async (req, res) => {
    const info = await recipe.findOne({_id: req.params.id})
    res.status(200).json({info:info})
}

//delete recipe
exports.deleteRecipe = async (req, res) => {
    const info = await recipe.findOneAndDelete({_id:req.params.id})
    res.status(200).json({info:info})
}

//update recipe
exports.updateRecipe = async (req, res) => {
    const info = await recipe.findOne({_id:req.params.id})
    if(!info){
        res.status(401).json({message:"No recipe found"})
    }
    else{
        info.name = req.body.name || info.name
        info.procedure = req.body.procedure || info.procedure
        info.ingredient = req.body.ingredient || info.ingredient
        await info.save()
        res.status(200).json({message:'Recipe updated'})
    }
}