# FROM pmkr/fonts:latest AS fonts

FROM node:18.20.8-bullseye-slim

# COPY --from=fonts /usr/share/fonts /usr/share/fonts

# MOAR FONTZ
# RUN mkdir /usr/share/fonts/google \
# 	&& git clone https://github.com/google/fonts /usr/share/fonts/google/git \
# 	&& cd /usr/share/fonts/google \
# 	&& mv git/apache ./ \
# 	&& mv git/ofl ./ \
# 	&& mv git/ufl ./ \
# 	&& rm -rf git

# bash - for better shell script support and nice poking around in the container
# dumb-init - must have for running processes in docker
# git - for installing npm packages from git
# openssh-client - for accessing private git repos over ssh
# vim - for editing files to test and debug things in the container
RUN apt update && apt install -y \
	bash \
	curl \
	dumb-init \
	git \
	openssh-client \
	procps \
	unzip \
	vim

# file-preview utils
RUN apt install -y \
		fontconfig \
		gsfonts \
		ffmpeg \
		imagemagick \
		libreoffice \
		unoconv
# libreoffice no longer comes with a packaged python, and unoconv can't handle it
# manually make unoconv use python3 (which libreoffice is using)
# RUN sed -i ' 1 s/.*/&3/' "`which unoconv`"

RUN curl -L -o /tmp/qpdf.zip https://github.com/qpdf/qpdf/releases/download/v12.2.0/qpdf-12.2.0-bin-linux-x86_64.zip \
	&& mkdir /opt/qpdf \
	&& unzip -d /opt/qpdf /tmp/qpdf.zip

ENV PATH="/opt/qpdf/bin:${PATH}"

RUN apt install -y build-essential ninja-build clang lld pkg-config
RUN git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git /opt/depot_tools
RUN export PATH="/opt/depot_tools:$PATH" \
	&& mkdir /opt/pdfium && cd /opt/pdfium \
	&& gclient config --unmanaged https://pdfium.googlesource.com/pdfium.git \
	&& gclient sync

RUN cd /opt/pdfium/pdfium \
	&& export PATH="/opt/depot_tools:$PATH" \
	&& gn gen out/Release --args='is_debug=false pdf_is_standalone=true clang_use_chrome_plugins=false pdf_enable_v8=false pdf_enable_xfa=false pdf_use_skia=false use_glib=false use_lld=true symbol_level=0 target_cpu="x64" use_sysroot=false treat_warnings_as_errors=false' \
	&& ninja -C out/Release pdfium_test

ENV PATH="/opt/pdfium/pdfium/out/Release:$PATH"

ENV APP_HOME=/home/node
ENV APP_DIR=$APP_HOME/app

RUN mkdir -p $APP_DIR \
  && chown -R node:node $APP_DIR

USER node

WORKDIR $APP_DIR

COPY --chown=node:node ./entrypoint.dev.sh $APP_HOME/
ENTRYPOINT dumb-init $APP_HOME/entrypoint.dev.sh $0 $@

CMD [ "bash" ]

# init ~/.config/libreoffice
# --terminate_after_init argument seems to be unreliable - unoconv reports the next run as first start
RUN libreoffice --headless & sleep 10; kill $!

COPY --chown=root:root policy.xml /etc/ImageMagick-7/
