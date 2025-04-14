# CarbonClicks

- **Real-time Carbon Monitoring:** CarbonClicks delivers instant analytics on the carbon emissions of websites, enabling organisations to make informed decisions towards sustainability.
- **Open Source:** CarbonClicks is open source, licensed under the FSL-1.1-MIT. The software is free to self-host and distribute under any purpose other than a Competing Use.
- **Free:** Considerate Digital provides a free hosted version of CarbonClicks to small and medium-sized organisations with moderate web-traffic.
- **Privacy-Focused:** CarbonClicks ensures user privacy by abstaining from storing personally identifiable information and refraining from the use of tracking cookies.
- **GDPR Compliant:** CarbonClicks does not retain any identifying data about users, including IP addresses. The service is designed to be GDPR compliant without the need for cookies.
- **Demo:** Try our [demo version](https://analytics.considerate.digital/dashboard?demo=true) of CarbonClicks to experience its capabilities before integrating the service into your website.


## Get Started

### Hosted Solution
Considerate Digital maintains a free hosted version of CarbonClicks. This is free for businesses with low to medium web traffic to use, however we reccomend setting up your own instance so that any data collected is controlled internally within your organisation. 
[Get in touch](https://considerate.digital) if you need any support with self-hosting CarbonClicks: Considerate Digital offers this as a service.

### Install

Installation is simple using the `docker-compose.yaml` on a fresh server/VPS.
The instructions provided here have only been tested on linux systems.

#### Requirements
- Docker
- A fresh server or VPS 
- Gmail account


#### Process
1. Edit the CaddyFile and change the domain name to the one that you would like to use.
2. Create a file `.env` in the root directory.
```
touch .env
vim .env
```
3. Include the following environmental variables:
```
VITE_DB_USER=postgres
VITE_DB_PASSWORD=pick_a_password
VITE_DB_HOST=localhost
VITE_DB_PORT=5432

# Email environmental variables
VITE_MAIL_USERNAME=youremail@yourdomain.com
VITE_MAIL_PASSWORD=use_your_password
VITE_MAIL_FROM_ADDRESS=youremail@yourdomain.com
VITE_MAIL_TO_ADDRESS=youremail@yourdomain.com
VITE_MAIL_FROM_NAME=Your Name
VITE_DOMAIN_ADDRESS=http://yourdomain.com

# Google mail environmental variables
VITE_OAUTH_CLIENTID=your_oauth_client_id
VITE_OAUTH_CLIENT_SECRET=your_oauth_client_secret
VITE_OAUTH_REFRESH_TOKEN=your_oauth_refresh_token

# Postgres environmental variables
POSTGRES_PASSWORD=pick_a_password
PGDATA=./pg/data
PGWAL=./pg/wal

```
Note that the domain address should be the domain address where you are hosting CarbonClicks.
To obtain the oauth client id, client secret and refresh token from google, follow [this guide](https://stackoverflow.com/questions/24098461/nodemailer-gmail-what-exactly-is-a-refresh-token-and-how-do-i-get-one).

4. Build the container.
``` 
docker compose build
```
5. Start the containers.
``` 
docker compose up -d
```

6. Create the database tables
```
cat ./init.sql | docker exec -i con_carbonclicks_database psql -U postgres -d postgres
```


## Why open source?
We chose the **Functional Source Licence** because we believe that measuring website carbon emissions is a utility that should be available to every website owner and operator. By opting for the FSL-1.1-MIT, we have made sure that any future development and distribution of CarbonClicks will be available to everyone. The internet uses a huge amount of energy each year and CarbonClicks is a tool that can be used to aid developers and website owners to lower their digital emissions.

For more detail please read [the full license](/LICENSE.md).

### Functional Source License

The Functional Source License (FSL) is a strategic licensing approach adopted by Considerate Digital for its software products that balances openness with business sustainability. Here's why we've chosen this licensing model:

#### What the FSL Provides

The FSL offers a middle ground between fully open source and proprietary software by:

1. Allowing anyone to run our software for themselves or their business without restrictions
2. Providing identical features across both SaaS and self-hosted deployments (no open-core model)
3. Imposing minimal limitations on code usage
4. Including specific protections against commercial exploitation

#### How the FSL Works
The Functional Source License is best described as "eventually open source." While not currently OSI-approved, it provides nearly all open-source freedoms with one key restriction: **you cannot offer a commercial version of our software products**.

The most innovative aspect of the FSL is its time-limited nature. After a two-year grace period, the license automatically converts to the standard MIT license, removing all restrictions.

#### Why We Chose This Approach
This licensing decision stems from our need to balance two competing objectives:

- Making our software as freely available as possible
- Ensuring business sustainability by preventing others from selling our work without contributing back


## Contributing
We welcome contributions from everyone, whether that's fixing some of the core code or a spelling mistake. If you're interested in making contributions to CarbonClicks then please read our "Code of Conduct" before you make any suggestions or send a pull request.

To get started working on the codebase, follow our [development setup guide](/DEV_SETUP.md).

### Reporting bugs
Before submitting an issue, please take a few seconds to do a quick search to check that your issue has not already been raised or fixed. 
You can report bugs by submitting a new issue. The more detail you can provide in your issue, the better our team will be able to help you. Note that we expect anyone submitting a bug to adhere to our "Code of Conduct".

### Future Development
Here, in no particular order, are a list of future developments we'd like to undertake:
- Add further insights to the dashboard (ideas welcome!)
- Remove the reliance on Google Mail for the login and email provision.
- Replace the incoming data API with Actix (Rust)
- Replace the worker scripts with WASM using Rust wasm-bindgen.

## History & Credits
Much of the groundwork for this software was developed at [Neuto](https://neuto.co.uk), a startup based in Glasgow, UK. I co-founded Neuto with the designer Christiano Mere. Neuto folded in spring 2024 but the spirit of the company lives on through this open source software. The team at Neuto wanted to make a difference to the world; we wanted to enable everyone to measure and comprehend the significant impact the web has on our planet. It was always our plan in the early days to open source the software but with the pace that is necessitated by the nature of startups we were unable to do so whilst simultaneously working on the business.

Now, after months of writing CarbonClicks, I'm thrilled to be able to offer this new code base for free to everyone who wants to measure their website's carbon emissions accurately and in real-time. The license chosen enables anyone to run the software for themselves or their business. This ethos fits well with the values that brought the team at Neuto together and latterly the work done by [Considerate Digital](https://considerate.digital).

The architecture and functionality of CarbonClicks is substantially different from the software I created and wrote at Neuto. The "Neuto Carbon Monitor" would scan websites using a headless browser and combine that data with Google Analytics data to create a "point-in-time", snapshot of a website's carbon emissions profile. Whilst innovative, this process was energy-intensive and provided data that was not as accurate as possible. CarbonClicks works much more like analytics software, in that there is no need to scan websites, no Google Analytics data, and carbon emissions data can be provided in "real-time". I wrote CarbonClicks whilst working at Considerate Digital, and I am indebted to Jen Sykes and the team here who have supported this development alongside our regular work load. Considerate Digital works on a wide range of projects, so if you're looking for research and prototyping software and hardware, [send us a message](https://considerate.digital).


### Credits
- **Neuto GUI designs (no longer in use), discussion and support**: Christiano Mere (Neuto Co-Founder)
- **Content writing, testing and discussion**: Natalie Whittle & Róise Nic an Bheatha (Neuto team members)
- **CarbonClicks GUI designs, discussion and support**: Jen Sykes & Considerate Digital


Thanks and good luck lowering those emissions!

Alex McCartney


## License
CarbonClicks is distributed under [FSL-1.1-MIT](/LICENSE.md). The name "CarbonClicks" and the associated logo are trademarked.
