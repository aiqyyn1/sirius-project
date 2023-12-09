const { model } = require('mongoose');
const Article = require('../model/Article')
const User = require('../model/User')



const getAllArticles = async (req, res) => {
      try {
            const articles = await Article.find();
            return res.status(200).json(articles);
      } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Somethin went wrong"})
      }
}

const getArticle = async (req, res) => {
      try {
            const idOfArticle = req.params.id
            if(!idOfArticle){
                  return res.status(400).json({message: "Id is empty!"})
            }

            const article = await Article.findById({_id: idOfArticle})
            if(!article){
                  return res.status(404).json({message: "Article with this id does nott exist!"})
            }

            return res.status(200).json(article)

      } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Something went wrong"})
      }
}

const deleteArticle = async (req, res) => {
      try {
            const idOfArticle = req.params.id
            if(!idOfArticle){
                  return res.status(400).json({message: "id is empty"})
            }

            const article = await Article.findByIdAndDelete({_id: idOfArticle})
            if(!article){
                  return res.status(400).json({message: "Post does not exist"})
            }
           
            return res.status(200).json({message: "Post succesfully deleted"})
      } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Something went wrong"})
      }
}

const addArticle = async (req, res) => {
      try {
            const { name, description, coverPhoto, text, content, state, owner, pinned } = req.body;
            const image = req.file.path;
            const newArticle = new Article({
                  name,
                  description,
                  image,
                  coverPhoto,
                  text,
                  content,
                  state,
                  owner,
                  pinned,
            });

      const savedArticle = await newArticle.save();
      res.status(200).json(savedArticle);

      } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Something went wrong"})
      }
}


const getByOwnerId = async (req, res) => {
      try {
            const userId = req.params.ownerId;
            const user = await User.findById({_id: userId})
            if(!user){
                  return res.status(400).json({message: "User does not exists"})
            }

            const articles = await Article.find({owner: userId})
            return res.status(200).json(articles)


      } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Something went wrong"})
      }
}

const updateArticle = async (req, res) => {
      try {
            const id = req.params.articleId
            const article = await Article.findById({_id: id})
            if(!article){
                  return res.status(400).json({message: "Article with this id does not exist"})
            }

            if(req.body.name){
                  article.name = req.body.name
            }
            if(req.body.description){
                  article.description = req.body.description
            }
            if(req.body.content){
                  article.content = req.body.content
            }
            if(req.body.state){
                  article.state = req.body.state
            }
            if(req.body.pinned){
                  article.pinned = req.body.pinned
            }
            
            await article.save()
            return res.status(200).json([{message: "Article updated"}, article])
            


      } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Something went wrong"})
      }
}








module.exports = {getAllArticles, getArticle, deleteArticle, addArticle, getByOwnerId, updateArticle}