# Lightweight Pig Latin Container
FROM eclipse-temurin:8-jre

# Install dependencies
RUN apt-get update && \
    apt-get install -y wget tar && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Hadoop (minimal, for Pig local mode)
ENV HADOOP_VERSION=3.3.6
ENV HADOOP_HOME=/opt/hadoop
RUN wget -q https://archive.apache.org/dist/hadoop/common/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz && \
    tar -xzf hadoop-${HADOOP_VERSION}.tar.gz && \
    mv hadoop-${HADOOP_VERSION} ${HADOOP_HOME} && \
    rm hadoop-${HADOOP_VERSION}.tar.gz

# Install Pig
ENV PIG_VERSION=0.17.0
ENV PIG_HOME=/opt/pig
RUN wget -q https://archive.apache.org/dist/pig/pig-${PIG_VERSION}/pig-${PIG_VERSION}.tar.gz && \
    tar -xzf pig-${PIG_VERSION}.tar.gz && \
    mv pig-${PIG_VERSION} ${PIG_HOME} && \
    rm pig-${PIG_VERSION}.tar.gz

# Set environment variables
ENV PATH=${PIG_HOME}/bin:${HADOOP_HOME}/bin:${PATH}
ENV JAVA_HOME=/opt/java/openjdk
ENV PIG_CLASSPATH=${HADOOP_HOME}/etc/hadoop

# Set memory limits for Java
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Create directories
RUN mkdir -p /datasets /scripts /exercises

WORKDIR /app

# Keep container running
CMD ["tail", "-f", "/dev/null"]
