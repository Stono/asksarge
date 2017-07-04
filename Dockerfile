FROM centos:7
MAINTAINER Karl Stoney <me@karlstoney.com>

RUN groupadd sarge && \
    useradd -g sarge sarge

# Get nodejs repos
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -

RUN yum -y -q update && \
    yum -y -q remove iputils && \
    yum -y -q install nodejs && \
    yum -y -q clean all

# Install sarge
RUN mkdir -p /app
WORKDIR /app
EXPOSE 8999
CMD ["npm", "run", "start"]

COPY package.json /app
RUN cd /app && \
    npm install --quiet && \
    chown -R sarge:sarge /app
COPY ./ /app
RUN npm run assets
RUN find . -type d \( -path ./node_modules \) -prune -o -exec chown sarge:sarge {} \;
USER sarge
