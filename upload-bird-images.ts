import { storage } from "./index";
import { ref, uploadBytes } from "firebase/storage";
import * as fs from "fs";
import { snapshot } from "node:test";
import path from "path";

const birdImagesDir = "./assets/bird-species-images";

fs.readdir(birdImagesDir, (err, files) => {
  files.forEach((file) => {
    const filePath = path.join(birdImagesDir, file);

    fs.readdir(filePath, (err, files) => {
      files.forEach((file) => {
        const fileName = path.basename(file);
        const storagePath = `${filePath}/${fileName}`;

        fs.readFile(storagePath, (err, data) => {
          const storageRef = ref(storage, storagePath);

          uploadBytes(storageRef, data).then((snapshot) => {
            console.log(`${file} successfully uploaded`);
          });
        });
      });
    });
  });
});
