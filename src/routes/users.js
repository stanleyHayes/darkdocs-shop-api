const router = require('express').Router({mergeParams: true});

const {
    updateUser, blockUser, deactivateUser, getUser, getUsers, reactivateUser, unblockUser
} = require('../controllers/users');

const {authenticate} = require('../middleware/authentication');

router.get('/', authenticate, getUsers);
router.get('/:userID', authenticate, getUser);
router.put('/:userID/update', authenticate, updateUser);
router.put('/:userID/block', authenticate, blockUser);
router.put('/:userID/unblock', authenticate, unblockUser);
router.put('/:userID/deactivate', authenticate, deactivateUser);
router.put('/:userID/reactivate', authenticate, reactivateUser)

module.exports = router;
