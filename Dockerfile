# Use the official Node.js 18 image as base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy the rest of the application code to container
COPY . .

# Install dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 3000

# Command to run the TypeScript-compiled application
CMD ["npm", "run", "dev"]
