module.exports = function () {
    switch (process.env.NODE_ENV) {
        case 'development':
            return { "url": 'mongodb://golfDev1:golf1234@ec2-13-126-69-196.ap-south-1.compute.amazonaws.com:27017/golfbudz-dev' };
        case 'production':
            return { "url": 'mongodb://ec2-13-126-69-196.ap-south-1.compute.amazonaws.com:27017/golfbudz-prod' };
        default:
            return { "url": 'mongodb://golfDev1:golf1234@ec2-13-126-69-196.ap-south-1.compute.amazonaws.com:27017/golfbudz-dev' };

    }
};
// use golfbudz-prod
// db.createUser(
//   {
//     user: "golfDev1",
//     pwd: "golf1234",
//     roles: [ { role: "readWrite", db: "golfbudz-dev" } ]
//   }
// )

