module.exports = function() {if(!req.isAuthenicated()) {
    req.flash('error', 'you must be logged in to access');
    req.redirect('/login');
}};