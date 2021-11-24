import easyDB from 'easydb-io'
import uuidv4 from 'uuid/v4'
import { log } from '../utils/error'

// const db = easyDB({
//   database: '5226c85e-ac8a-4892-b1d9-da89f3462c24',
//   token: 'c9541691-d433-4b7d-a282-6c0b35b2ce45'
// })
const mongoose = require('mongoose');
const Shop = require('./models/Shop');

mongoose
  .connect(process.env.DATABASE_LOCAL, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
  .then(()=> {
    console.log('DB Connected')

  })
  .catch(err=>{
    console.log(err);
  })


export const addUser = async (query, auth) => {
  console.log('ran install logic');

  await new Promise(function(resolve, reject) { 
      
              let new_shop = new Shop({ shopify_domain: query.shop, shopUrl: query.shop, shopifyToken: auth.access_token, shopifyScope: auth.scope })
              new_shop.save((err, shopReturned) => {
                  if (err) {
                      // return res.status(401).json({
                      //     error: errorHandler(err)
                      // });
                      console.log('error: ', err)
                      return reject(null);
                  } else {
                      console.log('shop created and returned: ', shopReturned);
                      resolve(shopReturned);
                  }
              });
    })
}

export const getUser = async (shopUrl) => {
  console.log('ran getUser function');
  try {
    return await db.get(shopUrl);
  } catch (error) {
    await log(`unable to get user: ${error.message}`, { error, shopUrl });
    return null;
  }
}

export const getSecrets = async (userId) => {
  try {
    return await db.get(userId);
  } catch (error) {
    await log(`unable to get secrets: ${error.message}`, { error, userId });
    return null;
  }
}

const dbGet = async (key) => {
  try {
    return await db.get(key);
  } catch (error) {
    await log('dbGet', error);
    return null;
  }
}

const dbDelete = async (key) => {
  try {
    return await db.delete(key);
  } catch (error) {
    await log('dbDelete', error);
    return null;
  }
}