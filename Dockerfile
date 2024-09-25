##serve step
# ---- base node
FROM alpine:3.19.1 AS base

WORKDIR /app

# Installs latest Chromium (100) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      npm
# Set entrypoint, so that it can be cached?


# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Puppeteer v13.5.0 works with Chromium 100.
# Puppeteer is installed by the node app, so this might be unecessary
# RUN npm puppeteer

# Add user so we don't need --no-sandbox.
#RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
#    && mkdir -p /home/pptruser/Downloads /app \
#    && chown -R pptruser:pptruser /home/pptruser \
#    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
#USER pptruser



#copy package.json
COPY package.json .

# update npm 
RUN npm update -g npm
# install terser
RUN npm install -g terser

# ---- Dependencies
FROM base as dependencies
WORKDIR /app
RUN npm set progress=false && npm config set depth 0
# install only production deps
RUN npm install --omit=dev --include=optional
# set prod deps aside
RUN cp -R node_modules prod_node_modules

# ---- test
# use this to run any linters, setup and tests

# ---- Release
FROM base AS release
WORKDIR /app
# install all the node modules including dev deps
RUN npm install --include=optional

# copy prod node modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
# copy app sources
COPY . .

RUN npm run build

EXPOSE 3000

CMD npm run start

