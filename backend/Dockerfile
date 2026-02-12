FROM node:20-slim

# Install Python and ML dependencies
RUN apt-get update && apt-get install -y python3 python3-pip && \
    pip3 install scikit-learn joblib numpy --break-system-packages && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source
COPY backend/src ./src

# Copy model files
COPY model /app/model

# Copy spark output (for analytics data)
COPY spark/output /app/spark/output

EXPOSE 8000
CMD ["node", "src/index.js"]
