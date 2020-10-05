require('./../global_functions');
require('./../global_constants');

module.exports = {
    adminAccess: (req, res, next) => {
        if (req.user.userTypeId === 1) {
            return next();
        } else {
            return forbiddenError("Not Authorized");
        }
    },

    hostAccess: (req, res, next) => {
        if (req.user.userType === "host") {
            return next();
        } else {
            return forbiddenError(res,"Not Authorized");
        }
    },
    venuerAccess: (req, res, next) => {
        if (req.user.userType === "venuer") {
            return next();
        }
        else if (req.user.userType === "host") {
            return next();
        } else {
            return forbiddenError(res,"Not Authorized");
        }
    },
    promoterAccess: (req, res, next) => {
        if (req.user.userType === "promoter") {
            return next();
        } else {
            return forbiddenError(res,"Not Authorized");
        }
    },

    checkRole: (roleIds) => {
        return function (req, res, next) {
            console.log(roleIds);
            if (req.user.roles.indexOf(roleIds) !== -1) {
                return next();
            } else {
                return forbiddenError(res,"Not Authorized");
            }
        }
    }
}
