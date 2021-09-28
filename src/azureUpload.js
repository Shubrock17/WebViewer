import { BlobServiceClient} from '@azure/storage-blob';

const sasToken="sp=racwdl&st=2021-09-27T15:13:51Z&se=2022-09-27T23:13:51Z&sip=122.161.68.222&sv=2020-08-04&sr=c&sig=f03xCYyk%2FwEtQi%2BtAF17SFY2OYzTZ6EwwY6O7PG%2FL6E%3D"
const containerName = `data`;
const storageAccountName = `bruteforce3`;
export const isStorageConfigured = () => {
  return !((!storageAccountName || !sasToken));
};
const getBlobsInContainer = async (containerName,filename) => {
  return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${filename}`;
};


const createBlobInContainer = async (containerClient, file) => {
  const blobClient = containerClient.getBlockBlobClient(file.name);
  const options = { blobHTTPHeaders: { blobContentType: file.type } };
  await blobClient.uploadBrowserData(file, options);
};

const uploadFileToBlob = async (file) => {
  if (!file) return [];
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  const containerClient = blobService.getContainerClient(containerName);
  await createBlobInContainer(containerClient, file);
  return getBlobsInContainer(containerName,file.name);
};

export default uploadFileToBlob;