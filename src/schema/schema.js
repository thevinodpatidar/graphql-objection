const graphql = require("graphql");
const bcrypt = require('bcrypt');
const { badRequestError,createdResponse,unverifiedEmailError,okResponse,notFoundError,to } = require("../global_functions");
const jwt = require('jsonwebtoken');
const CONFIG = require("../config/index");
const User = require("../models/user/userModel");
const Post = require("../models/post/postModel");
const { verifyJwt, signToken } = require('../utils/index');

const { 
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLInt,
    GraphQLString, 
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema } = graphql;

const UserType = new GraphQLObjectType({
    name : "User",
    fields: () => ({
        id : { type : GraphQLID },
        email : { type : GraphQLString },
        password : { type : GraphQLString },
        token : { type : GraphQLString }
    })
});

const PostType = new GraphQLObjectType({
    name : 'Post',
    fields :() => ({
        id : { type : GraphQLID },
        title : { type : GraphQLString },
        content : { type : GraphQLString },
        userId : { type : GraphQLInt },
        user : { type : UserType }
    })
})


const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        user:{
            type : UserType,
            args : { id: { type : GraphQLID}},
            async resolve(parent,args,context){
                try {
                    await verifyJwt(context);
                    return await User.query().skipUndefined().where("id",args.id).first();
                } catch (error) {
                    return []
                }
            }
        },
        users:{
            type : new GraphQLList(UserType),
            async resolve(parent,args){
                return await User.query().returning("*");
            }
        },
        post:{
            type : PostType,
            args : { id : { type : GraphQLID }},
            async resolve(parent,args,context){
                await verifyJwt(context);
                let post = await Post.query().where("id",args.id).eager("user").first();
                return post;
            }
        },
        posts:{
            type : new GraphQLList(PostType),
            async resolve(parent,args,context){
                // await verifyJwt(context);
                let post = await Post.query();
                return post;
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name : "Mutation",
    fields: {
        addUser:{
            type : UserType,
            args : {
                email : { type : new GraphQLNonNull(GraphQLString) },
                password : { type : new GraphQLNonNull(GraphQLString) } 
            },
            async resolve(parent,args){
                args.password = await bcrypt.hash(args.password, 10)
                return await User.query().insert(args).returning('*');
            }
        },
        login:{
            type : UserType,
            args : {
                email : { type : new GraphQLNonNull(GraphQLString) },
                password : { type : new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent,args,context){
                // console.log(context.headers.accept);
                let jwt_token;
                let user = await User.query().where("email",args.email).first();
                let pass = await bcrypt.compare(args.password, user["password"])
                if(pass){
                    jwt_token = await signToken(user["id"]);
                }
                let store_token = await User.query().updateAndFetchById(user["id"],{
                    token : jwt_token
                })

                return store_token;
            }
        },
        addPost:{
            type : PostType,
            args : {
                title : { type : GraphQLString },
                content : { type : GraphQLString }
            },
            async resolve(parent,args,context){
                try {
                    let verifed = await verifyJwt(context);
                    // console.log(verifed);
                    let user = await User.query().skipUndefined().where("id",verifed.id).first();
                    args.userId = user["id"];
                    console.log(user);
                    return await Post.query().insert(args).returning("*");
                } catch (error) {
                    return "Post Not Added";
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation : Mutation
})