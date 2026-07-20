const CLOUDINARY_CLOUD_NAME = 'fbupwf0l';
const CLOUDINARY_UPLOAD_PRESET = 'listing_photos';

export const uploadToCloudinary = async (file) => {
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body,
  });
  const data = await res.json();
  return data.secure_url;
};
