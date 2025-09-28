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

RUN apt install -y build-essential ninja-build clang lld pkg-config
RUN git clone --depth=1 --filter=blob:none --no-tags --single-branch \
  https://chromium.googlesource.com/chromium/tools/depot_tools.git /opt/depot_tools

RUN export PATH="/opt/depot_tools:$PATH" \
	&& export DEPOT_TOOLS_UPDATE=0 DEPOT_TOOLS_METRICS=0 \
	&& mkdir /opt/pdfium && cd /opt/pdfium \
	&& gclient config --unmanaged --spec='solutions=[{ \
		"name":"pdfium", \
		"url":"https://pdfium.googlesource.com/pdfium.git", \
		"deps_file":"DEPS", \
		"managed":False, \
		"custom_deps":{}, \
		"custom_vars":{"checkout_configuration":"minimal"} \
	}]' \
	&& gclient sync --no-history \
	&& ensure_bootstrap

RUN cd /opt/pdfium/pdfium \
	&& export PATH="/opt/depot_tools:$PATH" \
	&& gn gen out/Release --args='is_debug=false pdf_is_standalone=true clang_use_chrome_plugins=false pdf_enable_v8=false pdf_enable_xfa=false pdf_use_skia=false use_glib=false use_lld=true symbol_level=0 target_cpu="x64" use_sysroot=false treat_warnings_as_errors=false' \
	&& ninja -C out/Release pdfium_test \
	&& mv out/Release/pdfium_test /usr/bin/

RUN rm -r /opt/pdfium /opt/depot_tools

ENV APP_HOME=/home/node
ENV APP_DIR=$APP_HOME/app

RUN mkdir -p $APP_DIR \
  && chown -R node:node $APP_DIR

USER node

WORKDIR $APP_DIR

ENTRYPOINT [ "dumb-init", "--" ]

CMD [ "bash", "-c", "npm install" ]

# init ~/.config/libreoffice
# --terminate_after_init argument seems to be unreliable - unoconv reports the next run as first start
RUN libreoffice --headless & sleep 10; kill $!

COPY --chown=root:root policy.xml /etc/ImageMagick-7/
