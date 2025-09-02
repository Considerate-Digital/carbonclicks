---
title: Videos
author: Alex McCartney
date: 06/04/2024
slug: /guide/videos
parent: guide
blog: 1
teaser: Video is a popular medium for audience engagement. But streaming is one of the most carbon-intensive activities available to us online, and it increases a website’s carbon emissions more significantly than is true of images or text.
---

## Video is a popular medium for audience engagement. But streaming is one of the most carbon-intensive activities available to us online, and it increases a website’s carbon emissions more significantly than is true of images or text.

Here are some key points to consider for best practices.

### Necessity

Does this need to be a video? If a gif, image or a creative use of text and animation can communicate the same content, then carbon emissions will probably be lower than for a video.

Keeping your videos relevant and succinct will greatly improve your carbon emissions. For example, posting a list of related videos embedded alongside a written blog post is likely to increase your associated carbon emissions. If it is necessary to post a video to accompany some written content, then try to use one video instead of several.

### Quality

Video quality has advanced in recent years with 2K and 4K resolutions becoming widely available to businesses and consumers alike. Higher quality videos have larger file sizes and therefore transfer more data across the web when they are streamed. This leads to higher carbon emissions.

When creating and uploading videos, consider the viewers. If most of the users view the video on mobile phones, choosing to use a lower quality resolution (such as 1080p) will lower carbon emissions without negatively affecting user experience.

### Format

Video formats can easily confuse. For nearly all purposes on the web .mp4 provides the best compromise between support, size and quality.

### Compression

The most commonly used video format online is “.mp4”. This format is usually compressed using H.26 or H.265 codec, providing a good balance between file size and video quality. As mentioned earlier, consider compressing videos to gifs if this does not disrupt the content.

#### Tools

- [Handbrake](https://handbrake.fr/)
- [Freemake](https://www.freemake.com/) (Windows only)

##### Developer

### Hosting

Use video hosting if possible. Embedding videos directly on a website is usually far less carbon efficient. Video hosting providers optimise the streaming process to transfer the minimum data required for good user experience.

### Video structure

Videos are not formatted in the same way as images. Videos are held in containers and are transcoded using codecs. The file extensions that you will be used to seeing relate only to type of container and do not necessarily tell us which codec was used.

### Containers

MP4 containers are the most reliable fallback but where possible use WebM (not supported in Safari before version 16.0).

### Codecs

H.264 should be considered the standard fallback with VP9 being used where possible (not fully supported on Safari).

### Combinations

Fallback = MP4: H.264 (video), AAC (audio).
Favoured = WebM: VP9 (video, Opus (audio).

### Example

The example below shows how a fallback mechanism works in HTML. However, as stated above, this is not the recommended way to serve video and video hosting providers should be used in most cases.

```
<video width="1920" height="1080" controls>
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.ogg" type="video/webm">
</video>
```

### Coming soon

Adaptive bit rate (ABR) is a new development in video streaming on the web and will most likely become the standard in future. The attraction of using ABR is that it is responsive to the network speeds and the user’s device capabilities, – as it says on the tin – adapting the bit rate to suit the context.

#### Sources

- [Mozilla](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs)
- [Video formats for the web](https://www.freecodecamp.org/news/video-formats-for-the-web/)
