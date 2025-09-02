---
title: Fonts
author: Alex McCartney
date: 06/04/2024
slug: /guide/fonts
teaser: Web fonts have been in continual development since the early days of the internet. Though often taken for granted, they have a surprising impact on website carbon emissions. Like images, videos and audio, fonts are sent across the internet as files and this adds to the amount of data users download when they view a webpage. The use of fonts on a website can be optimised, however, decreasing the overall carbon emissions.
parent: guide
blog: 1
---

## Web fonts have been in continual development since the early days of the internet. Though often taken for granted, they have a surprising impact on website carbon emissions.

Like images, videos and audio, fonts are sent across the internet as files and this adds to the amount of data users download when they view a webpage. The use of fonts on a website can be optimised, however, decreasing the overall carbon emissions.

Here are some key points to consider for best practices with fonts.

### Necessity

Many fonts have to be downloaded to be visible on a website. Therefore, if a website uses multiple fonts from different ‘font families’, it can have a negative impact on carbon emissions. Consider how many fonts are required for a webpage to communicate well and clearly. Limit the number of different fonts used across a website, if possible.

##### Developer

### What is a font?

At a basic level, a font is a collection of small symbols, referred to as glyphs. Each glyph contains a vector shape that represents one of the letters or symbols that we use for communication. onts are often described as having certain character sets, such as the Latin, Greek or Arabic alphabets and symbols. Each character set (or unicode block) adds new glyphs to a font. As such, font data sizes can increase or decrease depending on how many languages and their associated symbols are supported. Carefully selecting fonts and character sets has a serious impact on your carbon emissions, since your choice of font will be loaded on every browser that visits your website.

### Format

WOFF2 is preferred in nearly all cases as it can be up to 30% more compressed when compared to WOFF. Consider WOFF only if the Internet Explorer browser must be supported.

WOFF, the Web Open Font Format, was developed by Mozilla, Type Supply, LettError and other organisations. Its primary appeal is that the font and accompanying data are compressed, which means that less data is ‘sent down the wire’ and less bandwidth is used when loading a font on a website. With WOFF2, a major upgrade from WOFF, enjoying wide support among browsers, there is no real reason to use older formats such as TrueType, OpenType and Open Font Format. If you are using an older font format, consider converting your font using one of the tools below.

### Variable Fonts

Variable fonts now have wide support across all the major browsers, so they should be considered for use in circumstances where multiple variations of the same typeface are used on a website. In the past, a bold, semi-bold, bold-italic set of styles used to mean the browser had to load three different fonts. Variable fonts have done away with this concept, since one variable font can be adapted to many styles (or variations). Variable fonts can be ‘heavier’ resources to load onto a website but the benefit of not having to load multiple fonts usually leads to less data being downloaded to the browser overall.

### Font loading

There are multiple ways to declare a font on a website but different approaches to font declaration can affect the way the browser behaves when it loads a website.

### Preload

If you’re using a font that is not a system font, you’ll usually have to let the browser know where it can find that font and how you would like it loaded. Custom fonts are best declared using a link tag with the \`rel=”preload”\` attribute. This preload attribute informs the browser that we would like it to start downloading the resource as a font as soon as possible. Informing the browser that the resource we’re asking it to preload is a font allows it to internally prioritise the loading of the resource appropriately when it adds it to the queue.

```
<link rel="preload" as="font" href="/fonts/my-favourite-font.woff2" type="font/woff2" crossorigin="anonymous">
```

The reason we preload fonts is essentially so that the browser doesn’t have to wait until after it has loaded the stylesheets (CSS) to find out which fonts should be located and downloaded. By using this attribute value we effectively skip the queue and get straight on with downloading the fonts we need.

The `crossorigin=”anonymous”` attribute declaration is also of interest to developers looking to lower their website’s carbon emissions as this prevents the browser from making an extra ‘fetch’ attempt to download the font even if it has been preloaded. The browser behaves in this way because fonts are expected to be fetched anonymously by the browser.

If you find yourself using some fonts sooner, and some later, then consider using the prefetch attribute for fonts (and any other resources) that you will utilise after the initial page load.

### Font declaration

After the browser has downloaded the font you’ve asked for, you now need to use CSS to declare the font. Here’s an example:

```
@font-face {
font-family: 'My Favourite Font';
font-weight: 400;
font-style: normal;
font-display: swap;
unicode-range: U+000-5FF;
src: local('My Favourite Font'),
url('/fonts/my-favourite-font.woff2') format('woff2')
}
```

You’ll immediately notice two oddities. First, the font-display property is set to ‘swap’. This speeds up the initial page load, as it tells the browser to use a system font and get on with loading the rest of the webpage, before replacing it (‘swapping it’) with the font you want to use (in this case ‘My Favourite Font’). Second, the ‘unicode-range’ property tells the browser that we only need to load the glyphs between the range ‘U+000-5FF’ – in this case, only the Latin through to Hebrew glyphs. Being specific about the unicode range that you need for your website can speed up your website and therefore, albeit by a small amount, lower your carbon emissions.

You can explore unicode table blocks at [Unicode Table](https://unicode-table.com/en/blocks/).

### System Fonts

Use system fonts where possible. Using system fonts on your website means that the browser doesn’t have to download fonts from elsewhere on the internet in order to load the webpage. System fonts are usually well designed and using them will not only decrease the data transferred to client devices but will increase page load speeds as a result.

These are the current default system fonts in use on particular operating systems:
macOs
Monterey: San Francisco Pro (variable)
El Capitan: San Francisco
Yosemite: Helvetica Neue
Windows
11: Segoe UI
Android
Roboto
Ubuntu
All: Ubuntu

However, this list is not exhaustive and many other standard-issue fonts such as ‘Arial’ will be included and shipped with many operating systems.

### Implementing system fonts

This is an example of how system fonts can be set across browsers and operating systems using the ‘font-family’ property.

```
:root {
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
```

If you’re only supporting more recent versions of Chrome and Safari browsers, then you can replace ‘-apple-system’ and ‘BlinkMacSystemFont’ with the new ‘system-ui’ generic font.

#### Caution

Using system fonts does require some maintenance because, unlike a custom font that you’re loading from your website or a CDN, system fonts can change with operating system updates and this may break your website design.

#### Tools

- [Unicode range generator](https://codepen.io/elifitch/pen/Ljqway)
- [Unicode table](https://unicode-table.com/en/blocks/)
- [Variable fonts](https://web.dev/variable-fonts/)
- [Woff](https://developer.mozilla.org/en-US/docs/Web/Guide/WOFF)
- [Loading web fonts](https://www.freecodecamp.org/news/web-fonts-in-2018-f191a48367e8/)
- [System font stack](https://css-tricks.com/snippets/css/system-font-stack/)
