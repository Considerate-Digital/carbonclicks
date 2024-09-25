---
title: URL Error
author: Alex McCartney
date: 06/04/2024
slug: /guide/url-error
parent: guide
blog: 0
teaser: URL Errors can occur for a number of reasons. If you're having trouble testing your website using our Certification tool, then this guide will help you diagnose the problem.
---

## URL Errors can occur for a number of reasons. If you're having trouble testing your website using our Certification tool, then this guide will help you diagnose the problem.

### Incorrect URL

It might sound trite but double-checking that you have typed the correct URL is the best place to start. In around 90% of cases a mis-typed URL is the predominant cause for a URL Error. Test the URL you want to use by opening it in a browser tab. Make sure the webpage fully loads in your browser before attempting to use Considerate Digital Certification again. If your webpage does not load in the browser then try searching for the URL using a search engine.

### Considerate Digital is blocked

The second most common error that occurs when testing a URL is caused by the webpage blocking our software. If the webpage being tested blocks our software whilst it is performing an audit we cannot create a reliable report. There can be many reasons for Considerate Digital getting blocked on a website:

1. Considerate Digital respects the rules set out in a website's "robots.txt" file. If this file indicates that "bots" may not test the website then our software will not complete the test.
2. A CDN using 'anti-bot' technology incorrectly identifies Considerate Digital as a malicious bot and blocks access the webpage.
3. reCaptcha or hCaptcha technology is employed and visitors to the webpage are required to verify that 'they are human'. Considerate Digital's software does not pretend to be human by design and therefore cannot audit the webpage.
4. The website uses a 'waiting room' to avoid issues that can arise from high-traffic workloads. Considerate Digital's software will not wait until access to a webpage is given.

These issues can usually be solved by speaking to the website manager and alerting them to the issue or changing the configuration settings for the CDN you are utilising.

### Contact us

If you require more information or are persitently having issues certifying your webpages then please contact us using the contact form.

#### Developers

### User Agent

Considerate Digital's tools always use the user agent "ConsiderateBot/1.0" when requesting access to websites. If you are able to adjust the robots.txt file or any anti-bot technologies then please adjust them so that you allow our specific user agent. Our operational IP addresses can be provided upon request; please contact us if you require any further information.
