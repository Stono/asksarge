FROM centos:7
MAINTAINER Karl Stoney <me@karlstoney.com>

RUN groupadd sarge && \
    useradd -g sarge sarge

# Get nodejs repos
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -

RUN yum -y -q update && \
    yum -y -q remove iputils && \
    yum -y -q install wget epel-release openssl openssl-devel tar unzip \
							libffi-devel python-devel redhat-rpm-config git-core \
							gcc gcc-c++ make zlib-devel pcre-devel ca-certificates \
              ruby rubygemsi nodejs && \
    yum -y -q clean all

# Install sarge
RUN mkdir -p /app
WORKDIR /app
EXPOSE 8999
CMD ["npm", "run", "start"]

COPY package.json /app

RUN cd /app && \
    npm install --quiet

COPY ./ /app

RUN chown sarge:sarge /app

RUN npm run assets
RUN find . -type d \( -path ./node_modules \) -prune -o -exec chown sarge:sarge {} \;
USER sarge
