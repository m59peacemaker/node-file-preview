FROM pmkr/fonts:latest AS fonts

FROM node:14.4.0-buster

COPY --from=fonts /usr/share/fonts /usr/share/fonts

# MOAR FONTZ
RUN mkdir /usr/share/fonts/google \
	&& git clone https://github.com/google/fonts /usr/share/fonts/google/git \
	&& cd /usr/share/fonts/google \
	&& mv git/apache ./ \
	&& mv git/ofl ./ \
	&& mv git/ufl ./ \
	&& rm -rf git

# bash - for better shell script support and nice poking around in the container
# dumb-init - must have for running processes in docker
# git - for installing npm packages from git
# openssh-client - for accessing private git repos over ssh
# python-pip - for installing python clis
# vim - for editing files to test and debug things in the container
RUN apt update && apt install -y \
	bash \
	dumb-init \
	git \
	openssh-client \
	python-pip \
	vim

# file-preview utils
RUN apt install -y \
		fontconfig \
		gsfonts \
		ffmpeg \
		imagemagick \
		libreoffice \
		mupdf-tools
RUN pip install unoconv
# libreoffice no longer comes with a packaged python, and unoconv can't handle it
# manually make unoconv use python3 (which libreoffice is using)
RUN sed -i ' 1 s/.*/&3/' "`which unoconv`"

ENV APP_HOME=/home/node
ENV APP_DIR=$APP_HOME/app

RUN mkdir -p $APP_DIR \
  && chown -R node:node $APP_DIR

USER node

WORKDIR $APP_DIR

ENTRYPOINT [ "dumb-init", "--" ]

CMD [ "npm", "start" ]

# init ~/.config/libreoffice
# --terminate_after_init argument seems to be unreliable - unoconv reports the next run as first start
RUN libreoffice --headless & sleep 10; kill $!

COPY --chown=root:root policy.xml /etc/ImageMagick-7/

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .
