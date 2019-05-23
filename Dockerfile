FROM pmkr/dumb-node:12.2.0

ADD ./fonts.tar.gz /usr/share/fonts/

RUN apk add --no-cache fontconfig ghostscript-fonts
RUN apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing \
	py3-unoconv
RUN apk add --no-cache ffmpeg imagemagick libreoffice mupdf-tools

ENV APP_HOME=/home/node
ENV APP_DIR=$APP_HOME/app

RUN mkdir -p $APP_DIR \
  && chown -R node:node $APP_DIR

USER node

WORKDIR $APP_DIR

# init ~/.config/libreoffice
RUN libreoffice --headless --terminate_after_init
COPY --chown=node:node lib/basic $APP_HOME/.config/libreoffice/4/user/basic
RUN chown -R node:node $APP_HOME/.config

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

COPY --chown=root:root policy.xml /etc/ImageMagick-7/

CMD [ "npm", "start" ]
