FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy only package files first (layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set timezone (opsional, jika dibutuhkan di dalam container)
ENV TZ=Asia/Jakarta

# Expose port (ubah jika port kamu bukan 5003)
EXPOSE 5003

# Jalankan aplikasi
CMD ["npm", "start"]
