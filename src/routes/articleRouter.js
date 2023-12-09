const { 
      getArticle,
      getAllArticles,
      deleteArticle,
      getByOwnerId,
      addArticle,
      } = require('../Controllers/article.controller')

const router = require('express').Router()



router.get('', getAllArticles)
router.get('/:id', getArticle)
router.post('',addArticle)
router.delete('/:id', deleteArticle)
router.get('/user/:ownerId', getByOwnerId)





module.exports = router;