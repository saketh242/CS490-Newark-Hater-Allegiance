module.exports = {
    verbose:true,
    setupFilesAfterWnv: ["<rootDir>src/setupTests.js"],
    moduleFileExtensions:["js", "jsx", "ts", "tsx"],
    moduleDirectories:["node_modules", "src"],
    moduleNameMapper: {
      "\\.(css|less|scss)$":"identity-obj-proxy"

    },
    transform: {
      '^.+\\.(ts|tsx)?$':'ts-jest',
      '^.+\\.(js|jsx)?$':'babel-jest',
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":"<rootDir>/_mocks_file.js",
    }


}