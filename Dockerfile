# Base image dùng Node 18 alpine nhẹ
FROM node:20-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm devDependencies vì chạy dev)
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Mở port mặc định NestJS
EXPOSE 5173

# Chạy ứng dụng với lệnh dev (hot reload)
CMD ["npm", "run", "dev"]
