const router = require('express').Router({mergeParams: true});

const {
    verifyOTP,
    register,
    login,
    resendOTP, updateProfile, getProfile, updatePassword, deactivateProfile
} = require('../controllers/authentication');

const {authenticate} = require('../middleware/authentication');

router.post('/register', register);
router.post('/login', login);
router.put('/verify-otp', authenticate, verifyOTP);
router.post('/resend-otp', resendOTP);
router.put('/profile', authenticate, updateProfile);
router.get('/profile', authenticate, getProfile);
router.put('/update-password', authenticate, updatePassword);
router.put('/deactivate-profile', authenticate, deactivateProfile);

module.exports = router;
