module.exports = (eleventyConfig)=>{
    eleventyConfig.addShortcode(
        '   ',
        (breed, name) => `
          <div class="dog">
            <div class="name">Name: ${name}</div>
            <div class="breed">Breed: ${breed}</div>
          </div>
        `
      );
}