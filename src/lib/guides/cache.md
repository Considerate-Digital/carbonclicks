---
title: Cache
author: Alex McCartney
date: 14/03/2024
slug: /guide/cache
parent: guides
blog: 1
teaser: Caching can be complicated. The use of content delivery networks (CDNs) and different web frameworks means that every caching setup must be customised and unique to each use-case. In general, the more data that is cached client-side and server-side, the lower the website’s overall carbon emissions.
---

## Caching can be complicated. The use of content delivery networks (CDNs) and different web frameworks means that every caching setup must be customised and unique to each use-case. In general, the more data that is cached client-side and server-side, the lower the website’s overall carbon emissions.

### Time

Before we jump into the technicalities of caching, it’s important for us to establish that caching to improve carbon emissions and page-load speed is fundamentally about time. In most cases we, as developers, are asking a user’s browser or a caching server to save some data for a certain amount of time, often until a time-limit expires or the data changes.

A good caching practice should also seek to become more granular: this means that while ‘blanket rules’ for all images, for example, will probably have a positive effect on the website overall, a refined and specific ruleset for caching headers will always get the best results.

In our example, the context in which every image is displayed will likely be different depending on the degree to which any section of a website is static or dynamic. Dynamic and regularly changing content would most likely use less power overall if the caching headers reflected this. Similarly, a regularly accessed section of static content that is unlikely to change could be cached for a much longer time.

### Shared or Private

There are two types of cache that we should be aware of. Shared cache lives between the origin server and the clients. This is the kind of cache you need to consider when using a CDN or Proxy. It stores a single response – containing an image, for example – and then ‘shares’ it with multiple client-side users. Public-facing images are a good example of what to store with shared cache, as they don’t usually contain any personal information or content. It is important to not use shared cache for sensitive or secure content or information. It is not private – which brings us to private cache.

Private cache is just that, private. This cache exists only on the client and is often referred to as ‘local cache’ or ‘browser cache’. Private cache is perfectly suited for storing personalised or sensitive information that is only meant for that individual user.

### Headers

The most widely used caching header is ‘Cache-Control’ and this header will serve for most use cases. Whilst there are many caching headers, when it comes to the subject of website-generated carbon emissions, we can make the greatest difference in the first instance by using the ‘Cache-Control’ header.

### Directives

‘max-age’: This directive sets the maximum age of an asset in seconds. This is measured from the time the server generated the resource. This directive is the most basic tool in the box and should be used across all content to varying degrees.

‘immutable’: When serving resources with this directive, they will never be revalidated while they are ‘fresh’. Use this sparingly and only for assets that will not change while their ‘max-age’ is still valid. This directive deliberately stops the browser from making unnecessary requests to the server in order to find out if a resource is still valid. We know that any network request will generate carbon emissions, so using the ‘immutable’ directive will positively impact website generated carbon emissions.

‘stale-while-revalidate’: When used in combination with the ‘max-age’ directive, this directive allows much faster performance on the client device and therefore a better user experience. Newer resources are retrieved in the background without adding to the user’s load time. Although using this directive won’t necessarily have an effect on the website’s carbon emissions, it’s a useful tool nonetheless.

‘private’: As discussed above, this directive should be used when serving a resource containing sensitive data to a client. Note that the ‘public’ directive is default and therefore does not need to be stipulated.

### Cache-busting

Cache-busting sounds cooler than it is. This is the practice of invalidating a cached resource – often by changing the url it is served from in some way.

A common method involves using version numbers in file names. Therefore, when you want to invalidate the current resource and force the download of an updated resource, you can increase the version number in the file name i.e. from “myImage24.png” to “myImage25.png”.

#### Sources

- [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
