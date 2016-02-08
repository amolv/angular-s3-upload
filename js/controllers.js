'use strict';

var controllers = angular.module('controllers', []);

controllers.controller('UploadController',['$scope', function($scope) {
  $scope.sizeLimit      = 83886080; // 80MB in Bytes
  $scope.uploadProgress = 0;
  $scope.creds          = {
    access_key: 'AKIAI34WK7M65KAKI2ZA',
    secret_key: '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',
    bucket: 's3.vlurn.com'

  };

  $scope.upload = function() {
    AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    AWS.config.region = 'us-west-2';
    var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
    console.log( $scope.$$childHead.file );
    if( $scope.$$childHead.file.length > 0 ) {
      for ( var i = 0; i < $scope.$$childHead.file.length; i++ ) {
        // Perform File Size Check First
        var fileSize = Math.round(parseInt($scope.$$childHead.file[i].size));
        if (fileSize > $scope.sizeLimit) {
          toastr.error('Sorry, your attachment is too big. <br/> Maximum '  + $scope.fileSizeLabel() + ' file attachment allowed','File Too Large');
          return false;
        }
        // Prepend Unique String To Prevent Overwrites
        var uniqueFileName = $scope.uniqueString() + '-' + $scope.$$childHead.file[i].name;

        var params = { Key: uniqueFileName, ContentType: $scope.$$childHead.file[i].type, Body: $scope.$$childHead.file[i], ServerSideEncryption: 'AES256' };

        bucket.putObject(params, function(err, data) {
          if(err) {
            toastr.error(err.message,err.code);
            return false;
          }
          else {
            // Upload Successfully Finished
            toastr.success('File Uploaded Successfully', 'Done');

            // Reset The Progress Bar
            setTimeout(function() {
              $scope.uploadProgress = 0;
              $scope.$digest();
            }, 4000);
          }
        })
        .on('httpUploadProgress',function(progress) {
          $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
          $scope.$digest();
        });
      }
    }  
    else {
      // No File Selected
      toastr.error('Please select a file to upload');
    }
  }

    $scope.fileSizeLabel = function() {
    // Convert Bytes To MB
    return Math.round($scope.sizeLimit / 1024 / 1024) + 'MB';
  };

  $scope.uniqueString = function() {
    var text     = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}]);
