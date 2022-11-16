import { BadRequestException } from "@nestjs/common";

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        throw new BadRequestException('Hanya gambar JPG/JPEG/PNG yang diperbolehkan!')
    }

    callback(null, true);
}

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0]
    const fileNameArray = file.originalname.split('.')
    const fileExtName = '.' + fileNameArray[fileNameArray.length - 1]
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('')

    callback(null, `${name}-${randomName}${fileExtName}`)
};