'use strict';
const crypto = require('crypto');
const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
const options = {
	
};
var sig;
let filePath;

http.createServer(function (req, res) {
	if (req.url == '/form.html') {
		res.writeHead(200 , {'Content-Type': 'text/html; charset=utf8'});
		res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
		res.write('File: <input type="file" name="fileupload"/><br>');
		res.write('Signature in sha256: <textarea cols="70" rows="12" name="sha256signature"></textarea><br>');
		res.write('<input type="submit"/>');
		res.write('</form>');
		return res.end();
	} else if (req.url == '/fileupload') {
		
		var form = new formidable.IncomingForm({uploadDir: __dirname + '/arq'});
		form.parse(req, function (err, fields, files) {
			
			if (err) {
	          console.log('Error=', err);
	          next(err);
	        }
		});
		form.on('field', function(name, value) {
			sig = value;
		});

		form.on('fileBegin', function(name, file) {

			console.log('Uploading file: ', file.name);

			file.path = form.uploadDir + "/" + file.name;
			filePath = file.path;
		});

		form.on('file', function(name, file) {
			
			console.log('File uploaded to: ', filePath);
			console.log('Validating signature.');
			
			let hash = crypto.createHash('sha256');
			let stream = fs.createReadStream(filePath);
			stream.on('data', function(data) {
				hash.update(data, 'utf8');
			});

			stream.on('end', function(){
				var hashFile = hash.digest('hex');
				
				console.log('file sha256: ', hashFile);
				console.log('signature:   ', sig);
				
				if (hashFile.toString().trim() !== sig.toString().trim()) {
					console.log('INvalid signature:', sig);
					console.log('Assinatura inválida. File is being removed');
					
					fs.unlink(filePath, (err) => {
					  if (err) throw err;
					  console.log(filePath, ' was deleted', '\n');
					});

					res.writeHead(200 , {'Content-Type': 'text/html; charset=utf8'});
					res.write('INvalid file signature. File was uploaded and immediately removed.');
					res.write('<a href="/form.html">Go back</a>');
					res.end();
				} else {
					console.log('File has a valid signature, so it will be kept.', '\n');

					res.writeHead(200 , {'Content-Type': 'text/html; charset=utf8'});
					res.write('File uploaded with success.');
					res.write('<a href="/form.html">Go back</a>');
					res.end();
				}
			});
		});

	} else {
		res.writeHead(200);
		res.end('Hello World\n');
	}

}).listen(3000);
