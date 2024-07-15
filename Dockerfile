# Use the official Node.js image from the Docker Hub
FROM node:18

# Create and set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Define the command to run the application
CMD ["node", "index.js"]
