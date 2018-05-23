# IOT-NodeJS-FileUpload-with-signature
Signature validation of file upload. 

Validate a form based file upload with its signature passed as form attribute.

Step 1 - Before run:
  
  1.1 - Select a file that will be sent to the server
  
  1.2 - Generate a sha256 of the file choosed. The generated value will be used on Step2
  
  <code> openssl dgst -sha256 <file + extension> </code>


Step 2 - Reproducing:

  2.1 - Run the FileUploadSignatureValidation.js on a machine with nodejs.
  
  <code> nodejs FileUploadSignatureValidation.js </code>

  2.2 - On the browser of your choice, access http://<machine_ip_address>:3000/form.html 
  
  2.3 - On the form, select the file from step 1.1 and use the generated sha256 signature from step 1.2. 
  Submit the form!

  2.4 You will be able to see the results described on the page.
