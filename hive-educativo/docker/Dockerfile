# Lightweight Hive Container
FROM eclipse-temurin:8-jre

# Install dependencies
RUN apt-get update && \
    apt-get install -y wget tar && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Hadoop (minimal, for Hive)
ENV HADOOP_VERSION=3.3.6
ENV HADOOP_HOME=/opt/hadoop
RUN wget -q https://archive.apache.org/dist/hadoop/common/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz && \
    tar -xzf hadoop-${HADOOP_VERSION}.tar.gz && \
    mv hadoop-${HADOOP_VERSION} ${HADOOP_HOME} && \
    rm hadoop-${HADOOP_VERSION}.tar.gz

# Install Hive
ENV HIVE_VERSION=3.1.3
ENV HIVE_HOME=/opt/hive
RUN wget -q https://archive.apache.org/dist/hive/hive-${HIVE_VERSION}/apache-hive-${HIVE_VERSION}-bin.tar.gz && \
    tar -xzf apache-hive-${HIVE_VERSION}-bin.tar.gz && \
    mv apache-hive-${HIVE_VERSION}-bin ${HIVE_HOME} && \
    rm apache-hive-${HIVE_VERSION}-bin.tar.gz

# Set environment variables
ENV PATH=${HIVE_HOME}/bin:${HADOOP_HOME}/bin:${PATH}
ENV JAVA_HOME=/opt/java/openjdk
ENV HIVE_CONF_DIR=${HIVE_HOME}/conf

# Set memory limits for Java
ENV HADOOP_HEAPSIZE=512

# Create directories
RUN mkdir -p /datasets /scripts /warehouse && \
    chmod 777 /warehouse

# Initialize Derby database for Hive metastore
RUN ${HIVE_HOME}/bin/schematool -initSchema -dbType derby || true

WORKDIR /app

# Keep container running
CMD ["tail", "-f", "/dev/null"]
