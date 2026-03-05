import path from "path";
import fs from "fs";

const deleteOldFile = async (imgName: string) => {
    
    //  const filePath = path.join(`uploads/${imgFolder}`, imgName);
    
    if (fs.existsSync(imgName)) {

        fs.unlinkSync(imgName); // delete the file
        
        // console.log(`Image file: ${imgName} deleted from ${imgFolder}`);
    }

}

export default deleteOldFile;