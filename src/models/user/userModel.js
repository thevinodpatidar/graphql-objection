// @ts-nocheck

const CONFIG = require('./../../global_constants');

const { Model } = require('objection');
const validator = require('validator');
const ValidationError = require('objection').ValidationError;
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

class User extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'user';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        email : { type : "string"}
      }
    };
  }

  static get relationMappings(){
    const Post = require("../post/postModel");
    return {
      posts:{
        relation : Model.HasManyRelation,
        modelClass : Post,
        join : {
          from : "user.id",
          to : "post.userId"
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

module.exports = User;