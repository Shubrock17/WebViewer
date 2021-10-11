# PPT WebViewer

A solution to view and add comments to the PPT and view them in web browser.
PPTs are uploaded on cloud and retrieved from there for use.

## Features

- Login authentication : page for users to authenticate themselves before using the application
- Home Page : Where all the files uploaded by the user are listed with options for download, preview and delete files.
- MyView : Files uploaded by all the users are available for downloading and previewing using our own method of viewing.
- Pdftron View : Files uploaded by all the users are available for downloading and previewing using our own method of viewing.
- Upload Page : Files uploaded on Azure Blob Storage and database with three different options of uploading are as follows:
  - Upload privately : Files uploaded will only be visible to the user.
  - Upload for all : Files uploaded will be visible for all users.
  - Upload with Link : File will be uploaded and link for downloading the ppt is generated for the user.

- Add Comment : Option to add comment on the platform for reviewing the presentation. The comments are saved and retrieved from the database.

## Tech Stack

It uses a number of open source projects to work properly:

- [ReactJS] - HTML enhanced for web apps!
- [Bootstrap] - For styling application
- [Firebase] -For user autherisation
- [MongoDB] - For database management
- [Azure Storage] - For storing the files on the cloud
- [Node.js] - evented I/O for the backend
- [Pdftron] - For viewing files in Pdftron view
- [Convert API] - For converting PPTs to PDFs
- [Pdf-viewer-reactjs] - For viewing file on a web page
- [Pdf-merger-js] -For merging multiple Pdfs
- [Axios] - For getting HTTP requests 

And of course it is also open source with a [public repository][dill]
 on GitHub.

## Installation

IT requires [Node.js](https://nodejs.org/) v10+ and [React.js](https://reactjs.org/) to run.

Install the dependencies and devDependencies and start the server.

```sh
cd dillinger
npm i
node app
```

## Plugins

Dillinger is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.

| Plugin | README |
| ------ | ------ |
| Dropbox | [plugins/dropbox/README.md][PlDb] |
| GitHub | [plugins/github/README.md][PlGh] |
| Google Drive | [plugins/googledrive/README.md][PlGd] |
| OneDrive | [plugins/onedrive/README.md][PlOd] |
| Medium | [plugins/medium/README.md][PlMe] |
| Google Analytics | [plugins/googleanalytics/README.md][PlGa] |

## License

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [dill]: <https://github.com/Shubrock17/WebViewer>
   [Bootstrap]: <https://getbootstrap.com/>
   [MongoDB]: <https://github.com/markdown-it/markdown-it>
   [Firebase]: <https://firebase.google.com/>
   [Node.js]: <http://nodejs.org>
   [Azure Storage]: <https://azure.microsoft.com/en-in/services/storage/blobs/>
   [Pdftron]: <https://www.pdftron.com/webviewer/>
   [Convert API]: <https://www.npmjs.com/package/convertapi>
   [Axios]: <https://axios-http.com/docs/intro>
   [ReactJS]: <https://reactjs.org/>
   [Pdf-viewer-reactjs]:<https://www.npmjs.com/package/pdf-viewer-reactjs>
   [Pdf-merger-js]:<https://www.npmjs.com/package/pdf-merger-js>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
