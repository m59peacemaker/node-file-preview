# ffmpeg - http://ffmpeg.org/download.html
# From https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu

FROM ubuntu:18.04

RUN apt update

RUN apt install -y --no-install-recommends \
	curl \
	ca-certificates \
	autoconf \
	automake \
	build-essential \
	cmake \
	pkg-config \
	yasm \
	nasm

RUN apt install -y --no-install-recommends \
	libopenjp2-7-dev \
	libtheora-dev \
	libvpx-dev \
	libwebp-dev \
	libx264-dev \
	libx265-dev \
	libxvidcore-dev
	# libkvazaar-dev
	# autoconf \
	# automake \
	# bzip2 \
	# cmake \
	# curl \
	# expat \
	# g++ \
	# gcc \
	# git \
	# gperf \
	# libexpat1-dev \
	# libgomp1 \
	# libssl-dev \
	# libtool \
	# make \
	# nasm \
	# perl \
	# python \
	# yasm \
	# zlib1g-dev

#WORKDIR /tmp/workdir

##ENV LD_LIBRARY_PATH=/opt/ffmpeg/lib
#ENV PKG_CONFIG_PATH=/opt/ffmpeg/lib/pkgconfig
RUN ldconfig -v | grep openjp2
RUN pkg-config --list-all

ENV PREFIX=/usr




#ENV OGG_VERSION=1.3.3
#ENV OPENJPEG_VERSION=2.3.1
#ENV THEORA_VERSION=1.1.1
#ENV VPX_VERSION=1.8.0
#ENV WEBP_VERSION=1.0.3
#ENV X264_VERSION=20191021-2245-stable
#ENV X265_VERSION=3.2
#ENV XVID_VERSION=1.3.4
#ENV KVAZAAR_VERSION=1.3.0
#ENV AOM_VERSION=v1.0.0

#ARG XVID_SHA256SUM="4e9fd62728885855bc5007fe1be58df42e5e274497591fec37249e1052ae316f xvidcore-1.3.4.tar.gz"

#### libogg https://www.xiph.org/ogg/
#RUN \
#	DIR=/tmp/ogg && \
#	mkdir -p ${DIR} && \
#	cd ${DIR} && \
#	curl -sLO https://downloads.xiph.org/releases/ogg/libogg-${OGG_VERSION}.tar.gz && \
#	tar -zx --strip-components=1 -f libogg-${OGG_VERSION}.tar.gz && \
#	./configure --prefix="${PREFIX}" --enable-static && \
#	make && \
#	make install && \
#	rm -rf ${DIR}

### x264 http://www.videolan.org/developers/x264.html
#RUN \
#	DIR=/tmp/x264 && \
#	mkdir -p ${DIR} && \
#	cd ${DIR} && \
#	curl -sL https://download.videolan.org/pub/videolan/x264/snapshots/x264-snapshot-${X264_VERSION}.tar.bz2 | \
#	tar -jx --strip-components=1 && \
#	./configure --prefix="${PREFIX}" --enable-static --enable-pic --disable-cli && \
#	make && \
#	make install && \
#	rm -rf ${DIR}

#### x265 http://x265.org/
#RUN \
#	DIR=/tmp/x265 && \
#	mkdir -p ${DIR} && \
#	cd ${DIR} && \
#	curl -sL https://download.videolan.org/pub/videolan/x265/x265_${X265_VERSION}.tar.gz	| \
#	tar -zx && \
#	cd x265_${X265_VERSION}/build/linux && \
#	sed -i "/-DEXTRA_LIB/ s/$/ -DCMAKE_INSTALL_PREFIX=\${PREFIX}/" multilib.sh && \
#	sed -i "/^cmake/ s/$/ -DENABLE_CLI=OFF/" multilib.sh && \
#	./multilib.sh && \
#	make -C 8bit install && \
#	rm -rf ${DIR}

#### libtheora http://www.theora.org/
#RUN \
#	DIR=/tmp/theora && \
#	mkdir -p ${DIR} && \
#	cd ${DIR} && \
#	curl -sLO https://downloads.xiph.org/releases/theora/libtheora-${THEORA_VERSION}.tar.gz && \
#	tar -zx --strip-components=1 -f libtheora-${THEORA_VERSION}.tar.gz && \
#	./configure --prefix="${PREFIX}" --enable-static && \
#	make && \
#	make install && \
#	rm -rf ${DIR}

#### libvpx https://www.webmproject.org/code/
#RUN \
#	DIR=/tmp/vpx && \
#	mkdir -p ${DIR} && \
#	cd ${DIR} && \
#	curl -sL https://codeload.github.com/webmproject/libvpx/tar.gz/v${VPX_VERSION} | \
#	tar -zx --strip-components=1 && \
#	./configure --prefix="${PREFIX}" --enable-vp8 --enable-vp9 --enable-vp9-highbitdepth --enable-pic --enable-static \
#	--disable-debug --disable-examples --disable-docs --disable-install-bins	&& \
#	make && \
#	make install && \
#	rm -rf ${DIR}

#### libwebp https://developers.google.com/speed/webp/
#RUN \
#	DIR=/tmp/vebp && \
#	mkdir -p ${DIR} && \
#	cd ${DIR} && \
#	curl -sL https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-${WEBP_VERSION}.tar.gz | \
#	tar -zx --strip-components=1 && \
#	./configure --prefix="${PREFIX}" --enable-static && \
#	make && \
#	make install && \
#	rm -rf ${DIR}

#### xvid https://www.xvid.com/
#RUN \
#	DIR=/tmp/xvid && \
#	mkdir -p ${DIR} && \
#	cd ${DIR} && \
#	curl -sLO http://downloads.xvid.org/downloads/xvidcore-${XVID_VERSION}.tar.gz && \
#	echo ${XVID_SHA256SUM} | sha256sum --check && \
#	tar -zx -f xvidcore-${XVID_VERSION}.tar.gz && \
#	cd xvidcore/build/generic && \
#	./configure --prefix="${PREFIX}" --bindir="${PREFIX}/bin" --datadir="${DIR}" --enable-static --enable-static && \
#	make && \
#	make install && \
#	rm -rf ${DIR}

### openjpeg https://github.com/uclouvain/openjpeg
#RUN \
#	DIR=/tmp/openjpeg && \
#	mkdir -p ${DIR} && \
#	cd ${DIR} && \
#	curl -sL https://github.com/uclouvain/openjpeg/archive/v${OPENJPEG_VERSION}.tar.gz | \
#	tar -zx --strip-components=1 && \
#	cmake -DBUILD_THIRDPARTY:BOOL=ON -DCMAKE_INSTALL_PREFIX="${PREFIX}" . && \
#	make && \
#	make install && \
#	rm -rf ${DIR}

### kvazaar https://github.com/ultravideo/kvazaar
#RUN \
#	DIR=/tmp/kvazaar && \
#	mkdir -p ${DIR} && \
#	cd ${DIR} && \
#	curl -sLO https://github.com/ultravideo/kvazaar/archive/v${KVAZAAR_VERSION}.tar.gz &&\
#	tar -zx --strip-components=1 -f v${KVAZAAR_VERSION}.tar.gz && \
#	./autogen.sh && \
#	./configure -prefix="${PREFIX}" --disable-static --enable-static && \
#	make && \
#	make install && \
#	rm -rf ${DIR}

### aom
#RUN \
#	DIR=/tmp/aom && \
#	git clone --branch ${AOM_VERSION} --depth 1 https://aomedia.googlesource.com/aom ${DIR} ; \
#	cd ${DIR} ; \
#	rm -rf CMakeCache.txt CMakeFiles ; \
#	mkdir -p ./aom_build ; \
#	cd ./aom_build ; \
#	cmake -DCMAKE_INSTALL_PREFIX="${PREFIX}" -DBUILD_SHARED_LIBS=1 ..; \
#	make ; \
#	make install ; \
#	rm -rf ${DIR}



ENV FFMPEG_VERSION=4.2.1

## ffmpeg https://ffmpeg.org/
RUN DIR=/tmp/ffmpeg && mkdir -p ${DIR} && cd ${DIR} \
	&& curl -sLO https://ffmpeg.org/releases/ffmpeg-${FFMPEG_VERSION}.tar.bz2 \
	&& tar -jx --strip-components=1 -f ffmpeg-${FFMPEG_VERSION}.tar.bz2



RUN DIR=/tmp/ffmpeg && mkdir -p ${DIR} && cd ${DIR} \
	&& ./configure \
		--prefix="${PREFIX}" \
		--extra-cflags="-I${PREFIX}/include" \
		--extra-ldflags="-L${PREFIX}/lib" \
#		--extra-libs="-lpthread -lm -lz" \
		--extra-ldexeflags="-static" \
		--pkg-config-flags="--static" \
		--enable-libtheora \
		--enable-libvpx \
		--enable-libopenjpeg \
		--enable-libwebp \
		--enable-libx264 \
		--enable-libx265 \
		--enable-libxvid \
#		--enable-libkvazaar \
		--enable-postproc \
		--enable-version3 \
		--enable-gpl \
		--enable-nonfree \
		--disable-debug \
		--disable-doc \
		--disable-ffplay \
		--disable-swresample \
	&& make -j \
	&& make install \
	&& make distclean

#RUN cp ${PREFIX}/bin/* /usr/local/bin/
## cleanup
##RUN \
##	ldd ${PREFIX}/bin/ffmpeg | grep opt/ffmpeg | cut -d ' ' -f 3 | xargs -i cp {} /usr/local/lib/ && \
##	cp ${PREFIX}/bin/* /usr/local/bin/ && \
##	cp -r ${PREFIX}/share/ffmpeg /usr/local/share/ && \
##	LD_LIBRARY_PATH=/usr/local/lib ffmpeg -buildconf

##ENV LD_LIBRARY_PATH=/usr/local/lib
