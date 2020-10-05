// @ts-nocheck

const CONFIG = require('./../../global_constants');

const { Model } = require('objection');
const validator = require('validator');
const ValidationError = require('objection').ValidationError;
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

class Post extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'post';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' }
      }
    };
  }

  static get relationMappings(){
      const User = require("../user/userModel");
    return {
        user:{
            relation : Model.BelongsToOneRelation,
            modelClass : User,
            join : {
              from : "post.userId",
              to : "user.id"
            }
          }
    }
  }

  async getJWT() {
    return await jwt.sign({
      id: this.id
    }, CONFIG.jwt_encryption);
  }
  
  async comparePassword(password) {
    if (!password) {
      return false;
    }
    let pass = await bcrypt.compare(password, this.password);
    return pass;
  }

}

module.exports = Post;