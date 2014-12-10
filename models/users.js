var keystone = require('keystone'),
    Types = keystone.Field.Types;
 
var User = new keystone.List('User', {
    label: '用户',
    singular: '用户',
    plural: '用户',
    map: { name: 'username' }
});
 
User.add({
    'username': { type: String, required: true, initial: true, index: true },
    'name': { type: Types.Name, initial: true, index: true },
    'email': { type: Types.Email, initial: true, required: true, index: true },
    'password': { type: Types.Password, initial: true },
    'canAccessKeystone': { type: Boolean, initial: true },
    resetPasswordKey: { type: String, hidden: true },
    'createtime': { type: Date, default: Date.now , noedit: true}
}, 'Profile', {
    website: { type: Types.Url }
});

User.defaultColumns = 'name, email, password, canAccessKeystone, website';

/**
 * Methods
 * =======
 */

User.schema.methods.resetPassword = function(callback) {

    var user = this;

    user.resetPasswordKey = keystone.utils.randomString([16,24]);

    user.save(function(err) {

        if (err) return callback(err);

        new keystone.Email('forgotten-password').send({
            user: user,
            link: '/reset-password/' + user.resetPasswordKey,
            subject: '重设外滩密码',
            to: user.email,
            from: {
                name: '外滩',
                email: 'yinz@me.com'
            }
        }, callback);

    });

}

User.register();