---
title: Images
author: Alex McCartney
date: 06/04/2024
slug: /guide/images
parent: guide
blog: 1
teaser: Images are an inescapable part of the internet. Whether used to convey important information or to sell a toothbrush, they are ubiquitous and necessary. But as a result of their size and information density, images also have a measurable effect on your website’s carbon emissions.
---

## Images are an inescapable part of the internet. Whether used to convey important information or to sell a toothbrush, they are ubiquitous and necessary. But as a result of their size and information density, images also have a measurable effect on your website’s carbon emissions.

Here are some key points to consider for image-related best practices. (NB, when we refer to images, we mean photos, charts, graphics, illustrations or any image file.)

### Necessity

Try to use only the images you need. A variety of images will often be used on a website where perhaps only a couple would suffice. This is not always the case, of course, and there are exceptions. But the important thing is to ask yourself ‘Is this image necessary?’ and ‘Is it relevant?’. The fewer images on your web page, the lower your carbon emissions.

### Dimensions

Image files come in all shapes and dimensions. Often they won’t be automatically resized when uploaded to a website, a process that optimises image size for an individual user’s device. Each time you add an image to a website, consider what size it will need to be online and resize it to the correct dimensions before uploading it. For example, if the ‘large’ image you’re uploading is only used as a ‘thumbnail’ (or ‘small’ size), resizing the image to fit the context in which it is used on a webpage will lower the related carbon emissions. A smaller presentational size for a web image means its ‘data size’ is also smaller, which in turn means a lower carbon emission when viewed online.

#### Tools

- [Image Resizer](https://imageresizer.com/)
- [Adobe Image Resizer](https://www.adobe.com/express/feature/image/resize)
- [Resize Pixel](https://www.resizepixel.com/)

### Format

There are many image formats to choose from and each comes with its own preferred uses and advantages. In general, the .png format should be used for images with any transparency (or ‘alpha’ layer) and the .jpeg format for all other images. Newer formats such as Google’s .webp improve on older formats but are not yet widely supported.

### Compression

Compression squeezes an image into a smaller file size. This usually lowers the quality of the image slightly. If used effectively, compression can greatly reduce the file size of your images and therefore lower your website carbon emissions. Software and dedicated tools that resize images will often compress the image, too.

#### Tools

- [Image Resizer's Compressor](https://imageresizer.com/image-compressor)
- [Reduce Image Size](https://reduceimagesize.net/)
- [Resize Pixel's Compressor](https://www.resizepixel.com/compress-image)

##### Developer

### Dimensions

Use the HTML ‘picture’ element (or similar system) to provide suitably-sized images depending on the user device. Many image delivery services provide this functionality as standard.

```
<picture>
  <source media="(min-width: 80rem)" srcset="img_laptop.jpg">
  <source media="(min-width: 80rem)" srcset="img_laptop.png">
  <source media="(min-width: 80rem)" srcset="img_laptop.webp">
  <source media="(min-width: 30rem)" srcset="img_tablet.jpg">
  <source media="(min-width: 30rem)" srcset="img_tablet.png">
  <source media="(min-width: 30rem)" srcset="img_tablet.webp">
  <source srcset="img_mobile.jpg">
  <source srcset="img_mobile.png">
  <img src="img_mobile.webp" alt=”my image”>
</picture>
```

This example is verbose but it demonstrates how to use multiple formats and image dimensions to achieve the lowest carbon emission possible from an image. In this case, we try to load a highly optimised image in WebP format and in the smallest possible dimensions, therefore sending the least amount of data available to the end user’s device. If the browser checks the file format and does not support WebP, then it will load the next available format. The same is true for the image dimensions. By using the \`media\` attribute we can exercise a fine-grained control over the dimensions of the image being sent to particular devices, taking into account different screen and viewport sizes.

### Format

Where possible, and in consideration of the user base, use modern image formats. WebP performs best in most cases but is not fully supported on versions of Safari older than 16.0. Implementing a system or using a service that ‘switches out’ jpeg or png images with WebP is recommended for the best possible user experience. See the example above.

### Alternatives

If the image has a very simple colour palette then consider using svg format. Likewise if using a complex svg, file-size gains may be made by using other formats. If in doubt, compare both formats for file-size. It is not recommended to use complex svgs in place on images formatted as WebP or any other format, as the data size of svgs starts to increase rapidly as their complexity increases.

### Compression

Compress all images. Images are usually to blame for increasing the page ‘weight’ of any webpage. The less data transferred to user devices, the lower the carbon emissions.

### Tips

If you are struggling to reduce the size of an image, one trick we have discovered in the data that we collect about websites is to use – very carefully – a Gaussian blur to slightly soften the image. This must be done with caution as it is very easy to blur an image in a noticeable way.
If you’re looking for really extreme image compression, then take a look at the ‘dithering’ process. You can see a good example of the visual effect that dithered images have on Low Tech Magazine’s [solar-powered website](https://solar.lowtechmagazine.com/).

### Tools

- [Image Magick](https://imagemagick.org/)
- [Pngquant](https://pngquant.org/)
- [Opitpng](http://optipng.sourceforge.net/)
- [JpegOptim](https://github.com/tjko/jpegoptim)

### Sources

- [Web.dev](https://web.dev/learn/accessibility/images/)
- [Mozilla](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types)
- [Gaussian Blur](https://en.wikipedia.org/wiki/Gaussian_blur)
