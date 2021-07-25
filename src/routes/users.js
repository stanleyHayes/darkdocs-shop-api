const router = require('express').Router({mergeParams: true});

const {
    updateUser, blockUser, deactivateUser, getUser, getUsers, reactivateUser, unblockUser, createUser, deleteUser
} = require('../controllers/users');

const {authenticate, authorize} = require('../middleware/authentication');

router.post('/', authenticate, authorize('SUPER_ADMIN'), createUser);
router.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), getUsers);
router.get('/:userID', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), getUser);
router.put('/:userID/update', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateUser);
router.put('/:userID/block', authenticate, authorize('SUPER_ADMIN'), blockUser);
router.put('/:userID/unblock', authenticate, authorize('SUPER_ADMIN'), unblockUser);
router.put('/:userID/deactivate', authenticate, authorize('SUPER_ADMIN'), deactivateUser);
router.put('/:userID/reactivate', authenticate, authorize('SUPER_ADMIN'), reactivateUser)
router.delete('/:userID', authenticate, authorize('SUPER_ADMIN'), deleteUser);

module.exports = router;
