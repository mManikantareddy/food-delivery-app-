# Step 1: Use an official light-weight Nginx image based on Alpine Linux
FROM nginx:alpine

# Step 2: Set working directory to Nginx's default public web directory
WORKDIR /usr/share/nginx/html

# Step 3: Remove default static assets provided by Nginx
RUN rm -rf ./*

# Step 4: Copy local website source code into the container's Nginx directory
COPY . .

# Step 5: Expose port 80 (standard HTTP port)
EXPOSE 80

# Step 6: Start Nginx in the foreground so the container stays running
CMD ["nginx", "-g", "daemon off;"]
