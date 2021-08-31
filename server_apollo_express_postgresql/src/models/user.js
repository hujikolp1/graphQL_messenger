import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {

  const User = sequelize.define('user', {

    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
    role: {
      type: DataTypes.STRING,
    },
  });

  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login },
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }

    return user;
  };

  // generate hash before user is created and stored in the DB 
  User.beforeCreate(async user => {
    user.password = await user.generatePasswordHash();
  });

  // make sure functions are added with the Prototype hain
  // so all user instances can access and run the function through inheritance 
  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    // imporve hashing difficulty by adding 'salt' 10 times 
    // to many salt rounds may decrease performance, but 10 is a good number 
    return await bcrypt.hash(this.password, saltRounds);
  };

  // prototypical inheritance makes function available in instances 
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

export default user;
