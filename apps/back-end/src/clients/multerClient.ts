import multer from "multer";

const multerClient = multer({
  storage: multer.memoryStorage(),
});

export default multerClient;
