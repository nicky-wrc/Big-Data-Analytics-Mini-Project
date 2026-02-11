FROM node:20-slim

RUN apt-get update && apt-get install -y python3 python3-pip && \
    pip3 install scikit-learn joblib numpy --break-system-packages && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8000
CMD ["node", "src/index.js"]
