const User = require('../../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');

const multer = require('multer');
const path = require('path');
const slugify = require('slugify');

const proxyRoute = '/apps/tribe';

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    req.imageURL = slugify(req.profile.name) + `-${Date.now()}` + path.extname(file.originalname);
    return cb(null,req.imageURL);
  }
});

const upload = multer({storage: storage, dest: './public/uploads/'}).any();

exports.uploadProfileImage = (req, res, next) => {
      console.log('req.profile: ',req.profile)
      res.setHeader('content-type', 'text/javascript')
      console.log('upload route hit');
      console.log('req.body',req.body);
      upload(req, res, (err) => {
        if(err){
          res.send({
            msg: err
          });
        } else {
          console.log('uploaded succesfully');
          User.update({_id: req.profile._id}, {
            cover_photo: `https://${req.query.shop + proxyRoute}/images/uploads/${req.imageURL}`
          }, function(err, affected, resp) {
             console.log(resp);
          })
          next();
        };
      });
}

exports.uploadPostImage = (req, res, next) => {
  console.log('req.profile: ',req.profile);
  res.setHeader('content-type', 'text/javascript')
  console.log('upload route hit');
  console.log('req.body',req.body);
  upload(req, res, (err) => {
    if(err){
      res.send({
        msg: err
      });
    } else {
      console.log('uploaded succesfully')
      next();
      }
    });
}

exports.afterUpload = (req, res) => {
    res.send({"success" : 1,
     "file": {
        "url" : `https://${req.query.shop + proxyRoute}/images/uploads/${req.imageURL}`            
      }
    });
}


exports.uploadImageURL = (req, res) => {
  res.setHeader('content-type', 'text/javascript')
  res.send({"success" : 1,
     "file": {
        "url" : req.body.url            
      }
  });    
}

exports.getImage = (req, res) => {
  console.log('image request',req.query);
  let fileExtension = req.params.file.split('.').pop();
  res.set('Content-Type', imageHeaders[fileExtension]).sendFile(path.join(__dirname, `../../public/uploads/${req.params.file}`));
}

exports.getProfilePhoto = (req, res) => {
  let profileImageURL = req.profile.cover_photo
  console.log('profileImageURL: ',profileImageURL);
  res.setHeader('content-type', 'text/javascript');
  res.send({src: profileImageURL})
}




const imageHeaders = {
  apng: 'image/apng',
  bmp:  'image/bmp',
  gif: 'image/gif',
  ico: 'image/x-icon',
  cur:  'image/x-icon',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jfif: 'image/jpeg',
  pjpeg: 'image/jpeg',
  pjp:  'image/jpeg',
  png:  'image/png',
  svg:  'image/svg+xml',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  webp: 'image/webp'  
}